import { eq } from 'drizzle-orm'
import { usersTable } from '@/core/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { Login } from './auth.validation'
import type { DB } from '@/types'
import bcrypt from 'bcryptjs'

export class AuthService {
  static async validateCredentials(db: DB, { email, password }: { email: string; password: string }) {
    const users = await db.select().from(usersTable).where(eq(usersTable.email, email))
    console.log({ users })
    if (users.length === 0) {
      throw new HTTPException(403, {
        message: 'User not found',
      })
    }

    const [user] = users
    const isValidPassword = bcrypt.compareSync(password, user.password)
    if (!isValidPassword) {
      throw new HTTPException(403, {
        message: 'Invalid password',
      })
    }

    return {
      id: user.id,
      email: user.email,
    }
  }
  static async login(db: DB, user: Login) {
    //Search user in db by email
    const [userFromDb] = await db.select().from(usersTable).where(eq(usersTable.email, user.email))
    console.log({ userFromDb })

    if (!userFromDb) {
      throw new HTTPException(404, {
        message: 'User not found',
      })
    }

    return userFromDb
  }
  static async hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    return hash
  }

  static async resetPassword(db: DB, email: string, password: string) {
    const hashedPassword = await AuthService.hashPassword(password)
    const rows = await db.update(usersTable).set({ password: hashedPassword }).where(eq(usersTable.email, email))
    if (!rows.success) throw new HTTPException(500, { message: 'Error updating user' })
  }
}
