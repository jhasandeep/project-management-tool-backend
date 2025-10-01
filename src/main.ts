import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';

const server = express();

export default async (req, res) => {
  if (!server.locals.app) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      { logger: false }
    );
    await app.init();
    server.locals.app = app;
  }
  
  return server(req, res);
};




