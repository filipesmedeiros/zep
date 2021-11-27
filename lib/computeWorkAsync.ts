const computeWorkAsync = (
  frontier: string,
  { send, workerCount = 4 }: { send: boolean; workerCount?: number }
) => {
  const workers: Worker[] = []

  const cleanup = () => {
    workers.forEach(worker => worker.terminate())
    abortController.abort()
  }
  const abortController = new AbortController()

  const onlineWorkPromise =
    process.env.NODE_ENV === 'production'
      ? fetch(`/api/computeWork?frontier=${frontier}`, {
          signal: abortController.signal,
        }).then(async res => {
          if (res.status !== 200) throw new Error()
          else {
            const { work } = await res.json()
            return work as string
          }
        })
      : Promise.reject(
          'not in production, so not generating work on the server'
        )

  const offlineWorkPromise = new Promise<string | null>((res, rej) => {
    const maxWorkers =
      Math.floor(navigator.hardwareConcurrency / 4) ?? workerCount

    const createWorker = (id: number) => {
      const worker = new Worker(new URL('./workComputer.ts', import.meta.url))
      worker.onmessage = work => {
        cleanup()
        if (work === null) rej('failed_work')
        else res(work.data)
      }
      worker.onerror = work => {
        cleanup()
        rej(work)
      }

      worker.postMessage({ frontier, id, send })
      return worker
    }

    for (let i = 0; i < maxWorkers; i++) workers.push(createWorker(i))
  })

  return Promise.any([onlineWorkPromise, offlineWorkPromise])
}

export default computeWorkAsync
