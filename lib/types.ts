export interface AccountHistoryResponse {
  account: string
  history: {
    type: 'send' | 'receive'
    account: string
    amount: string
    local_timestamp: string
    height: string
    hash: string
  }[]
  previous?: string
}
