import bitstampHeaders from '@/utils/bitstampHeaders'
import forwardAxiosError from '@/utils/forwardAxiosError'
import axios from 'axios'
import _ from 'lodash'

export default async function handler(req, res) {
  const { endpoint } = req.query

  const url = `https://www.bitstamp.net/${endpoint.join('/')}/`
  const headersToPass = _.pick(req.headers, Object.values(bitstampHeaders))
  
  const headers = {
    'Accept': 'application/json',
    // Seems to be overriden down the line otherwise
    'Content-Type': '',
    ...headersToPass
  }
  try {

    const axiosParams = {
      method: req.method,
      url,
      maxRedirects: 5,
      headers,
    }
    const apiRes = await axios(axiosParams)
    res.status(200).json(apiRes.data)
  } catch (error) {
    console.error('ERROR BITSTAMP API', error)
    return forwardAxiosError(res, error)
  }
}
