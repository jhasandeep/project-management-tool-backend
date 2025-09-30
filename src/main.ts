import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedApp: any;

async function createApp() {
  if (!cachedApp) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    
    app.enableCors();
    app.setGlobalPrefix('api');
    await app.init();
    cachedApp = expressApp;
  }
  return cachedApp;
}

// For local development
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT || 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  }
}

// For Vercel serverless
export default async function handler(req: any, res: any) {
  const app = await createApp();
  return app(req, res);
}

// Start the app locally if not in production
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}
