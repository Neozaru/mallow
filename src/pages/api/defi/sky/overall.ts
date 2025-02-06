import { getSSRData } from '@/lib/getSSRData'
import forwardAxiosError from '@/utils/forwardAxiosError'

export default async function handler(req, res) {
  try {
    const apiRes = await getSSRData()
    res.status(200).json(apiRes)
  } catch (error) {
    console.error('SSR data error', error)
    return forwardAxiosError(res, error)
  }
}
