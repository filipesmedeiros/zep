import { PlusIcon, UsersIcon } from '@heroicons/react/solid'
import type { NextPage } from 'next'
import Head from 'next/head'
import { FormEventHandler, useState } from 'react'

import AddressInput from '../components/AddressInput'
import Button from '../components/Button'
import NewContactForm from '../components/NewContactForm'
import { addContact } from '../lib/db/contacts'
import useContacts from '../lib/hooks/useContacts'

const Contacts: NextPage = () => {
  const { contacts, mutate } = useContacts()

  if (contacts === undefined) return null

  const onAddNewContact = async (contact: {
    name: string
    address: string
  }) => {
    mutate(prev => [...(prev ?? []), contact])
    await addContact(contact)
    mutate()
  }

  return (
    <>
      <Head>
        <title>zep⚡️ - your contacts</title>
      </Head>
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="flex items-center gap-2">
          <UsersIcon className="dark:text-purple-50 h-7 xs:h-8 text-gray-900 translate-x-1 transition-colors" />
          <span className="text-3xl sm:text-5xl font-medium">contacts</span>
        </h1>
        <NewContactForm onSubmit={onAddNewContact} />
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
      </div>
    </>
  )
}

export default Contacts
