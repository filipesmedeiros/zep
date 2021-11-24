const genTxnUrl = ({ address, raw }: { address: string; raw?: string }) =>
  `nano:${address}${raw !== undefined ? `?amount=${raw}` : ''}`

export default genTxnUrl
