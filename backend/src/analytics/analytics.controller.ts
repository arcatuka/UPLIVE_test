// backend/src/analytics/analytics.controller.ts

import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { AnalyticsService } from './analytics.service';
  import { CreateAnalyticsEntryDto } from './dto/create-analytics-entry.dto';
  import type { AnalyticsEntry } from '../common/interfaces/analytics-entry.interface';
  
  @Controller('analytics')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true })) // Apply validation and transformation globally for this controller
  export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}
  
    /**
     * GET /analytics
     * Retrieves all analytics entries, with optional filtering by gameId or eventType.
     * Example: GET /analytics?gameId=mygame123&eventType=level_complete
     */
    @Get()
    findAll(
      @Query('gameId') gameId?: string,
      @Query('eventType') eventType?: string,
    ): AnalyticsEntry[] {
      let entries = this.analyticsService.findAll();
  
      if (gameId) {
        entries = entries.filter(entry => entry.gameId === gameId);
      }
  
      if (eventType) {
        entries = entries.filter(entry => entry.eventType === eventType);
      }
  
      return entries;
    }
  
    /**
     * POST /analytics
     * Creates a new analytics entry.
     * Takes a CreateAnalyticsEntryDto as body.
     */
    @Post()
    create(@Body() createAnalyticsEntryDto: CreateAnalyticsEntryDto): AnalyticsEntry {
      // The DTO ensures validation before reaching the service.
      // The service handles converting the optional timestamp string to a Date object.
      return this.analyticsService.create(createAnalyticsEntryDto as any); // Cast as any because DTO's timestamp is string, service expects Date|string
    }
  
    /**
     * GET /analytics/summary
     * Retrieves a summary of the analytics data.
     */
    @Get('summary')
    getSummary() {
      return this.analyticsService.getSummary();
    }
  }