import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express'; // use * as express NOT import express from 'express'
import { Request, Response } from 'express';

let cachedServer: express.Express | undefined;

async function bootstrap(): Promise<express.Express> {
  if (!cachedServer) {
    const server = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors();
    await app.init();
    cachedServer = server;
  }
  return cachedServer;
}

export default async (req: Request, res: Response) => {
  const server = await bootstrap();
  return (server as any)(req, res); // use as any to allow function-like invocation
};
