import { updateQuotationSchema } from './dtos/index'

const quoToUpdate = {
  id: 'b1f9a9a8-7208-4f7d-9257-003086cc37b0',
  number: 3,
  deadline: 40,
  credit: null,
  includeIgv: true,
  customerId: '86b0f394-404d-431b-a6bf-be0d660472f2',
  isPaymentPending: false,
  items: [
    {
      id: 'bad48085-b6b7-401d-84d0-81f87e43768d',
      price: 85,
      qty: 1,
      cost: 50,
      link: 'https://tellsenales.com/seguridad/senal-preventiva-en-fibra-de-vidrio-4mm-con-lamina-reflectiva-hip/',
      unitSize: '40x40cm',
      description:
        'Señal Vertical Preventiva Lámina: Reflectivo tipo IV Grado Prismático (HIP) marca 3M  Soporte: fibra de vidrio 4mm con platina embebida de 1 1/2"x1/8" Pictograma: Reflectivo Grado Ingenieria',
    },
  ],
  createdAt: '2025-02-01T22:09:40.000Z',
  updatedAt: '2025-02-01T22:59:01.000Z',
}

async function main() {
  const { data, success, error } = updateQuotationSchema.safeParse(quoToUpdate)
  console.log(data, success, error)
  // const pdfDoc = pdfmake.createPdf({ content: 'pruebita' }, undefined, fonts)
  // pdfDoc.getBlob((blob) => {
  //   console.log(blob)
  // })
}

main()
