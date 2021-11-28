import fetcher from '../fetcher'
import { AccountInfoResponse } from '../types'

const fetchAccountInfo = (address: string) =>
  fetcher('https://mynano.ninja/api/node', {
    method: 'POST',
    body: {
      action: 'account_info',
      account: address,
      representative: 'true',
      include_confirmed: 'true',
    },
  }) as Promise<AccountInfoResponse>

export default fetchAccountInfo
