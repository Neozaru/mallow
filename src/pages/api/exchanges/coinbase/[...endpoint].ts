import forwardAxiosError from '@/utils/forwardAxiosError'
import axios from 'axios'
import { Agent } from 'https'
import _ from 'lodash'

export default async function handler(req, res) {
  const { endpoint } = req.query
  const url = `https://api.coinbase.com/api/v3/brokerage/${endpoint.join('/')}`
  const headersToPass = _.pick(req.headers, 'authorization')
  try {
    const agent = new Agent({  
      rejectUnauthorized: false
    });
    const apiRes = await axios(
      {
        params: req.params,
        method: req.method,
        url,
        maxBodyLength: Infinity,
        headers: {
          ...headersToPass,
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
          'Content-Type': 'application/json', 
          'Accept': 'application/json'
        },
        httpsAgent: agent,
        data: req.method === 'POST' ? req.body : undefined
      }
    )
    res.status(200).json(apiRes.data)
  } catch (error) {
    console.error('ERROR CB', error)
    return forwardAxiosError(res, error)
  }
}
