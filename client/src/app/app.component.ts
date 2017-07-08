import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title = 'app works!';

    constructor(private http: Http) { }

    ngOnInit() {
        this.http.get('/api/test').subscribe(result => {
            console.log('Success', result);
        }, error => {
            console.error('Error', error);
        });
    }
}
