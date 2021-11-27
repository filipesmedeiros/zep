const computeWorkAsync = (frontier: string, workerCount = 4) => {
  const workers: Worker[] = []

  const cleanup = () => {
    workers.forEach(worker => worker.terminate())
    abortController.abort()
  }
  const abortController = new AbortController()

  const onlineWorkPromise = fetch(`/api/computeWork?frontier=${frontier}`, {
    signal: abortController.signal,
  }).then(async res => {
    if (res.status !== 200) throw new Error()
    else {
      const { work } = await res.json()
      return work as string
    }
  })

  const offlineWorkPromise = new Promise<string | null>((res, rej) => {
    const maxWorkers = navigator.hardwareConcurrency ?? workerCount

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

      worker.postMessage({ frontier, id })
      return worker
    }

    for (let i = 0; i < maxWorkers; i++) workers.push(createWorker(i))
  })

  return Promise.any([onlineWorkPromise, offlineWorkPromise])
}

export default computeWorkAsync
