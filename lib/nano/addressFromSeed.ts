import { wallet } from 'nanocurrency-web'

const addressFromSeed = (seed: string, index: number) =>
  wallet.accounts(seed, index, index)[0].address

export default addressFromSeed
