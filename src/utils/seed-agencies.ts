import { agenciesTable, labelsTable } from '@/db/schemas'
import { count } from 'drizzle-orm'
import type { DB } from '@/types'
import agencies from '../../muckup/agencies.json'
import labels from '../../muckup/labels.json'

export async function seedAgencies(db: DB, postgresURl: string) {
  await db.delete(agenciesTable)
  await db.delete(labelsTable)
  // {
  //   id: '511cc296-6e9f-4776-8082-00f7093c23c7',
  //   name: 'TRANSPORTE BURGA CARGO S.A.C.',
  //   ruc: '20606494921',
  //   phone: null,
  //   address: 'Manuel cisneros 394 - La Victoria',
  //   created_at: 2025-01-26T01:43:14.713Z,
  //   updated_at: 2025-01-26T01:43:14.713Z
  // }
  console.log('total agencies: ', agencies.length)
  for (const agency of agencies) {
    await db.insert(agenciesTable).values({
      id: agency.id,
      name: agency.name,
      ruc: agency.ruc,
      phone: agency.phone,
      address: agency.address,
      createdAt: new Date(agency.created_at),
      updatedAt: new Date(agency.updated_at),
    })
    console.log(`inserted agencies ${agency.id} success`)
  }

  for (const label of labels) {
    await db.insert(labelsTable).values({
      id: label.id,
      recipient: label.recipient,
      destination: label.destination,
      dniRuc: label.dni_ruc,
      phone: label.phone,
      address: label.address,
      observations: label.observations,
      agencyId: label.agency_id,
      createdAt: new Date(label.created_at),
      updatedAt: new Date(label.updated_at),
    })
    console.log(`inserted labels ${label.id} success`)
  }

  return {
    agencies: await db.select({ count: count() }).from(agenciesTable),
    labels: await db.select({ count: count() }).from(labelsTable),
  }
}
