import { tools } from 'nanocurrency-web'

const rawToNanoDisplay = (raw: string) =>
  Number(tools.convert(raw, 'RAW', 'NANO').slice(0, 20)).toString()

export default rawToNanoDisplay
