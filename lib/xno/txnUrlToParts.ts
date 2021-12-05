const txnUrlToParts = (url: string) => {
  const address = url.split('nano:')[1]?.split('?')?.[0]
  const amount = url.split('amount')[1]?.split('&')?.[0]
  return { address, amount }
}

export default txnUrlToParts
