import axios, { AxiosResponse } from 'axios';

// Courtesy of ChatGPT

// Store data here
const axiosGetCache: { [url: string]: { data: any; timestamp: number } } = {};

// Function with caching and retry logic
export const axiosGetCached = async <T>(
  url: string,
  cacheExpiry?: number,
  maxRetries = 5
): Promise<AxiosResponse<T>> => {
  const currentTime = Date.now();

  // Check cache validity
  if (
    axiosGetCache[url] &&
    (!cacheExpiry || currentTime - axiosGetCache[url].timestamp < cacheExpiry)
  ) {
    return axiosGetCache[url].data; // Return cached response if valid
  }

  let attempt = 0;
  let waitTime = 1000; // Start with 1 second delay for retry

  while (attempt <= maxRetries) {
    try {
      // Make the request
      const response = await axios.get<T>(url);

      // Cache the response
      axiosGetCache[url] = { data: response, timestamp: currentTime };
      return response; // Return successful response
    } catch (error: any) {
      if (error.response?.status === 429 && attempt < maxRetries) {
        attempt++;
        console.warn(`Attempt ${attempt} failed. Retrying in ${waitTime} ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime)); // Wait before retrying
        waitTime *= 2; // Double the wait time
      } else {
        throw error; // Rethrow other errors or if max retries are exceeded
      }
    }
  }

  throw new Error(`Failed to fetch ${url} after ${maxRetries} retries.`);
};
