/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Router } from 'express';
import {UserService} from '../service';
import {
    validateRegister,
    validatingLogin,
    verifyUser,
} from '../middlewares';

const userRoutes = Router();



userRoutes.post('/signup', [validateRegister], UserService.register);
userRoutes.post('/login', [validatingLogin], UserService.login);


export default userRoutes;