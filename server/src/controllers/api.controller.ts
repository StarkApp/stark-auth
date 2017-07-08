import { UserInterceptor } from './../interceptors';
import { User, UserAttributes } from './../models/User';
import { JsonController, Get, Post, Body, UseInterceptor } from 'routing-controllers';

@JsonController('/api')
export class APIController {

    @Post('/register')
    @UseInterceptor(UserInterceptor.sanitize)
    create( @Body({ required: true }) user: UserAttributes) {
        // TODO check if request is valid
        // TODO check is email does not already exist
        return User.save(user);
    }
}
