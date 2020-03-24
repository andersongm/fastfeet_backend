import 'dotenv/config';
import path from 'path';
import cors from 'cors';
import express from 'express';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/avatarfiles',
      express.static(path.resolve(__dirname, '..', 'uploads', 'avatars'))
    );
    this.server.use(
      '/signaturefiles',
      express.static(path.resolve(__dirname, '..', 'uploads', 'signatures'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
