import { getAaveStablecoinData } from '@/lib/getAaveStablecoinData'

export default async function handler(req, res) {
  const { query } = req
  try {
    const apiRes = await getAaveStablecoinData(query.symbols, query.chainIds)
    res.status(200).json(apiRes)
  } catch (error) {
    console.error('AAVE poolsdata error', error)
    return res.status(error.status || 500).end(error.message)
  }
}
