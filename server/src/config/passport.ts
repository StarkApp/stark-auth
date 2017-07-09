import { User, UserAttributes } from './../models/User';
import * as passport from 'passport';
import * as request from 'request';
import * as passportLocal from 'passport-local';
import * as _ from 'lodash';

// import { default as User } from '../models/User';
import { Request, Response, NextFunction } from 'express';

export let passportConfig = (passport: any): void => {
    const LocalStrategy = passportLocal.Strategy;

    passport.serializeUser((user: UserAttributes, done: any) => {
        done(undefined, user);
    });

    passport.deserializeUser((user: UserAttributes, done: any) => {
        User.findByEmail(user.email)
            .then(user => {
                done(undefined, user);
            })
    });

    /**
     * Sign in using Email and Password.
     */
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findByEmail(email.toLowerCase())
            .then(user => {
                if (!user) {
                    return done(undefined, false, {
                        message: `Email ${email} not found.`
                    });
                }
                user.comparePassword(password, (err: Error, isMatch: boolean) => {
                    if (err) {
                        return done(err);
                    }
                    if (isMatch) {
                        return done(undefined, user);
                    }
                    return done(undefined, false, {
                        message: 'Invalid email or password'
                    });
                });
            }, (error) => {
                console.log('error', error);
                return done(undefined, error);
            })
    }));

}



/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Login Required middleware.
 */
export let isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
export let isAuthorized = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.path.split('/').slice(-1)[0];

    if (_.find(req.user.tokens, { kind: provider })) {
        next();
    } else {
        res.redirect(`/auth/${provider}`);
    }
};
