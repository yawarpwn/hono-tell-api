// import type { ResourceApiResponse, TransformationOptions, UploadApiOptions, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'
import { type SignApiOptions, UploadApiResponse, v2 } from 'cloudinary'
import { API_REST_CLOUDINARY } from '@/constants'

type UploadResponse = {
  secure_url: string
  width: number
  height: number
  format: string
  public_id: string
}

export function getClient(apiSecret: string) {
  v2.config({
    cloud_name: 'tellsenales-cloud',
    api_key: '781191585666779',
    api_secret: apiSecret,
    secure: true,
  })
  return v2
}

/*
 * Returns a timestamp, signature and api_key
 * to be used in the cloudinary upload
 */
export function getSignature(apiSecret: string, signOptions?: SignApiOptions) {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const cloudinaryClient = getClient(apiSecret)

  const sign = cloudinaryClient.utils.sign_request({
    timestamp,
    ...signOptions,
  })

  const cloudName = cloudinaryClient.config().cloud_name!

  return {
    timestamp: timestamp.toString(),
    signature: sign.signature,
    cloudName,
    apiKey: sign.api_key,
  }
}

export async function destroyImage(publicId: string, apiSecret: string) {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const cloudName = 'tellsenales-cloud'
  const signature = v2.utils.api_sign_request(
    {
      timestamp,
      public_id: publicId,
    },
    apiSecret,
  )
  const url = `${API_REST_CLOUDINARY}/${cloudName}/image/destroy`
  const api_key = '781191585666779'

  const formData = new FormData()
  formData.append('public_id', publicId)
  formData.append('signature', signature)
  formData.append('timestamp', timestamp.toString())
  formData.append('api_key', api_key)

  return fetch(url, {
    method: 'POST',
    body: formData,
  }).then((res) => res.json())
}

type Options = {
  transformation?: string
  folder?: string
}
export async function uploadImage(apiSecret: string, file: File, options?: Options) {
  const transformation = options?.transformation
  const format = 'webp'
  const folder = options?.folder

  const { timestamp, apiKey, signature, cloudName } = getSignature(apiSecret, {
    transformation,
    format,
    folder,
  })

  const formData = new FormData()
  formData.append('file', file)
  formData.append('signature', signature)
  formData.append('timestamp', timestamp)
  formData.append('api_key', apiKey)
  formData.append('folder', folder || '')
  formData.append('transformation', transformation || '')
  formData.append('format', format)
  // formData.append('eager', eager)

  return fetch(`${API_REST_CLOUDINARY}/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  }).then((res) => {
    // if (!res.ok) throw new Error('Network response was not ok')
    return res.json<UploadResponse>()
  })
}
