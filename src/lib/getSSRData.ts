import { axiosGetCached } from './axiosGetCached'

export async function getSSRData() {
  const { data } = await axiosGetCached(
    `https://info-sky.blockanalitica.com/api/v1/overall/?format=json`,
    600000
  )
  return data
} 
