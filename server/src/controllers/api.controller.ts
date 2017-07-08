import { User } from './../models/User';
import { JsonController, Get, Post } from 'routing-controllers';

@JsonController('/api')
export class APIController {

    @Get('/test')
    test(): string {
        return 'testing';
    }

    @Post('/test')
    create() {
        return User.save({
            identity: 'someidentity',
            email: 'someemail',
            password: 'somepassword'
        });
    }
}
