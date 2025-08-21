/**
 * Tipos de datos para la conversión de números a letras
 */
type UnitsMap = Record<number, string>
type TensMap = Record<number, string>
type HundredsMap = Record<number, string>
type SpecialCasesMap = Record<number, string>

/**
 * Interfaz para casos de prueba
 */
interface TestCase {
  input: number
  expected: string
}

/**
 * Configuración para las validaciones de entrada
 */
interface ValidationConfig {
  readonly MIN_VALUE: number
  readonly MAX_VALUE: number
}

/**
 * Resultado de conversión con información adicional
 */
interface ConversionResult {
  text: string
  integerPart: number
  decimalPart: number
  isValid: boolean
}

/**
 * Configuración de validación
 */
const VALIDATION_CONFIG: ValidationConfig = {
  MIN_VALUE: 0,
  MAX_VALUE: 999_999_999.99,
} as const

/**
 * Constantes para divisores
 */
const DIVISORS = {
  THOUSAND: 1000,
  MILLION: 1_000_000,
} as const

/**
 * Convierte números del 1 al 9 a su representación en texto
 * @param number - Número del 1 al 9
 * @returns Representación en texto del número
 */
function convertUnits(number: number): string {
  const units: UnitsMap = {
    1: 'UN',
    2: 'DOS',
    3: 'TRES',
    4: 'CUATRO',
    5: 'CINCO',
    6: 'SEIS',
    7: 'SIETE',
    8: 'OCHO',
    9: 'NUEVE',
  }

  return units[number] ?? ''
}

/**
 * Convierte números del 10 al 99 a su representación en texto
 * @param number - Número del 10 al 99
 * @returns Representación en texto del número
 */
function convertTens(number: number): string {
  if (number < 10) {
    return convertUnits(number)
  }

  const tens: number = Math.floor(number / 10)
  const units: number = number % 10

  // Casos especiales para números del 10 al 19
  if (tens === 1) {
    const specialCases: SpecialCasesMap = {
      10: 'DIEZ',
      11: 'ONCE',
      12: 'DOCE',
      13: 'TRECE',
      14: 'CATORCE',
      15: 'QUINCE',
    }

    return specialCases[number] ?? `DIECI${convertUnits(units)}`
  }

  // Casos especiales para números del 20 al 29
  if (tens === 2) {
    return units === 0 ? 'VEINTE' : `VEINTI${convertUnits(units)}`
  }

  // Resto de decenas (30-90)
  const tensNames: TensMap = {
    3: 'TREINTA',
    4: 'CUARENTA',
    5: 'CINCUENTA',
    6: 'SESENTA',
    7: 'SETENTA',
    8: 'OCHENTA',
    9: 'NOVENTA',
  }

  const tensName: string = tensNames[tens]
  return units > 0 ? `${tensName} Y ${convertUnits(units)}` : tensName
}

/**
 * Convierte números del 100 al 999 a su representación en texto
 * @param number - Número del 100 al 999
 * @returns Representación en texto del número
 */
function convertHundreds(number: number): string {
  if (number < 100) {
    return convertTens(number)
  }

  const hundreds: number = Math.floor(number / 100)
  const remainder: number = number % 100

  // Caso especial para 100
  if (hundreds === 1) {
    return remainder > 0 ? `CIENTO ${convertTens(remainder)}` : 'CIEN'
  }

  const hundredsNames: HundredsMap = {
    2: 'DOSCIENTOS',
    3: 'TRESCIENTOS',
    4: 'CUATROCIENTOS',
    5: 'QUINIENTOS',
    6: 'SEISCIENTOS',
    7: 'SETECIENTOS',
    8: 'OCHOCIENTOS',
    9: 'NOVECIENTOS',
  }

  const hundredsName: string = hundredsNames[hundreds]
  const remainderText: string = convertTens(remainder)

  return remainderText ? `${hundredsName} ${remainderText}` : hundredsName
}

/**
 * Procesa una sección numérica con su divisor y nombres singular/plural
 * @param number - Número a procesar
 * @param divisor - Divisor para la sección (1000, 1000000, etc.)
 * @param singular - Nombre singular de la unidad
 * @param plural - Nombre plural de la unidad
 * @returns Representación en texto de la sección
 */
function processSection(number: number, divisor: number, singular: string, plural: string): string {
  const quotient: number = Math.floor(number / divisor)

  if (quotient === 0) {
    return ''
  }

  if (quotient === 1) {
    return singular
  }

  return `${convertHundreds(quotient)} ${plural}`
}

/**
 * Convierte números de miles (1,000 - 999,999) a texto
 * @param number - Número a convertir
 * @returns Representación en texto del número
 */
function convertThousands(number: number): string {
  const remainder: number = number % DIVISORS.THOUSAND

  const thousandsText: string = processSection(number, DIVISORS.THOUSAND, 'UN MIL', 'MIL')
  const hundredsText: string = convertHundreds(remainder)

  if (!thousandsText) {
    return hundredsText
  }

  if (!hundredsText) {
    return thousandsText
  }

  return `${thousandsText} ${hundredsText}`
}

