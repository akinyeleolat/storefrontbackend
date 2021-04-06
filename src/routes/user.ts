/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Router } from 'express';
import pool from '../db/connect';
import {UserModel} from '../model/user';
import {UserService} from '../service';
import {
    validateRegister,
    validatingLogin,
    verifyUser,
} from '../middlewares';




export async function UserRoutes(){
    const db = await pool.connect();
    const api = Router();
    const userController = new UserService(new UserModel(db));

    api.post('/signup', [validateRegister], userController.register);

    return api;

}