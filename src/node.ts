import pdfmake from 'pdfmake'
import { fonts } from './fonts/Roboto'

const createPdfBinary = (pdfDoc: PDFKit.PDFDocument): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chucks: Buffer[] = []
    pdfDoc.on('data', (chuck) => [chucks.push(chuck)])

    pdfDoc.on('end', () => {
      resolve(Buffer.concat(chucks))
    })

    pdfDoc.end()
  })
}
const printer = new pdfmake(fonts)
const pdfDoc = printer.createPdfKitDocument({ content: 'prueba' })

const pdfBinary = await createPdfBinary(pdfDoc)
async function main() {
  // const pdfDoc = pdfmake.createPdf({ content: 'pruebita' }, undefined, fonts)
  // pdfDoc.getBlob((blob) => {
  //   console.log(blob)
  // })
}

main()
