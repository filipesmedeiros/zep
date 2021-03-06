import { wallet } from 'nanocurrency-web'

const accountAtIndex = (seed: string, index: number) =>
  wallet.legacyAccounts(seed, index, index)[0]

export default accountAtIndex
