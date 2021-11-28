export type BooleanString = 'true' | 'false'
export type TransactionSubtype = 'send' | 'receive' | 'change'

export interface AccountHistoryResponse {
  account: string
  history:
    | {
        type: 'send' | 'receive'
        account: string
        amount: string
        local_timestamp: string
        height: string
        hash: string
      }[]
    | ''
  previous?: string
}

export interface AccountReceivableResponse {
  blocks: {
    [destinationAddress: string]: {
      [blockHash: string]: {
        amount: string
        source: string
      }
    }
  }
}

export interface BlocksInfoResponse {
  blocks: {
    [key: string]: {
      block_account: string
      amount: string
      balance: string
      height: string
      local_timestamp: string
      confirmed: BooleanString
      contents: {
        type: 'state'
        account: string
        previous: string
        representative: string
        balance: string
        link: string
        link_as_account: string
        signature: string
        work: string
      }
      subtype: TransactionSubtype
    }
  }
}

export type AccountInfoResponse =
  | {
      frontier: string
      open_block: string
      representative_block: string
      balance: string
      modified_timestamp: string
      block_count: string
      account_version: string
      confirmation_height: string
      confirmation_height_frontier: string
      confirmed_balance: string
      confirmed_height: string
      confirmed_frontier: string
      representative: string
      confirmed_representative: string
    }
  | { error: string }

export interface AccountInfoCache {
  address: string
  index: number
  publicKey: string
  frontier: string | null
  representative: string | null
  balance: string | null
  precomputedWork: string | null
}

export interface XnoPriceResponse {
  symbol: 'XNO'
  price: number
  currency: 'USD'
  timestamp: string
}

export type ProcessResponse =
  | {
      hash: string
    }
  | { error: string }

export interface ConfirmationMessage {
  topic: 'confirmation'
  time: string
  message: {
    account: string
    amount: string
    hash: string
    confirmation_type: string
    block: {
      type: 'state'
      account: string
      previous: string
      representative: string
      balance: string
      link: string
      link_as_account: string
      signature: string
      work: string
      subtype: TransactionSubtype
    }
  }
}
