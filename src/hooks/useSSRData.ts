import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';
import { find } from 'lodash';

type SkyUnofficialApiResponse = {
  sky_savings_rate_apy: string;
  susds_price_usd: string;
}

type SSRData = {
  apy: number;
  sUSDSPriceUsd: number;
}

const findAndReturnSkyApiField = (skyApiData, field: string) => {
  const foundValue = find(skyApiData, o => o.hasOwnProperty(field))
  return foundValue && parseFloat(foundValue[field])
}

export function useSSRData(): UseQueryResult<SSRData> {
  return useQuery({
    queryKey: ['ssr'],
    queryFn: async () => {
      const { data } = await axios.get<SkyUnofficialApiResponse>('/api/defi/sky/overall')
      return {
        apy: findAndReturnSkyApiField(data, 'sky_savings_rate_apy'),
        sUSDSPriceUsd: findAndReturnSkyApiField(data, 'susds_price_usd')
      }
    }
  })
}
