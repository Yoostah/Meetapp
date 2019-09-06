import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import MeetupController from './app/controllers/MeetupController';
import authMiddleware from './app/middlewares/auth';
import EventController from './app/controllers/EventController';
import EventSubscriptionController from './app/controllers/EventSubscriptionController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', upload.single('banner'), MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);

routes.get('/events', EventController.index);
routes.delete('/events/:id', EventController.delete);

routes.post('/event_subscriptions/:id', EventSubscriptionController.store);
routes.get('/event_subscriptions', EventSubscriptionController.index);

export default routes;
