import { NextFunction, Request, Response } from 'express';
import {
    BAD_REQUEST,
    CREATED,
    getStatusText,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    OK,
    UNAUTHORIZED,
} from 'http-status-codes';

import IUserPayload from "../interfaces/userpayload";
import IObjectConstructor from '../interfaces/object';
import { UserModel } from '../model';
import { isEqualsPassword } from '../utils/encrypter';
import { createToken } from '../utils/passport';
import {
    apiResponse,
    failedResponse,
    successResponse,
} from '../utils/response';
import { logger } from '../utils/logger';
import pool from '../db/connect';

/**
 * @description User Service
 * @class
 * @public
 */
 export class UserService {

    /**
     * register a new user into the system
     * @Post
     * @async
     * @public
     * @method register
     * @memberof UserService
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>} a promise of EndPointResponse
     */
     static async register(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        const db = await pool.connect();
        try {
            const user = <IUserPayload>req.body;
            
            logger.info('register');

            const userModel = new UserModel(db);

            const isEmailAlready = await userModel.findByEmail(
                user.email,
            );

            if (isEmailAlready !== null) {
                logger.error(
                    `the email ${isEmailAlready.email} already exists`,
                );
                return apiResponse(
                    res,
                    failedResponse('email already exists'),
                    BAD_REQUEST,
                );
            }

            const payload = await userModel.save(user);

            db.release();

            const token = createToken(payload);

            return apiResponse(
                res,
                successResponse({
                    ...payload,
                    token,
                }),
                CREATED,
            );
            
        } catch (error) {
            console.log(error);
            logger.error('error while register', { meta: { ...error } });
            return apiResponse(
                res,
                failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
                INTERNAL_SERVER_ERROR,
            );
        }
    }


    /**
     * login a new user into the system
     * @Post
     * @async
     * @public
     * @method login
     * @memberof UserService
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>} a promise of EndPointResponse
     */
     static async login(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        const db = await pool.connect();
        try {
            const user = <IUserPayload>req.body;
            
            logger.info(`login ${req.body.email}`);

            const userModel = new UserModel(db);

            const payload = await userModel.findByEmail(
                user.email,
            );

            if (payload === null) {
                logger.error(`user not found: ${user.email}`);

                return apiResponse(
                    res,
                    failedResponse(getStatusText(UNAUTHORIZED)),
                    UNAUTHORIZED,
                );
            }

            const {password } = <IUserPayload> <unknown>payload;

            const userPassword = password;

            const samePassword = await isEqualsPassword(
               userPassword,
                user.password,
            );

            if (!samePassword) {
                logger.error('wrong password');
                return apiResponse(
                    res,
                    failedResponse(getStatusText(UNAUTHORIZED)),
                    UNAUTHORIZED,
                );
            }

            db.release();

            const toSend = {
                id: payload.id,
                email: payload.email,
                firstName: payload.firstName,
                middleName: payload.middleName,
                lastName: payload.lastName,
            };

            const token = createToken(toSend);

            return apiResponse(
                res,
                successResponse({
                    ...toSend,
                    token,
                }),
                OK,
            );
            
        } catch (error) {
            console.log(error);
            logger.error('error while login', { meta: { ...error } });
            return apiResponse(
                res,
                failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
                INTERNAL_SERVER_ERROR,
            );
        }
    }
 }