import { Controller, Render, Get } from 'routing-controllers';

/**
 * Renders the initial template when the user requests the root of the server
 * @author Sean Perkins <sean@meetmaestro.com>
 */
@Controller()
export class ViewController {

    @Get()
    @Render('index.html')
    index() { }
}
