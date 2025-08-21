import { Temporal } from '@js-temporal/polyfill'

/** Función para formatear la fecha a la zona horaria de Peru
 * @param {string} dateString - Fecha en formato ISO 8601
 */
export function formatDateToLocal(dateString: string) {
  // 1. Parsear la fecha (acepta tanto UTC como otras zonas)
  const instant = Temporal.Instant.from(dateString)

  // 2. Convertir a zona horaria de Perú
  const limaTime = instant.toZonedDateTimeISO('America/Lima')

  // 3. Formatear para API (sin milisegundos, con offset)
  return limaTime
    .toString({
      timeZoneName: 'never',
      fractionalSecondDigits: 0,
    })
    .replace('[America/Lima]', '')
}
