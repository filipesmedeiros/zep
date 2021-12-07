const addressRegex =
  /^(nano|xrb)_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$/

const isXnoAddress = (testString: string) => addressRegex.test(testString)

export default isXnoAddress
