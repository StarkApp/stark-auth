import * as express from 'express';
import * as path from 'path';
import * as compression from 'compression';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import expressValidator = require('express-validator');
import { createExpressServer } from 'routing-controllers';
import * as errorHandler from 'errorhandler';
import * as passport from 'passport';
import * as flash from 'express-flash';
import * as dotenv from 'dotenv';

export let bootstrap = (): express.Express => {

    //  Load environment variables from .env file, where API keys and passwords are configured.
    dotenv.config({ path: '.env' });

    const app = createExpressServer({
        controllers: [
            path.join(__dirname, '../controllers', '*.controller.js')
        ],
        defaultErrorHandler: false
    });

    // View engine configuration
    app.set('views', path.join(__dirname, '../../views'));
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
    app.use(passport.session());

    // Security configuration
    app.use(flash());

    // Static assets configuration
    app.use(express.static(path.join(__dirname, '../public'), { maxAge: 31557600000 }));

    // Error Handler. Provides full stack - remove for production
    app.use(errorHandler());

    app.listen(process.env.PORT || 3000, () => {
        console.log('   _____ __             __      ___         __  __');
        console.log('  / ___// /_____ ______/ /__   /   | __  __/ /_/ /_ ');
        console.log('  \\__ \\/ __/ __ `/ ___/ //_/  / /| |/ / / / __/ __ \\');
        console.log(' ___/ / /_/ /_/ / /  / ,<    / ___ / /_/ / /_/ / / /');
        console.log('/____/\\__/\\__,_/_/  /_/|_|  /_/  |_\\__,_/\\__/_/ /_/');
        console.log(`Bound to port ${app.get('port')} in ${app.get('env')} mode`);
        console.log('Press CTRL-C to stop\n');
    });

    return app;

};
