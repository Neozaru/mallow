import { QueryClient } from '@tanstack/react-query';
import { memoize } from 'lodash';

const getQueryClient = memoize(() => new QueryClient())

export default getQueryClient
