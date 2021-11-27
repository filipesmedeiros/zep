import { computeWork } from 'nanocurrency'
import { NextApiHandler } from 'next'

const get: NextApiHandler<string> = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  const { frontier } = req.query

  console.time('computeWork')
  const work = await computeWork(frontier as string)
  console.timeEnd('computeWork')

  if (work === null) {
    res.status(500).send(JSON.stringify({ error: "Couldn't compute work" }))
    return
  }

  res.status(200).send(JSON.stringify({ work }))
}

export default get
