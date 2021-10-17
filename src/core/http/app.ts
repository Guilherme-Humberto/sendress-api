import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import routes from './api/routes'

const app = express()


app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    exposedHeaders: ['X-Total-Count', 'X-Total-Page'],
  }),
);

app.use(routes);
app.use(helmet())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

export { app }