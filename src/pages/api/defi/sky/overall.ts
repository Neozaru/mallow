import { getSSRData } from '@/lib/getSSRData'

export default async function handler(req, res) {
  try {
    const apiRes = await getSSRData()
    res.status(200).json(apiRes)
  } catch (error) {
    console.error('SSR data error', error)
    return res.status(error.status || 500).end(error.message)
  }
}
