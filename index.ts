import express from 'express'
import * as routes from './src/routes';

const app = express()
const port = 8085;
routes.endpoints(app);

app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );