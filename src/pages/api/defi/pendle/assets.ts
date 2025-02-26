import getPendleAssets from '@/lib/getPendleAssets'
import forwardAxiosError from '@/utils/forwardAxiosError'

export default async function handler(req, res) {
  const { query } = req
  try {
    const apiRes = await getPendleAssets({ symbols: query.symbols.split(','), chainIds: query.chainIds.split(',').map(Number) })
    res.status(200).json(apiRes)
  } catch (error) {
    console.error('PENDLE assets error', error)
    return forwardAxiosError(res, error)
  }
}
