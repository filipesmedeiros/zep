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
