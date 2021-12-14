import useSWR from 'swr'

import { getAllContacts } from '../db/contacts'

const useContacts = () => useSWR('contacts', () => getAllContacts())

export default useContacts
