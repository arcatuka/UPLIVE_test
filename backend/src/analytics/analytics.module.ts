// backend/src/analytics/analytics.module.ts

import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [], 
  providers: [AnalyticsService],
  exports: [AnalyticsService],
  controllers: [AnalyticsController], // Export so other modules can use it
})
export class AnalyticsModule {}