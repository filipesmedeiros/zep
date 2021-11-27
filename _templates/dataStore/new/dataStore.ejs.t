---
to: lib/db/<%= name %>.ts
---
import Dexie, { Table } from 'dexie'

import db from '.'

interface Value {
}

export type Key = unknown
export type Value = Value

export const schema = undefined // this should be a string like 'key,value'

