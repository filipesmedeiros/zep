import { computeWork } from 'nanocurrency'

import { receiveDiff, sendDiff } from './xno/constants'

onmessage = async ev => {
  const { send, id, frontier } = ev.data as {
    send: boolean
    id: number
    frontier: string
  }
  console.log(`started calculating work`)
  console.table({
    workerId: id,
    frontier,
    send,
    difficulty: send ? sendDiff : receiveDiff,
    startedAt: new Date(),
  })
  const work = await computeWork(frontier, {
    workThreshold: send ? sendDiff : receiveDiff,
  })
  console.log(`worker ${id} finished computing work: ${work}`)
  postMessage(work)
}
