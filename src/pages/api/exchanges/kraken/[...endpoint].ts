import forwardAxiosError from '@/utils/forwardAxiosError'
import axios from 'axios'
import { Agent } from 'https'

export default async function handler(req, res) {
  const { endpoint } = req.query
  const url = `https://api.kraken.com/${endpoint.join('/')}`
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    'API-Key': req.headers['api-key'],
    'API-Sign': req.headers['api-sign'],
  }
  try {
    const agent = new Agent({  
      rejectUnauthorized: false
    });
    const axiosParams = {
      method: 'post',
      url,
      maxBodyLength: Infinity,

      httpsAgent: agent,
      maxRedirects: 5,
      headers,
      data: `nonce=${req.body.nonce}` 
    }
    const apiRes = await axios(axiosParams)
    res.status(200).json(apiRes.data)
  } catch (error) {
    console.error('ERROR KRAKEN', error)
    return forwardAxiosError(res, error)
  }
}
