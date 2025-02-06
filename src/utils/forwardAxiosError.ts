import { isAxiosError } from 'axios'

const forwardAxiosError = (res, error) => {
  const isErrorFromAxios = isAxiosError(error)
  return res.status(isErrorFromAxios ? error.status : 500).end(isErrorFromAxios && error.message)
}

export default forwardAxiosError
