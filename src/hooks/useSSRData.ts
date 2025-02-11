import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';

type SkyUnofficialApiResponse = {
  sky_savings_rate_apy: string;
  susds_price_usd: string;
}

type SSRData = {
  apy: number;
  sUSDSPriceUsd: number;
}

export function useSSRData(): UseQueryResult<SSRData> {
  return useQuery({
    queryKey: ['ssr'],
    queryFn: async () => {
      const { data } = await axios.get<SkyUnofficialApiResponse>('/api/defi/sky/overall')
      return {
        apy: parseFloat(data[0].sky_savings_rate_apy),
        sUSDSPriceUsd: parseFloat(data[6].susds_price_usd)
      }
    }
  })
}
