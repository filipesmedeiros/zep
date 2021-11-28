import { tools } from 'nanocurrency-web'

const rawToNanoDisplay = (raw: string) =>
  Number(tools.convert(raw, 'RAW', 'NANO').slice(0, 20))
    .toFixed(2)
    .replace(/^0\.00/, 'small')
    .replace('.00', '')

export default rawToNanoDisplay