/**
 * Convierte números de millones (1,000,000+) a texto
 * @param number - Número a convertir
 * @returns Representación en texto del número
 */
function convertMillions(number: number): string {
  const remainder: number = number % DIVISORS.MILLION

  const millionsText: string = processSection(number, DIVISORS.MILLION, 'UN MILLON DE', 'MILLONES DE')
  const thousandsText: string = convertThousands(remainder)

  if (!millionsText) {
    return thousandsText
  }

  return thousandsText ? `${millionsText} ${thousandsText}` : millionsText
}

/**
 * Valida que el número de entrada sea válido
 * @param amount - Cantidad a validar
 * @throws Error si el parámetro no es válido
 */
function validateAmount(amount: number): void {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    throw new Error('El parámetro debe ser un número válido')
  }

  if (amount < VALIDATION_CONFIG.MIN_VALUE) {
    throw new Error('No se permiten números negativos')
  }

  if (amount > VALIDATION_CONFIG.MAX_VALUE) {
    throw new Error(`El número es demasiado grande (máximo: ${VALIDATION_CONFIG.MAX_VALUE.toLocaleString()})`)
  }
}

/**
 * Convierte un número a su representación en letras en formato de moneda peruana (Soles)
 * @param amount - Cantidad a convertir (puede incluir decimales)
 * @returns Representación en letras del monto en soles
 * @throws Error Si el parámetro no es un número válido
 */
function numberToLetters(amount: number): string {
  // Validación de entrada
  validateAmount(amount)

  // Separar enteros y centavos
  const integerPart: number = Math.floor(amount)
  const decimalPart: number = Math.round((amount - integerPart) * 100)

  // Formatear centavos con ceros a la izquierda
  const formattedCents: string = decimalPart.toString().padStart(2, '0')

  // Construir resultado
  let result: string = 'SON '

  if (integerPart === 0) {
    result += 'CERO'
  } else {
    result += convertMillions(integerPart)
  }

  result += ` CON ${formattedCents}/100 SOLES`

  return result
}

/**
 * Versión extendida que retorna información detallada de la conversión
 * @param amount - Cantidad a convertir
 * @returns Objeto con información detallada de la conversión
 */
function numberToLettersExtended(amount: number): ConversionResult {
  try {
    validateAmount(amount)

    const integerPart: number = Math.floor(amount)
    const decimalPart: number = Math.round((amount - integerPart) * 100)
    const text: string = numberToLetters(amount)

    return {
      text,
      integerPart,
      decimalPart,
      isValid: true,
    }
  } catch (error) {
    return {
      text: error instanceof Error ? error.message : 'Error desconocido',
      integerPart: 0,
      decimalPart: 0,
      isValid: false,
    }
  }
}

/**
 * Función utilitaria para formatear números como moneda
 * @param amount - Cantidad a formatear
 * @returns Número formateado como moneda peruana
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(amount)
}

/**
 * Ejecuta pruebas unitarias de la función
 */
function runTests(): void {
  const testCases: TestCase[] = [
    { input: 0, expected: 'SON CERO CON 00/100 SOLES' },
    { input: 1, expected: 'SON UN CON 00/100 SOLES' },
    { input: 15, expected: 'SON QUINCE CON 00/100 SOLES' },
    { input: 21, expected: 'SON VEINTIUN CON 00/100 SOLES' },
    { input: 100, expected: 'SON CIEN CON 00/100 SOLES' },
    { input: 101, expected: 'SON CIENTO UN CON 00/100 SOLES' },
    { input: 330, expected: 'SON TRESCIENTOS TREINTA CON 00/100 SOLES' },
    { input: 336, expected: 'SON TRESCIENTOS TREINTA Y SEIS CON 00/100 SOLES' },
    { input: 500.5, expected: 'SON QUINIENTOS CON 50/100 SOLES' },
    { input: 1000, expected: 'SON UN MIL CON 00/100 SOLES' },
    { input: 5000.5, expected: 'SON CINCO MIL CON 50/100 SOLES' },
    { input: 1000000, expected: 'SON UN MILLON DE CON 00/100 SOLES' },
  ]

  console.log('=== EJECUTANDO PRUEBAS ===')

  let passedTests: number = 0
  let totalTests: number = testCases.length

  testCases.forEach((testCase: TestCase, index: number) => {
    try {
      const result: string = numberToLetters(testCase.input)
      const passed: boolean = result === testCase.expected

      if (passed) passedTests++

      console.log(`Prueba ${index + 1}: ${passed ? '✓ PASÓ' : '✗ FALLÓ'}`)
      console.log(`  Entrada: ${testCase.input} (${formatCurrency(testCase.input)})`)
      console.log(`  Esperado: ${testCase.expected}`)
      console.log(`  Obtenido: ${result}`)
      console.log('')
    } catch (error) {
      console.log(`Prueba ${index + 1}: ✗ ERROR - ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  })

  console.log(`=== RESUMEN: ${passedTests}/${totalTests} pruebas pasaron ===`)
}

// Ejecutar pruebas
// runTests()

// Exportaciones para uso en módulos
export { numberToLetters, numberToLettersExtended, formatCurrency, type ConversionResult, type TestCase, type ValidationConfig }
