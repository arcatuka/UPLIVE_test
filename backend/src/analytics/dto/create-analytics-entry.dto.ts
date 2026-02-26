// backend/src/analytics/dto/create-analytics-entry.dto.ts

import {
    IsString,
    IsOptional,
    IsObject,
    IsISO8601,
    IsDefined // Potentially use IsDefined if 'value' must always be present
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { AnalyticsEntry } from '../../common/interfaces/analytics-entry.interface';
  
  // Define a type for the dynamic metadata object to avoid 'any' in DTO
  type MetadataObject = { [key: string]: any };
  
  export class CreateAnalyticsEntryDto implements Omit<AnalyticsEntry, 'timestamp'> {
    @IsString()
    gameId: string;
  
    @IsString()
    playerId: string;
  
    @IsString()
    eventType: string;
  
    // --- REVISED VALIDATION FOR 'value' ---
    // For a flexible union type like number | string | boolean | object,
    // it's best to keep the DTO validation general and rely on the interface
    // and runtime checks in the service.
    @IsOptional() // The 'value' field itself is optional
    // @IsDefined() // Use @IsDefined() if 'value' must always be present, even if 'null' or empty string
    value?: number | string | boolean | object; // Accept any type for 'value' in the DTO payload
  
    @IsOptional()
    @IsISO8601({ strict: true }) // Ensure timestamp is a valid ISO 8601 date string
    timestamp?: string; // We expect string from client, will convert to Date in service
  
    @IsOptional()
    @IsString()
    sessionId?: string;
  
    @IsOptional()
    @IsObject()
    @Type(() => Object) // Ensures it's treated as an object for validation purposes
    metadata?: MetadataObject;
  }