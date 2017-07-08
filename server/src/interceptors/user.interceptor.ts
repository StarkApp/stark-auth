import { UserAttributes } from './../models/User';
import { InterceptorInterface, Action } from 'routing-controllers';
import * as bcrypt from 'bcrypt-nodejs';
import * as crypto from 'crypto';

export class UserInterceptor {

    /**
     * Sanitizes the user object prior to returning it to the client
     * Allows the server to remove sensitive information, such as passwords
     */
    static sanitize = class implements InterceptorInterface {

        intercept(action: Action, user: UserAttributes) {
            delete user.password;
            return user;
        }

    };

}
