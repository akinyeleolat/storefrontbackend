import { Router } from 'express';
import {UserRoutes} from './user';

const routes = Router();

routes.use('/auth', UserRoutes);

export default routes;