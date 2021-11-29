import fetcher from './fetcher'
import { WorkGenerateResponse } from './types'
import { defaultUrls } from './xno/constants'

const computeWorkAsync = (
  hash: string,
  { send, workerCount }: { send: boolean; workerCount?: number }
) => {
  const workers: Worker[] = []

  const cleanup = () => {
    workers.forEach(worker => worker.terminate())
    abortController.abort()
  }
  const abortController = new AbortController()

  const onlineWorkPromise = fetcher<WorkGenerateResponse>(defaultUrls.rpc, {
    signal: abortController.signal,
    method: 'POST',
    body: {
      action: 'work_generate',
      hash,
    },
  }).then(async res => {
    const { work } = res
    return work as string
  })

  const offlineWorkPromise = new Promise<string | null>((res, rej) => {
    if (navigator.onLine) {
      rej('prefer going to server')
      return
    }
    const maxWorkers =
      workerCount ?? Math.max((navigator.hardwareConcurrency ?? 2) - 1, 1)
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
      worker.postMessage({ hash, id, send })
      return worker
    }
    for (let i = 0; i < maxWorkers; i++) workers.push(createWorker(i))
  })

  return Promise.any([onlineWorkPromise, offlineWorkPromise])
}

export default computeWorkAsync
