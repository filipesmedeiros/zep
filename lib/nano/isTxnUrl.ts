const isTxnUrl = (urlOrAddress: string) => urlOrAddress.startsWith('nano:')

export default isTxnUrl
