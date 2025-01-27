import sharp from 'sharp'

export default class ImageUtil {
  constructor() {
    sharp.cache(false)
  }

  async resize(imagePath, width, height) {
    let image = sharp(imagePath)
    image = await image.resize(width, height, { fit: 'inside', withoutEnlargement: true })
    const result = await image.toFormat('webp').toBuffer()
    return result.toString('base64')
  }

  async toFile(imageBuffer, outputPath, format = 'webp') {
    let image = sharp(imageBuffer)
    const output = await image.toFormat(format).toFile(outputPath)
    return output
  }

  async base64ToFile(base64, outputPath) {
    let buffer = Buffer.from(base64, 'base64')
    const out = await this.toFile(buffer, outputPath)
    return out
  }

  async fileToBase64(filePath) {
    let buffer = await sharp(filePath).toBuffer()
    const base64String = buffer.toString('base64')
    return base64String
  }
}
