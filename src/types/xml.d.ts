export interface XmlInvoice {
  '?xml': Xml
  Invoice: Invoice
}

interface Xml {
  $version: boolean
  '$"1.0"': boolean
  $encoding: boolean
  '$"utf-8"': boolean
}

interface Invoice {
  'ext:UBLExtensions': ExtUblextensions
  'cbc:UBLVersionID': number
  'cbc:CustomizationID': number
  'cbc:ID': string
  'cbc:IssueDate': string
  'cbc:IssueTime': string
  'cbc:DueDate': string
  'cbc:InvoiceTypeCode': CbcInvoiceTypeCode
  'cbc:Note': CbcNote
  'cbc:DocumentCurrencyCode': string
  'cac:Signature': CacSignature
  'cac:AccountingSupplierParty': CacAccountingSupplierParty
  'cac:AccountingCustomerParty': CacAccountingCustomerParty
  'cac:PaymentTerms': CacPaymentTerms
  'cac:TaxTotal': CacTaxTotal
  'cac:LegalMonetaryTotal': CacLegalMonetaryTotal
  'cac:InvoiceLine': CacInvoiceLine[]
  $xmlns: boolean
  '$"urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"': boolean
  '$xmlns:cac': boolean
  '$"urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"': boolean
  '$xmlns:cbc': boolean
  '$"urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"': boolean
  '$xmlns:ds': boolean
  '$"http://www.w3.org/2000/09/xmldsig#"': boolean
  '$xmlns:ext': boolean
  '$"urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2"': boolean
}

interface ExtUblextensions {
  'ext:UBLExtension': ExtUblextension
}

interface ExtUblextension {
  'ext:ExtensionContent': ExtExtensionContent
}

interface ExtExtensionContent {
  'ds:Signature': DsSignature
}

interface DsSignature {
  'ds:SignedInfo': DsSignedInfo
  'ds:SignatureValue': string
  'ds:KeyInfo': DsKeyInfo
  $Id: boolean
  '$"GreenterSign"': boolean
}

interface DsSignedInfo {
  'ds:CanonicalizationMethod': DsCanonicalizationMethod
  'ds:SignatureMethod': DsSignatureMethod
  'ds:Reference': DsReference
}

interface DsCanonicalizationMethod {
  $Algorithm: boolean
  '$"http://www.w3.org/TR/2001/REC-xml-c14n-20010315"': boolean
}

interface DsSignatureMethod {
  $Algorithm: boolean
  '$"http://www.w3.org/2000/09/xmldsig#rsa-sha1"': boolean
}

interface DsReference {
  'ds:Transforms': DsTransforms
  'ds:DigestMethod': DsDigestMethod
  'ds:DigestValue': string
  $URI: boolean
  '$""': boolean
}

interface DsTransforms {
  'ds:Transform': DsTransform
}

interface DsTransform {
  $Algorithm: boolean
  '$"http://www.w3.org/2000/09/xmldsig#enveloped-signature"': boolean
}

interface DsDigestMethod {
  $Algorithm: boolean
  '$"http://www.w3.org/2000/09/xmldsig#sha1"': boolean
}

interface DsKeyInfo {
  'ds:X509Data': DsX509Data
}

interface DsX509Data {
  'ds:X509Certificate': string
}

interface CbcInvoiceTypeCode {
  '#text': number
  $listID: boolean
  '$"0101"': boolean
}

interface CbcNote {
  '#text': string
  $languageLocaleID: boolean
  '$"1000"': boolean
}

interface CacSignature {
  'cbc:ID': number
  'cac:SignatoryParty': CacSignatoryParty
  'cac:DigitalSignatureAttachment': CacDigitalSignatureAttachment
}

interface CacSignatoryParty {
  'cac:PartyIdentification': CacPartyIdentification
  'cac:PartyName': CacPartyName
}

interface CacPartyIdentification {
  'cbc:ID': number
}

interface CacPartyName {
  'cbc:Name': string
}

interface CacDigitalSignatureAttachment {
  'cac:ExternalReference': CacExternalReference
}

interface CacExternalReference {
  'cbc:URI': string
}

interface CacAccountingSupplierParty {
  'cac:Party': CacParty
}

interface CacParty {
  'cac:PartyIdentification': CacPartyIdentification2
  'cac:PartyLegalEntity': CacPartyLegalEntity
}

interface CacPartyIdentification2 {
  'cbc:ID': CbcId
}

interface CbcId {
  '#text': number
  $schemeID: boolean
  '$"6"': boolean
}

interface CacPartyLegalEntity {
  'cbc:RegistrationName': string
  'cac:RegistrationAddress': CacRegistrationAddress
}

interface CacRegistrationAddress {
  'cbc:ID': number
  'cbc:AddressTypeCode': number
  'cbc:CityName': string
  'cbc:CountrySubentity': string
  'cbc:District': string
  'cac:AddressLine': CacAddressLine
  'cac:Country': CacCountry
}

