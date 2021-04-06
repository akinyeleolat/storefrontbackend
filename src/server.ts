import express, { Request, Response } from 'express'
import dotenv from 'dotenv';

dotenv.config();

const app: express.Application = express()
const address = process.env.PORT;

app.use(express.json())

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

app.listen(address, function () {
    console.log(`starting app on: ${address}`)
})
