// import type { ResourceApiResponse, TransformationOptions, UploadApiOptions, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'
import { type SignApiOptions, v2 } from 'cloudinary'

export function getClient(apiSecret: string) {
  v2.config({
    cloud_name: 'tellsenales-cloud',
    api_key: '781191585666779',
    api_secret: apiSecret,
    secure: true,
  })
  return v2
}

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

// export async function getResources(): Promise<ResourceApiResponse> {
//   return cloudinary.api.resources({
//     type: 'upload',
//     prefix: 'gallery',
//     max_results: 200,
//   })
// }
//
// export async function fetchGalleryImages() {
//   const { resources } = await getResources()
//   const galleryImagesMapped = resources.map((image) => ({
//     url: image.secure_url,
//     publicId: image.public_id,
//     thumb: getThumbUrl(image.public_id),
//   }))
//
//   return galleryImagesMapped
// }
//
// export async function deleteSource(publicId: string) {
//   return cloudinary.uploader.destroy(publicId)
// }
//
// export async function uploadStream(
//   buffer: Buffer,
//   { category, folder, height = 1000 }: { category: string; folder: string; height?: number },
// ): Promise<UploadApiResponse> {
//   const options: UploadApiOptions = {
//     tags: [folder, category],
//     folder: folder,
//     overwrite: true,
//     allowed_formats: ['jpg', 'png', 'webp', 'jpeg', 'avif'],
//     transformation: [
//       {
//         width: 'auto',
//         height: height,
//         crop: 'scale',
//         quality: 'auto',
//         format: 'webp',
//       },
//     ],
//   }
//
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(options, (error, result) => {
//         if (error) {
//           reject(error)
//           return
//         }
//
//         if (!result) {
//           reject(new Error('No result from upload'))
//           return
//         }
//         resolve(result)
//       })
//       .end(buffer)
//   })
// }
//
// export async function uploadAsset(file: string, options: UploadApiOptions) {
//   return cloudinary.uploader.upload(file, options)
// }
//
// export async function uploadImageFile(file: File, options: UploadApiOptions) {
//   const mime = file.type
//   const arrayBuffer = await file.arrayBuffer()
//   const encoding = 'base64'
//   const base64Data = Buffer.from(arrayBuffer).toString('base64')
//   const fileUri = `data:${mime};${encoding},${base64Data}`
//
//   // const options: UploadApiOptions = {
//   // 	tags: [category, folder],
//   // 	folder,
//   // 	overwrite: true,
//   // 	allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//   // 	transformation: [
//   // 		{
//   // 			width: 'auto',
//   // 			height: 1000,
//   // 			crop: 'scale',
//   // 			quality: 'auto',
//   // 			format: 'webp',
//   // 		},
//   // 	],
//   // }
//
//   return cloudinary.uploader.upload(fileUri, options)
// }
//
// export async function destroyResource(publicId: string) {
//   return cloudinary.uploader.destroy(publicId)
// }
//
// export function transform(publicId: string, options: TransformationOptions) {
//   return cloudinary.url(publicId, options)
// }
//
// export function getThumbUrl(publicId: string) {
//   return transform(publicId, {
//     width: 200,
//     crop: 'thumb',
//     format: 'webp',
//   })
// }
//
// export function getLargeUrl(publicId: string) {
//   return transform(publicId, {
//     color: '#FFFFFF4D',
//     overlay: 'n6rplobnplhmm8qoojb5',
//     flags: 'layer_apply',
//     format: 'webp',
//   })
// }
//
// export { cloudinary }
