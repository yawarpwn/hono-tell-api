import { eq } from 'drizzle-orm'
import { usersTable } from '@/core/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { Login } from './auth.validation'
import type { User } from '../users/users.validation.ts'
import type { DB } from '@/types'
import { UsersService } from '../users/users.service'
import bcrypt from 'bcryptjs'
import { verify, sign } from 'hono/jwt'

const ACCESS_TOKEN_EXPIRY = 60 * 60 // 1 hour
const REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 7 // 7 days

export class AuthService {
  static async validateCredentials(db: DB, login: Login): Promise<User> {
    //Search user in db by email
    const users = await db.select().from(usersTable).where(eq(usersTable.email, login.email))
    if (users.length === 0) {
      throw new HTTPException(403, {
        message: 'Usuario no encontrado',
      })
    }

    const [user] = users

    // check password
    const isValidPassword = bcrypt.compareSync(login.password, user.password)
    if (!isValidPassword) {
      throw new HTTPException(403, {
        message: 'Invalid password',
      })
    }

    return user
  }

  static async login(db: DB, login: Login, secret: string) {
    //Search user in db by email
    const user = await AuthService.validateCredentials(db, login)

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

    //TODO: Guardar refreshtoken en `DB`
    const refreshToken = await sign(
      {
        userId: user.id,
        exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRY,
      },
      secret,
    )

    return {
      accessToken,
      refreshToken,
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

  static async refreshToken(db: DB, refreshToken: string, secret: string) {
    try {
      //Verificar refreshToken
      //TODO: utilizar un JWT_REFRESH_SECRET
      const payload = await verify(refreshToken, secret)

      const user = await UsersService.getById(db, payload.userId as string)

      if (!user) {
        throw new HTTPException(401, {
          message: 'Invalid token',
        })
      }

      const newAccessToken = await sign(
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

      console.log('refresh token', { newAccessToken })
      return newAccessToken
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
