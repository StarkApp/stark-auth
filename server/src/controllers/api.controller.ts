import { JsonController, Get } from 'routing-controllers';

@JsonController('/api')
export class APIController {

    @Get('/test')
    test(): string {
        return 'testing';
    }
}
