const txnUrlToParts = (url: string) => {
  console.log(url)
  const [address] = url.split('nano:')[1].split('?')
  const [amount] = url.split('amount')[1].split('&')
  return { address, amount }
}

export default txnUrlToParts
