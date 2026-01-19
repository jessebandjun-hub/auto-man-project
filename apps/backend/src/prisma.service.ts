import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './generated/client';
import * as path from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Use absolute path relative to the dist folder to ensure correct database file location
    // __dirname in dist is '.../apps/backend/dist'
    // We want '.../apps/backend/prisma/dev.db'
    const dbPath = path.resolve(__dirname, '..', 'prisma', 'dev.db');
    
    super({
      datasources: {
        db: {
          url: `file:${dbPath}`,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
