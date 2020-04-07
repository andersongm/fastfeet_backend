import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import authMiddleware from './app/middlewares/auth';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';

const routes = new Router();
const upload = multer(multerConfig);
const uploadAvatar = multer({ storage: multerConfig.storageAvatar });
const uploadSign = multer({ storage: multerConfig.storageSignatures });

// routes.get('/teste', (req, res) => {
//   const date = new Date().getTime();
//   console.log(date);
//   console.log(startOfDay(date));
//   console.log(addHours(startOfDay(date), 5));
//   console.log(endOfDay(date));
//   console.log(subHours(endOfDay(date), 9));

//   const currentHour = subHours(new Date(), 2).getHours();

//   console.log('currentHour:', currentHour);

//   const ok = currentHour > 8 && currentHour <= 18 ? 'ok' : 'nok';

//   // const retorno = format(date, 'dd/MM/yyyy HH:mm:ss');
//   const retorno = format(date, 'dd/MM/yyyy').concat(' 08:00:00');

//   // console.log(startOfDay(date));

//   return res.json(ok);
// });

routes.post('/sessions', SessionController.store);
routes.post('/deliverymans/sessions', SessionController.mobileStore);
routes.post('/users', UserController.store);
routes.post('/files', upload.single('file'), FileController.store);
routes.post('/avatarfiles', uploadAvatar.single('file'), FileController.store);
routes.post('/signaturefiles', uploadSign.single('file'), FileController.store);
// upload.single('file')

routes.get('/deliverymans/:id/deliveries', DeliverymanController.show);

// Delivery Problem
routes.post('/delivery/:id/problems', DeliveryProblemsController.store);
routes.get('/deliveries/problems', DeliveryProblemsController.index);
routes.get('/delivery/:id/problems', DeliveryProblemsController.show);
routes.put('/deliveries/:id/:operation', DeliveryController.update);

routes.use(authMiddleware);

// Recipient Routes
routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.put('/recipients/:id', RecipientController.update);

// Deliveryman Routes
routes.post('/deliverymans', DeliverymanController.store);
routes.get('/deliverymans', DeliverymanController.index);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);
// routes.put('/deliverymans/:id/deliveries', DeliverymanController.update);

// Delivery Routes
routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);
routes.put('/deliveries/:id', DeliveryController.update);
routes.get('/deliveries/:id', DeliveryController.show);
routes.delete('/deliveries/:id', DeliveryController.delete);

// Delivery Problems

routes.put('/problem/:id/cancel-delivery', DeliveryProblemsController.update);

export default routes;
