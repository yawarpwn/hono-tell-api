import { eq, and, type SQL, ilike, like } from 'drizzle-orm'
import { customersTable, usersTable } from '@/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateCustomerDto, UpdateCustomerDto, CustomerDto, LoginDto } from '@/types'
import { insertQuotationSchema, loginSchema, updateCustomerSchema } from '@/dtos'
import type { DB } from '@/types'

export class AuthModel {
  static async login(db: DB, user: LoginDto) {
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
}
