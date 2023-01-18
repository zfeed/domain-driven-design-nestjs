import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    RequestMethod
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as url from 'node:url';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { Counter, Summary } from 'prom-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
    private counter?: Counter;

    private summary?: Summary;

    constructor(private reflector: Reflector) {}

    private getCounter() {
        if (this.counter) {
            return this.counter;
        }

        this.counter = new Counter({
            name: 'http_requests_counter',
            help: 'Count http requests',
            labelNames: ['method', 'path']
        });

        return this.counter;
    }

    private getSummary() {
        if (this.summary) {
            return this.summary;
        }

        this.summary = new Summary({
            name: 'http_requests_summary_ms',
            help: 'Summary of http requests in milliseconds',
            labelNames: ['method', 'path']
        });

        return this.summary;
    }

    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<unknown> {
        if (context.getType() !== 'http') {
            return next.handle();
        }

        const methodNumber = this.reflector.get<string[]>(
            METHOD_METADATA,
            context.getHandler()
        ) as unknown as number;

        const method = RequestMethod[methodNumber] as string;

        const handlerPath = this.reflector.get<string[]>(
            PATH_METADATA,
            context.getHandler()
        ) as unknown as string;

        const controllerPath = this.reflector.get<string[]>(
            PATH_METADATA,
            context.getClass()
        ) as unknown as string;

        const path = url.resolve(
            controllerPath.endsWith('/')
                ? controllerPath
                : `${controllerPath}/`,
            handlerPath.startsWith('/')
                ? handlerPath.replace(/^\//, '')
                : handlerPath
        );

        const counter = this.getCounter().labels({ method, path });
        const summary = this.getSummary().labels({ method, path });

        counter.inc(1);

        const start = performance.now();

        return next.handle().pipe(
            tap(() => {
                const end = performance.now() - start;

                summary.observe(end);
            })
        );
    }
}
