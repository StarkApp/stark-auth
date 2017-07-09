import { UserInterceptor } from './../interceptors';
import { User, UserAttributes } from './../models/User';
import { JsonController, Req, Res, Get, Post, Put, Param, Body, UseInterceptor, OnUndefined } from 'routing-controllers';
import * as passport from 'passport';
import { LocalStrategyInfo } from 'passport-local';

@JsonController('/api')
export class APIController {

    @Post('/register')
    @UseInterceptor(UserInterceptor.sanitize)
    create( @Body({ required: true }) user: UserAttributes) {
        // TODO check if request is valid
        // TODO check is email does not already exist
        return User.save(user);
    }

    @Put('/update/:id')
    update( @Param('id') id: string, @Body() user: UserAttributes) {
        return User.get(id).update(user).run();
    }

    @Post('/login')
    @OnUndefined(400)
    async login( @Req() req: any, @Res() res: any) {
        return new Promise((resolve, reject) => {
            passport.authenticate('local')(req, res, function () {
                req.logIn(req.body, (err: any) => {
                    if (err) {
                        console.log(err);
                        return resolve();
                    }
                    resolve(true);
                    res.redirect(req.session.returnTo || "/");
                });
            });
        });
    }

}