interface CacAddressLine {
  'cbc:Line': string
}

interface CacCountry {
  'cbc:IdentificationCode': string
}

interface CacAccountingCustomerParty {
  'cac:Party': CacParty2
}

interface CacParty2 {
  'cac:PartyIdentification': CacPartyIdentification3
  'cac:PartyLegalEntity': CacPartyLegalEntity2
}

interface CacPartyIdentification3 {
  'cbc:ID': CbcId2
}

interface CbcId2 {
  '#text': number
  $schemeID: boolean
  '$"6"': boolean
}

interface CacPartyLegalEntity2 {
  'cbc:RegistrationName': string
  'cac:RegistrationAddress': CacRegistrationAddress2
}

interface CacRegistrationAddress2 {
  'cac:AddressLine': CacAddressLine2
  'cac:Country': CacCountry2
}

interface CacAddressLine2 {
  'cbc:Line': string
}

interface CacCountry2 {
  'cbc:IdentificationCode': string
}

interface CacPaymentTerms {
  'cbc:ID': string
  'cbc:PaymentMeansID': string
}

interface CacTaxTotal {
  'cbc:TaxAmount': CbcTaxAmount
  'cac:TaxSubtotal': CacTaxSubtotal
}

interface CbcTaxAmount {
  '#text': number
  $currencyID: boolean
  '$"PEN"': boolean
}

interface CacTaxSubtotal {
  'cbc:TaxableAmount': CbcTaxableAmount
  'cbc:TaxAmount': CbcTaxAmount2
  'cac:TaxCategory': CacTaxCategory
}

interface CbcTaxableAmount {
  '#text': number
  $currencyID: boolean
  '$"PEN"': boolean
}

interface CbcTaxAmount2 {
  '#text': number
  $currencyID: boolean
  '$"PEN"': boolean
}

interface CacTaxCategory {
  'cac:TaxScheme': CacTaxScheme
}

interface CacTaxScheme {
  'cbc:ID': number
  'cbc:Name': string
  'cbc:TaxTypeCode': string
}

interface CacLegalMonetaryTotal {
  'cbc:LineExtensionAmount': CbcLineExtensionAmount
  'cbc:TaxInclusiveAmount': CbcTaxInclusiveAmount
  'cbc:PayableAmount': CbcPayableAmount
}

interface CbcLineExtensionAmount {
  '#text': number
  $currencyID: boolean
  '$"PEN"': boolean
}

interface CbcTaxInclusiveAmount {
  '#text': number
  $currencyID: boolean
  '$"PEN"': boolean
}

interface CbcPayableAmount {
  '#text': number
  $currencyID: boolean
  '$"PEN"': boolean
}

interface CacInvoiceLine {
  'cbc:ID': number
  'cbc:InvoicedQuantity': CbcInvoicedQuantity
  'cbc:LineExtensionAmount': CbcLineExtensionAmount2
  'cac:PricingReference': CacPricingReference
  'cac:TaxTotal': CacTaxTotal2
  'cac:Item': CacItem
  'cac:Price': CacPrice
}

interface CbcInvoicedQuantity {
  '#text': number
  $unitCode: boolean
  '$"NIU"': boolean
}

interface CbcLineExtensionAmount2 {
  '#text': number
  $currencyID: boolean
  '$"PEN"': boolean
}

interface CacPricingReference {
  'cac:AlternativeConditionPrice': CacAlternativeConditionPrice
}

interface CacAlternativeConditionPrice {
  'cbc:PriceAmount': CbcPriceAmount
  'cbc:PriceTypeCode': number
}

interface CbcPriceAmount {
  '#text': number
  $currencyID: boolean
  '$"PEN"': boolean
}

interface CacTaxTotal2 {
  'cbc:TaxAmount': CbcTaxAmount3
  'cac:TaxSubtotal': CacTaxSubtotal2
}

interface CbcTaxAmount3 {
  '#text': number
  $currencyID: boolean
  '$"PEN"': boolean
}

interface CacTaxSubtotal2 {
  'cbc:TaxableAmount': CbcTaxableAmount2
  'cbc:TaxAmount': CbcTaxAmount4
  'cac:TaxCategory': CacTaxCategory2
}

interface CbcTaxableAmount2 {
  '#text': number
  $currencyID: boolean
  '$"PEN"': boolean
}

interface CbcTaxAmount4 {
  '#text': number
  $currencyID: boolean
  '$"PEN"': boolean
}

interface CacTaxCategory2 {
  'cbc:Percent': number
  'cbc:TaxExemptionReasonCode': number
  'cac:TaxScheme': CacTaxScheme2
}

interface CacTaxScheme2 {
  'cbc:ID': number
  'cbc:Name': string
  'cbc:TaxTypeCode': string
}

interface CacItem {
  'cbc:Description': string
}

interface CacPrice {
  'cbc:PriceAmount': CbcPriceAmount2
}

interface CbcPriceAmount2 {
  '#text': number
  $currencyID: boolean
  '$"PEN"': boolean
}
