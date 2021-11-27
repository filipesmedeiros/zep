const fetcher = <T>(...args: Parameters<typeof fetch>) =>
  fetch(...args).then(res => {
    if (!res.ok) throw new Error() // todo improve this error
    return res.json() as Promise<T>
  })

export default fetcher
