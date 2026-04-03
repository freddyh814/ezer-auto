import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Folder structure convention:
// ezer-auto/vehicles/{vehicle_id}/
// ezer-auto/site/ (logos, banners, etc.)

export function vehicleFolder(vehicleId: string) {
  return `ezer-auto/vehicles/${vehicleId}`
}

export function getVehicleImages(publicIds: string[]) {
  return publicIds.map((id) => cloudinary.url(id, { secure: true, fetch_format: 'auto', quality: 'auto' }))
}
