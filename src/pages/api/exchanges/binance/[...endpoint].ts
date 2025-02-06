import forwardAxiosError from '@/utils/forwardAxiosError'
import axios from 'axios'
import { Agent } from 'https'
import _ from 'lodash'

export default async function handler(req, res) {

  const { endpoint } = req.query
  const headersToPass = _.pick(req.headers, 'x-mbx-apikey')

  const url = `http://api.binance.com/sapi/${endpoint.join('/')}?${req.url.split('?')[1]}`
  const headers = {
    "User-Agent": "axios 0.21.1",
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...headersToPass
  }
  try {
    const agent = new Agent({  
      rejectUnauthorized: false
    });
    const apiRes = await axios(
      {
        method: req.method,
        url,
        maxBodyLength: Infinity,
        httpsAgent: agent,
        maxRedirects: 5,
        headers,

      }
    )
    res.status(200).json(apiRes.data)
  } catch (error) {
    console.error('ERROR BINANCE', error)
    return forwardAxiosError(res, error)
  }
}
