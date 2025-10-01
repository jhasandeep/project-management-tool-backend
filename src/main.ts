import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import { Request, Response } from 'express';

let cachedApp: express.Express;

async function bootstrap(): Promise<express.Express> {
  if (!cachedApp) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp)
    );
    
    nestApp.enableCors({
      origin: true,
      credentials: true,
    });
    
    await nestApp.init();
    cachedApp = expressApp;
  }
  
  return cachedApp;
}

export default async (req: Request, res: Response) => {
  const app = await bootstrap();
  return app(req, res);
};





