import core from '@actions/core';
import rax from 'retry-axios';
import axios, {AxiosPromise, AxiosRequestConfig} from 'axios';

export default function request(header: any, data: any): AxiosPromise<any> {
    const config: AxiosRequestConfig = {
        url: 'https://api.github.com/graphql',
        method: 'post',
        headers: header,
        data: data,
        raxConfig: {
            retry: 10,
            noResponseRetries: 3,
            retryDelay: 1000,
            backoffType: 'linear',
            httpMethodsToRetry: ['POST'],
            onRetryAttempt: err => {
                const cfg = rax.getConfig(err);
                core.warning(err);
                core.warning(`Retry attempt #${cfg?.currentRetryAttempt}`);
            }
        }
    };

    const x = axios.create(config);
    // rax.attach(x);

    return x.request(config);
}
