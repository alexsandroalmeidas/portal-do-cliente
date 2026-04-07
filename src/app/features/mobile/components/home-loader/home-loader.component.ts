import { Component, OnInit, Input } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'home-loader',
    standalone: true,
    imports: [
        SharedModule
    ],
    templateUrl: './home-loader.component.html',
    styleUrls: ['./home-loader.component.scss']
})
export class HomeLoaderComponent implements OnInit {

    @Input() homeLoaderId = '';

    constructor() { }

    ngOnInit() {
    }
}
