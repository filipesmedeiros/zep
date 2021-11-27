import { computeWork } from 'nanocurrency'

onmessage = async ev => {
  console.time(`worker${ev.data.id}`)
  const work = await computeWork(ev.data.frontier)
  console.timeEnd(`worker${ev.data.id}`)
  postMessage(work)
}
