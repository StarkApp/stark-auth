import { rethinkDB } from './rethinkdb';
import * as express from 'express';
import 'reflect-metadata';
import * as path from 'path';
import * as compression from 'compression';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import expressValidator = require('express-validator');
import { useExpressServer } from 'routing-controllers';
import * as errorHandler from 'errorhandler';
import * as passport from 'passport';
import * as flash from 'express-flash';
import * as dotenv from 'dotenv';

import { passportConfig } from './passport';

export let bootstrap = (): void => {

    //  Load environment variables from .env file, where API keys and passwords are configured.
    dotenv.config({ path: '.env' });

    // Create an express server
    const app = express();

    // View engine configuration
    app.set('views', path.join(__dirname, '../../public'));
    app.set('view engine', 'html');
    app.engine('html', require('ejs').renderFile);

    app.use(compression());
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressValidator());

    // Session configuration
    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET
    }));

    // Authentication (Passport) configuration
    app.use(passport.initialize());
    // Persistent login sessions
    app.use(passport.session());
    app.use(flash());

    passportConfig(passport);

    // RethinkDB configuration
    rethinkDB().then(() => {

        // Error Handler. Provides full stack - remove for production
        app.use(errorHandler());

        useExpressServer(app, {
            cors: true,
            controllers: [path.join(__dirname, '../controllers', '*.js')],
            middlewares: [path.join(__dirname, '../middleware/', '*.js')],
            interceptors: [path.join(__dirname, '../interceptors/', '*.js')]
        });

        app.listen(process.env.PORT || 3000, () => {
            console.log('   _____ __             __      ___         __  __');
            console.log('  / ___// /_____ ______/ /__   /   | __  __/ /_/ /_ ');
            console.log('  \\__ \\/ __/ __ `/ ___/ //_/  / /| |/ / / / __/ __ \\');
            console.log(' ___/ / /_/ /_/ / /  / ,<    / ___ / /_/ / /_/ / / /');
            console.log('/____/\\__/\\__,_/_/  /_/|_|  /_/  |_\\__,_/\\__/_/ /_/');
            console.log(`Bound to port ${process.env.PORT || 3000} in ${app.get('env')} mode`);
            console.log('Press CTRL-C to stop\n');
        });
    });

};
