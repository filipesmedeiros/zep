import useSWR from 'swr'

import { getAllContacts } from '../db/contacts'

const useContacts = () => {
  const { data, ...res } = useSWR('contacts', () => getAllContacts())
  return { ...res, contacts: data }
}

export default useContacts
