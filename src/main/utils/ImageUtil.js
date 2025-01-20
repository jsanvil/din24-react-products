import sharp from 'sharp'

export default class ImageUtil {
  static async resize(imagePath, width, height) {
    let image = sharp(imagePath)
    // resize if image is larger than the specified dimensions
    if (image.width > width || image.height > height) {
      image = await image.resize(width, height, { fit: 'inside' })
    }
    const result = await image.toFormat('webp').toBuffer()
    return result.toString('base64')
  }

  static async toFile(imageBuffer, outputPath, format = 'webp') {
    const image = sharp(imageBuffer)
    return await image.toFormat(format).toFile(outputPath)
  }

  static async base64ToFile(base64, outputPath) {
    const buffer = Buffer.from(base64, 'base64')
    return await ImageUtil.toFile(buffer, outputPath)
  }

  static async fileToBase64(filePath) {
    const buffer = await sharp(filePath).toBuffer()
    return buffer.toString('base64')
  }
}
