import { ExpressMiddlewareInterface } from 'routing-controllers';
import * as bcrypt from 'bcrypt-nodejs';
import * as crypto from 'crypto';

export class UserMiddleware {

    static example = class implements ExpressMiddlewareInterface {

        use(request: any, response: any, next?: (err?: any) => any): any {
            next();
        }

    };

}
