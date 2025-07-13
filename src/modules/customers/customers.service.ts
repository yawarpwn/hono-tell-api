import { eq, and, type SQL, ilike, like } from 'drizzle-orm'
import { customersTable } from '@/core/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateCustomerDto, UpdateCustomerDto, CustomerDto } from '@/types'
import { insertCustomerSchema, updateCustomerSchema } from './customers.validation'
import type { DB } from '@/types'

//TODO: implement type CustomerQueryParams
// import type { CustomerQueryParams } from '@/routes'

type Company = {
  ruc: string
  name: string
  address: string
}

type ApiRucErrorResponse = {
  success: false
  message: string
}

type ApiRucSuccessResponse = {
  ruc: string
  razonSocial: string
  nombreComercial: string | null
  estado: string
  condicion: string
  direccion: string
  departamento: string
  provincia: string
  distrito: string
}

type ApiDniErrorResponse = {
  success: true
  message: string
}

type ApiDniSuccessResponse = {
  success: boolean
  data: {
    numero: string
    nombre_completo: string
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    codigo_verificacion: number
    ubigeo_sunat: string
    ubigeo: null[]
    direccion: string
  }
}
type ApiDniReponse = ApiDniSuccessResponse | ApiDniErrorResponse
type ApiRucResponse = ApiRucSuccessResponse | ApiRucErrorResponse

function isApiRucResponseSuccess(apiResponse: ApiRucResponse): apiResponse is ApiRucSuccessResponse {
  return !('success' in apiResponse) || apiResponse.success !== false
}

function isApiDniresponseSuccess(apiResponse: ApiDniReponse): apiResponse is ApiDniSuccessResponse {
  return apiResponse.success
}

export class CustomersService {
  static async getAll(db: DB, { onlyRegular }: any) {
    const rows = await db
      .select()
      .from(customersTable)
      .where(onlyRegular ? eq(customersTable.isRegular, true) : undefined)
    // .limit(pageSize)
    // .offset((page - 1) * pageSize)

    return {
      items: rows,
      metadata: {
        totalItems: rows.length,
        // pageSize: pageSize,
        // pageNumber: page,
      },
      links: {},
    }
  }

  static async getByRucFromSunat(ruc: string): Promise<Company> {
    const API_URL = 'https://dniruc.apisperu.com/api/v1'
    const TOKEN =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im5leWRhLm1pbGkxMUBnbWFpbC5jb20ifQ.UtiFRViVJrO2YGQ5H3alRcFBhnSwuE5yKU9PYuojgq0'
    // https://dniruc.apisperu.com/api/v1/ruc/20131312955?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im5leWRhLm1pbGkxMUBnbWFpbC5jb20ifQ.UtiFRViVJrO2YGQ5H3alRcFBhnSwuE5yKU9PYuojgq0
    const url = `${API_URL}/ruc/${ruc}?token=${TOKEN}`

    const response = await fetch(url)
    if (!response.ok) throw new Error('Network response was not ok')

    const data = (await response.json()) as ApiRucResponse

    if (!isApiRucResponseSuccess(data)) {
      throw new Error(data.message)
    }

    return {
      ruc: data.ruc,
      name: data.razonSocial,
      address: data.direccion,
    }
  }

  static async getByDniFromSunat(dni: string): Promise<Company> {
    const URL = `https://apiperu.dev/api/dni/${dni}`
    const TOKEN = '66ec9b5c4d6e359a3ca2117ce321ceddbd1aa54b5ea29a38e0a6eed061308dc1'
    // curl -H 'Accept: application/json' -H "Authorization: Bearer $TOKEN" https://api.apis.net.pe/v2/reniec/dni?numero=46027897
    const response = await fetch(URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
    })

    if (!response.ok) throw new Error('Network response was not ok')
    const info = (await response.json()) as ApiDniReponse

    if (!isApiDniresponseSuccess(info)) {
      throw new Error('No se encontraron registros')
    }

    const { nombres, apellido_materno, apellido_paterno } = info.data

    return {
      ruc: String(dni),
      name: `${nombres} ${apellido_paterno} ${apellido_materno}`,
      address: '',
    }
  }

  static async getByRuc(db: DB, ruc: CustomerDto['ruc']) {
    const customers = await db.select().from(customersTable).where(eq(customersTable.ruc, ruc))
    if (customers.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with ruc: ${ruc} not found`,
      })
    }
    return customers[0]
  }

  static async getById(db: DB, id: CustomerDto['id']) {
    const customers = await db.select().from(customersTable).where(eq(customersTable.id, id))
    if (customers.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with ruc: ${id} not found`,
      })
    }
    return customers[0]
  }

  static async create(db: DB, dto: CreateCustomerDto) {
    const { data, success, error } = insertCustomerSchema.safeParse(dto)

    if (!success) {
      console.log(error.errors)
      throw new HTTPException(400, {
        message: 'Invalid customer',
      })
    }

    const results = await db.insert(customersTable).values(data).returning({ insertedId: customersTable.id })

    if (results.length === 0) {
      throw new HTTPException(400, {
        message: 'Failed to create customer',
      })
    }

    const [customer] = results
    return customer
  }

  static async update(db: DB, id: CustomerDto['id'], dto: UpdateCustomerDto) {
    const { data, success, error } = updateCustomerSchema.safeParse(dto)

    if (!success) {
      console.log(error.errors)
      throw new HTTPException(400, {
        message: 'Invalid customer',
      })
    }

    if (Object.values(data).length === 0) {
      throw new HTTPException(400, {
        message: 'Invalid customer',
      })
    }

    const results = await db.update(customersTable).set(data).where(eq(customersTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with id ${id} not found`,
      })
    }

    return results[0]
  }

  static async delete(db: DB, id: CustomerDto['id']) {
    const results = await db.delete(customersTable).where(eq(customersTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with id ${id} not found`,
      })
    }
    return results[0]
  }
}
