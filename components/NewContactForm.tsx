import { PlusIcon } from '@heroicons/react/solid'
import { FC, useEffect, useState } from 'react'

import { removeContact } from '../lib/db/contacts'
import useContacts from '../lib/hooks/useContacts'
import useDebouncedValue from '../lib/hooks/useDebouncedValue'
import AddressInput from './AddressInput'
import Button from './Button'

export interface Props {
  onSubmit: (contact: { name: string; address: string }) => void
}

const NewContactForm: FC<Props> = ({ onSubmit }) => {
  const [newContactName, setNewContactName] = useState('')
  const [newContactAddress, setNewContactAddress] = useState('')
  const [contactNameExists, setContactNameExists] = useState(false)

  const [debouncedName] = useDebouncedValue(newContactName, 50)

  const { contacts } = useContacts()

  useEffect(() => {
    setContactNameExists(
      contacts?.find(contact => contact.name === debouncedName) !== undefined
    )
  }, [debouncedName, contacts])

  const disbleSubmit =
    contactNameExists || newContactName === '' || newContactAddress === ''

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSubmit({ name: newContactName, address: newContactAddress })
      }}
      className="flex flex-col gap-2 items-start"
    >
      <div className="flex gap-3 items-center">
        <label className="text-2xl" htmlFor="contact-name-input">
          name
        </label>
        <input
          required
          pattern=".+"
          id="contact-name-input"
          name="contact-name-input"
          className="flex items-center w-full gap-3 text-2xl rounded transition-colors dark:bg-gray-800 bg-purple-50 focus-within:bg-purple-100 py-2 px-4 overflow-hidden dark:focus-within:bg-gray-700 focus:outline-none"
          value={newContactName}
          onChange={({ target: { value } }) => setNewContactName(value)}
        />
      </div>

      <AddressInput
        required
        value={newContactAddress}
        onChange={setNewContactAddress}
      />
      <Button
        disabled={disbleSubmit}
        type="submit"
        variant="primary"
        className="px-2 self-center flex gap-2"
      >
        <PlusIcon className="w-7" /> add contact
      </Button>
    </form>
  )
}

export default NewContactForm
