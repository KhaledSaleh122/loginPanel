////////ES6 __dirname + __filename///////////
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
////////////////////
import express from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();
////////////////
const app = express();
app.set('view-engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
/////////////////
const port = 3000;
////////////////
app.listen(port, () => {
    console.log("server start at port " + port);
});