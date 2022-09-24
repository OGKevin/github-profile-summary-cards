import core from '@actions/core';
import rax from 'retry-axios';
import axios, {AxiosPromise} from 'axios';

export default function request(header: any, data: any): AxiosPromise<any> {
    const x = axios.create({
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
    });

    rax.attach(x);

    return x.request({});
}
