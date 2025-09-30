const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

// Import your compiled AppModule
const { AppModule } = require('../dist/app.module');

const server = express();
let app;

async function createNestServer(expressInstance) {
  if (!app) {
    app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressInstance),
      {
        logger: ['error', 'warn'],
      }
    );

    // Enable CORS
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'https://your-frontend.vercel.app'
      ],
      credentials: true,
    });

    // Set global prefix
    app.setGlobalPrefix('api');

    await app.init();
  }
  return app;
}

module.exports = async (req, res) => {
  await createNestServer(server);
  server(req, res);
};
