import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

//TODO: implement Custom Error

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

type ApiRucErrorResponse = {
  success: false
  message: string
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

function isApiDniresponseSuccess(apiResponse: ApiDniReponse): apiResponse is ApiDniSuccessResponse {
  return apiResponse.success
}

type ApiRucResponse = ApiRucSuccessResponse | ApiRucErrorResponse

function isApiRucResponseSuccess(apiResponse: ApiRucResponse): apiResponse is ApiRucSuccessResponse {
  return !('success' in apiResponse) || apiResponse.success !== false
}

/*
 * Obtains the customer data from the sunat api
 */
export async function getCustomerByRuc(ruc: string) {
  const API_URL = 'https://dniruc.apisperu.com/api/v1'
  const TOKEN =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im5leWRhLm1pbGkxMUBnbWFpbC5jb20ifQ.UtiFRViVJrO2YGQ5H3alRcFBhnSwuE5yKU9PYuojgq0'
  const url = `${API_URL}/ruc/${ruc}?token=${TOKEN}`

  const res = await fetch(url)

  if (!res.ok) {
    throw new HTTPException(res.status as ContentfulStatusCode, {
      message: `HTTP Error: ${res.statusText}`,
    })
  }
  const data = (await res.json()) as ApiRucResponse

  //Check if the response is success
  if (!isApiRucResponseSuccess(data)) {
    throw new HTTPException(404, {
      message: data.message,
    })
  }

  return {
    ruc: data.ruc,
    name: data.razonSocial,
    address: data.direccion,
  }
}

/*
 * Obtener datos de la persona por DNI
 */
export async function getCustomerByDni(dni: string) {
  const URL = `https://apiperu.dev/api/dni/${dni}`
  const TOKEN = '66ec9b5c4d6e359a3ca2117ce321ceddbd1aa54b5ea29a38e0a6eed061308dc1'
  // curl -H 'Accept: application/json' -H "Authorization: Bearer $TOKEN" https://api.apis.net.pe/v2/reniec/dni?numero=46027897
  const res = await fetch(URL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  })

  if (!res.ok)
    throw new HTTPException(res.status as ContentfulStatusCode, {
      message: `HTTP Error: ${res.statusText}`,
    })
  const info = (await res.json()) as ApiDniReponse

  if (!isApiDniresponseSuccess(info)) {
    throw new HTTPException(404, { message: 'No se encontraron registros' })
  }

  const { nombres, apellido_materno, apellido_paterno } = info.data

  return {
    ruc: String(dni),
    name: `${nombres} ${apellido_paterno} ${apellido_materno}`,
    address: '',
  }
}
