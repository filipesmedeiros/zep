import fetcher from '../fetcher'
import { AccountInfoResponse } from '../types'

const fetchAccountInfo = (address: string) =>
  fetcher('https://mynano.ninja/api/node', {
    method: 'POST',
    headers: [['Content-Type', 'application/json']],
    body: JSON.stringify({
      action: 'account_info',
      account: address,
      representative: 'true',
      include_confirmed: 'true',
    }),
  }) as Promise<AccountInfoResponse>

export default fetchAccountInfo
