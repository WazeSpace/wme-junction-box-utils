import OtaClient from '@crowdin/ota-client';
import axios from 'axios';

export function createCrowdinOtaClient(distributionHash: string): OtaClient {
  const crowdinAxiosClient = axios.create();
  const crowdinHttpClient = {
    get: async (url: string) => (await crowdinAxiosClient.get(url)).data,
  };
  return new OtaClient(distributionHash, { httpClient: crowdinHttpClient });
}
