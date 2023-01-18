import { PrometheusOptions } from '@willsoto/nestjs-prometheus';

export const prometheus: PrometheusOptions = {
    defaultLabels: {
        api: 'v1'
    }
};
