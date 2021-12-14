import { PlusIcon, UsersIcon } from '@heroicons/react/solid'
import type { NextPage } from 'next'
import Head from 'next/head'
import { FormEventHandler, useState } from 'react'

import AddressInput from '../components/AddressInput'
import Button from '../components/Button'
import { addContact } from '../lib/db/contacts'
import useContacts from '../lib/hooks/useContacts'

const Contacts: NextPage = () => {
  const { data: contacts, mutate } = useContacts()

  const [newContactName, setNewContactName] = useState('')
  const [newContactAddress, setNewContactAddress] = useState('')

  if (contacts === undefined) return null

  const onAddNewContact: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault()
    mutate(prev => [
      ...(prev ?? []),
      { name: newContactName, address: newContactAddress },
    ])
    await addContact({ name: newContactName, address: newContactAddress })
    mutate()
  }

  return (
    <>
      <Head>
        <title>zep⚡️ - your contacts</title>
      </Head>
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="flex items-center gap-2">
          <UsersIcon className="dark:text-primary-50 h-7 xs:h-8 text-gray-900 translate-x-1 transition-colors" />
          <span className="text-3xl sm:text-5xl font-medium">contacts</span>
        </h1>
        <ol className="flex flex-col gap-2">
          {contacts.map(contact => (
            <li
              key={contact.name}
              className="flex items-center gap-2 text-ellipsis overflow-hidden"
            >
              <div>{contact.name}</div>
              <div>{contact.address}</div>
            </li>
          ))}
        </ol>
        <form onSubmit={onAddNewContact}>
          <input
            className="flex items-center w-full gap-3 text-2xl rounded transition-colors dark:bg-gray-800 bg-primary-50 focus-within:bg-primary-100 py-2 px-4 overflow-hidden dark:focus-within:bg-gray-700"
            value={newContactName}
            onChange={({ target: { value } }) => setNewContactName(value)}
          />
          <AddressInput
            value={newContactAddress}
            onChange={setNewContactAddress}
          />
          <Button type="submit">
            <PlusIcon className="h-7" />
          </Button>
        </form>
      </div>
    </>
  )
}

export default Contacts
