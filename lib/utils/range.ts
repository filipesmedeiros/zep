const range = (length: number) => {
  const arr = []
  while (arr.length < length) arr.push(arr.length)
  return arr
}

export default range
