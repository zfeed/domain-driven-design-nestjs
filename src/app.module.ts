import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GamingModule } from './contexts/gaming';
import { BettingModule } from './contexts/betting';
import { prometheus } from './configs';
import { HttpMetricsInterceptor } from './packages/metrics';

@Module({
    imports: [
        GamingModule,
        BettingModule,
        PrometheusModule.register(prometheus)
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: HttpMetricsInterceptor
        }
    ]
})
export class AppModule {}
