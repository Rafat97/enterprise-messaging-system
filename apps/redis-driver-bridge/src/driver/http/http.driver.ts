import { HTTP_DRIVER_CLIENT_TIMEOUT } from '@fanout/envs';
import { IDriverConfig } from '@fanout/interface';
import axios, { AxiosRequestConfig } from 'axios';

export class HttpDriver {
  private request: AxiosRequestConfig;

  constructor(config?: IDriverConfig) {
    this.config(config);
  }

  private config(driverConfig?: AxiosRequestConfig) {
    let axiosConfInString = process?.env?.HTTP_CLIENT_CONFIG_VALUE ?? '';

    if (driverConfig) {
      axiosConfInString = JSON.stringify(driverConfig);
    }
    const axiosConf: AxiosRequestConfig = JSON.parse(axiosConfInString);
    this.request = {
      ...axiosConf,
      timeout: HTTP_DRIVER_CLIENT_TIMEOUT,
      method: 'post',
      maxBodyLength: Infinity,
    };
  }

  public async send<D>(dataGiven?: D) {
    this.request = {
      ...this.request,
      data: JSON.stringify(dataGiven),
    };
    return await axios(this.request);
  }
}
