import bcrypt from "bcryptjs";
import Bluebird from "bluebird";
import IUserPayload from "../interfaces/userpayload";
import IObjectConstructor from "../interfaces/object";
import { createUser, getUserById, getUserByEmail } from "../db/query";

/**
 * User model
 */
export class UserModel {
  /**
   * Class constructor.
   * @param {object} db - Object used to query database.
   */
  public constructor(
    private db: any
  ) {
    this.db = db;
    this.save = this.save.bind(this);
    this.findById = this.findById.bind(this);
    this.findByEmail = this.findByEmail.bind(this);
  }

  /**
   * Create a new user.
   * @param {object} values - values.
   * @returns {object} user
   */
  public async save(values: IUserPayload): Bluebird<IObjectConstructor> {
    const salt = bcrypt.genSaltSync(10);
    values.password = bcrypt.hashSync(values.password, salt);

    const user = [
      values.firstName,
      values.lastName,
      values.email,
      values.password
    ]

    const { rows } = await this.db.query(createUser, user);

    const payload = {
      id: rows[0].id,
      firstName: rows[0].firstname,
      lastName: rows[0].lastname,
      email: rows[0].email,
    };

    return payload;
  }

  /**
   * Method for finding a user using the id.
   * @param {number} id - the id of a user.
   * @returns {object} user
   */
  public async findById(id: number): Bluebird<IObjectConstructor| null> {
    const { rows } = await this.db.query(getUserById, [Number(id)]);
    this.db.release();

    if(!rows.length){
      return null;
    }

    const payload = {
      id: rows[0].id,
      firstName: rows[0].firstname,
      lastName: rows[0].lastname,
      email: rows[0].email,
    };

    return payload;
  }

  /**
   * Method for finding a user using the email address.
   * @param {String} email - the email of a user.
   * @returns {object} user
   */
  public async findByEmail(email: string): Bluebird<IObjectConstructor| null> {
    const { rows } = await this.db.query(getUserByEmail, [email]);

    if(!rows.length){
      return null;
    }
    const payload = {
      id: rows[0].id,
      firstName: rows[0].firstname,
      lastName: rows[0].lastname,
      email: rows[0].email,
      password: rows[0].password
    };

    return payload;
  }
}
