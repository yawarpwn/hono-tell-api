type Company = {
  ruc: string
  company: string
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
export async function getCompanybyRuc(ruc: string): Promise<Company> {
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
    company: data.razonSocial,
    address: data.direccion,
  }
}

function isApiDniresponseSuccess(apiResponse: ApiDniReponse): apiResponse is ApiDniSuccessResponse {
  return apiResponse.success
}
export async function getCustomerByDni(dni: string): Promise<Company> {
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
    company: `${nombres} ${apellido_paterno} ${apellido_materno}`,
    address: '',
  }
}
