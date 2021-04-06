import { NextFunction, Request, Response } from 'express';
import {
    BAD_REQUEST,
    CREATED,
    getStatusText,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    OK,
} from 'http-status-codes';

import IUserPayload from "../interfaces/userpayload";
import IObjectConstructor from '../interfaces/object';
import { UserModel } from '../model';
import { encryptPassword, isEqualsPassword } from '../utils/encrypter';
import { createToken } from '../utils/passport';
import {
    apiResponse,
    failedResponse,
    successResponse,
} from '../utils/response';
import { logger } from '../utils/logger';
// import pool from '../db/connect';

/**
 * @description User Service
 * @class
 * @public
 */
 export class UserService {

    /**
     * @description Creates an instance of user controller.
     * @author `Tosin Akinyele`
     * @constructor
     * @param {UserModel} userModel
     */
     public constructor(private userModel: UserModel) {
        this.register = this.register.bind(this);
        // this.getAllUsers = this.getAllUsers.bind(this);
        // this.login = this.login.bind(this);
    }

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
     public async register(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            const user = <IUserPayload>req.body;
            logger.info('register');

            // const db = await pool.connect();
            // this.userModel = new UserModel(db);

            const isEmailAlready = await this.userModel.findByEmail(
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

            const payload = await this.userModel.save(user);

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
            logger.error('error while register', { meta: { ...error } });
            return apiResponse(
                res,
                failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
                INTERNAL_SERVER_ERROR,
            );
        }
    }
 }