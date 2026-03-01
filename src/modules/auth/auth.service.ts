import { eq } from 'drizzle-orm'
import { usersTable } from '@/core/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { Login } from './auth.validation'
import type { User } from '../users/users.validation.ts'
import type { DB } from '@/types'
import { UsersService } from '../users/users.service'
import bcrypt from 'bcryptjs'
import { verify, sign } from 'hono/jwt'

const ACCESS_TOKEN_EXPIRY = 60 * 60 // 1 hora
const REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 // 1 día

type Secret = {
  access: string
  refresh: string
}

type PayloadResponse = {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    role: string
    firstName: string
    lastName: string
    avatar: string
  }
}

export class AuthService {
  static async validateCredentials(db: DB, login: Login): Promise<User> {
    //Busca el usuario en DB por email
    const users = await db.select().from(usersTable).where(eq(usersTable.email, login.email))
    if (users.length === 0) {
      throw new HTTPException(403, {
        message: 'Usuario no encontrado',
      })
    }

    const [user] = users

    // Valida usuario
    const isValidPassword = bcrypt.compareSync(login.password, user.password)
    if (!isValidPassword) {
      throw new HTTPException(403, {
        message: 'Invalid password',
      })
    }

    return user
  }

  static async login(db: DB, login: Login, secret: Secret): Promise<PayloadResponse> {
    // 1. Validar credenciales
    const user = await AuthService.validateCredentials(db, login)

    // 2. Generar par de tokens
    const accessToken = await AuthService.generateAccessToken(user, secret.access)
    const refreshToken = await AuthService.generateRefreshToken(user, secret.refresh)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
    }
  }

  static async hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    return hash
  }

  static async verifyToken(token: string, secret: string) {
    try {
      const payload = await verify(token, secret)
      return payload
    } catch (error) {
      if (error instanceof Error && error.name === 'JwtTokenExpired') {
        console.log('TokenExpiredError')
        throw new HTTPException(401, {
          message: error.message,
        })
      } else if (error instanceof Error && error.name === 'JsonWebTokenError') {
        console.log('JsonWebTokenError')
        throw new HTTPException(401, {
          message: error.message,
        })
      } else {
        throw new HTTPException(401, {
          message: 'Invalid token',
        })
      }
    }
  }

  static async generateAccessToken(user: User, secret: string): Promise<string> {
    const accessToken = await sign(
      {
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRY,
      },
      secret,
    )
    return accessToken
  }

  static async generateRefreshToken(user: User, secret: string): Promise<string> {
    const refreshToken = await sign(
      {
        userId: user.id,
        exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRY,
      },
      secret,
    )

    return refreshToken
  }

  static async refreshToken(db: DB, token: string, secret: Secret): Promise<PayloadResponse> {
    try {
      //1 Verificar el token viejo
      const payload = await verify(token, secret.refresh)

      // 2. Busca al usuario
      //TODO: validar en DB que el token no este revocado
      const user = await UsersService.getById(db, payload.userId as string)

      // 3. Generar nuevo par de tokens (Rotación )
      if (!user) {
        throw new HTTPException(401, {
          message: 'Invalid token',
        })
      }

      const accessToken = await AuthService.generateAccessToken(user, secret.access)
      const refreshToken = await AuthService.generateRefreshToken(user, secret.refresh)

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
        },
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new HTTPException(401, {
          message: error.message,
        })
      } else if (error instanceof Error && error.name === 'JsonWebTokenError') {
        throw new HTTPException(401, {
          message: error.message,
        })
      } else {
        throw new HTTPException(401, {
          message: 'Invalid token',
        })
      }
    }
  }
}
