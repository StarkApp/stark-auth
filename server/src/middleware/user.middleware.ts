import { ExpressMiddlewareInterface } from 'routing-controllers';

export class UserMiddleware {

    static example = class implements ExpressMiddlewareInterface {

        use(request: any, response: any, next?: (err?: any) => any): any {
            next();
        }

    };

}
