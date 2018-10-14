import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MsalService } from '../../../@core/user/msal.service';

@Component({
    selector: 'app-login',
    template: '<div>Redirecting...</div>'
})
export class LoginComponent implements OnInit, AfterViewInit {

    constructor(public msalService: MsalService, public router: Router) { }

    ngOnInit() {
        this.msalService.getAuthenticationToken().then(token => {
            console.log('Token logged');
            localStorage.setItem('isLoggedin', 'true');
            // this.router.navigateByUrl('/');
        });
    }

    ngAfterViewInit() {
        /*
        $(function() {
            $(".preloader").fadeOut();
        });
        $(function() {
            (<any>$('[data-toggle="tooltip"]')).tooltip()
        });
        $('#to-recover').on("click", function() {
            $("#loginform").slideUp();
            $("#recoverform").fadeIn();
        });
        */
    }

    onLoggedin() {
        localStorage.setItem('isLoggedin', 'true');
    }

}
