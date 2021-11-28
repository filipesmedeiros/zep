import fetcher from '../fetcher'
import { AccountInfoResponse } from '../types'

const fetchAccountInfo = (address: string) =>
  fetcher('https://proxy.powernode.cc/proxy', {
    method: 'POST',
    body: {
      action: 'account_info',
      account: address,
      representative: 'true',
      include_confirmed: 'true',
    },
  }) as Promise<AccountInfoResponse>

export default fetchAccountInfo
