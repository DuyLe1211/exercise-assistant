import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { engine } from 'express-handlebars'
import morgan from 'morgan';
import mongoose from 'mongoose';
import route from './routes/main.js';
import bodyParser from 'body-parser';

const app = express();

// BodyParser
app.use(bodyParser.urlencoded({ extended: true, type: 'application/x-www-form-urlencoded' }))
app.use(bodyParser.json())

// Morgan
app.use(morgan('dev'));
const __fileName = fileURLToPath(import.meta.url);
const __dirname = 'D:\\WorkSpace\\Work\\Healthy Life\\src\\'

// Static file
app.use('/public', express.static(path.join(__dirname, 'public/')));
app.use('/app', express.static(path.join(__dirname, 'app/')));

// Express Handlebars
app.engine('hbs', engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views/'));

// Route
route(app);

// Run mongoose
mongoose.connect('mongodb+srv://DuyLee:lmD%4012112007@healthylife.ugka3ze.mongodb.net/Healthy_Life')
  .then(() => console.log('MongoDB Connected!'));

// Run Server
app.listen(3000, () => {
    console.log("App is running on port 3000!");
})

console.log(path.join(__dirname, 'views/'))