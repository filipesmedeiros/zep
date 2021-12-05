import isTxnUrl from './isTxnUrl'

const xnoUrlHasAmount = (url: string) =>
  isTxnUrl(url) && (url.includes('?amount=') || url.includes('&amount='))

export default xnoUrlHasAmount
