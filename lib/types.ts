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

export interface AccountPendingResponse {
  blocks: {
    [key: string]: string[]
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
      confirmed: 'true' | 'false'
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
      subtype: 'send' | 'receive' | 'change'
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
      confirmed_balance: '11999999999999999918751838129509869131'
      confirmed_height: '22966'
      confirmed_frontier: '80A6745762493FA21A22718ABFA4F635656A707B48B3324198AC7F3938DE6D4F'
      representative: 'nano_1gyeqc6u5j3oaxbe5qy1hyz3q745a318kh8h9ocnpan7fuxnq85cxqboapu5'
      confirmed_representative: 'nano_1gyeqc6u5j3oaxbe5qy1hyz3q745a318kh8h9ocnpan7fuxnq85cxqboapu5'
    }
  | { error: 'Account not found' }

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
