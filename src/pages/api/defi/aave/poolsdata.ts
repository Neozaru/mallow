import { getAaveStablecoinData } from '@/lib/getAaveStablecoinData'
import forwardAxiosError from '@/utils/forwardAxiosError'

export default async function handler(req, res) {
  const { query } = req
  try {
    const apiRes = await getAaveStablecoinData(query.symbols, query.chainIds)
    res.status(200).json(apiRes)
  } catch (error) {
    console.error('AAVE poolsdata error', error)
    return forwardAxiosError(res, error)
  }
}
