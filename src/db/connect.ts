import { Pool } from "pg";
import dotenv from "dotenv";
import setup from '../config';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

let config;

if(env === 'development'){
config = setup.development
}else{
    config = setup.test
}


let pool:any;

if (env === 'production') {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  } else {
    pool = new Pool(config);
  }

pool.on("connect", () => {
    console.log(`${process.env.NODE_ENV} environment config loaded, db connection established`);
});

export default pool;