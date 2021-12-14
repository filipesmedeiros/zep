import db from '.'
import { ContactValue } from './types'

export const addContact = async (contact: ContactValue) =>
  (await db())!.add('contacts', contact)

export const putContact = async (contact: ContactValue) =>
  (await db())!.put('contacts', contact)

export const removeContact = async (name: string) =>
  (await db())!.delete('contacts', name)

export const removeAllContacts = async () =>
  (await db())!.delete('contacts', IDBKeyRange.lowerBound(''))

export const getContact = async (name: string) =>
  (await db())!.get('contacts', name)

export const getAllContacts = async () => (await db())!.getAll('contacts')

export const hasContact = async (name: string) =>
  (await db())!.count('contacts', name).then(count => count === 1)
