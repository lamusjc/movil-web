import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../login/login.service';
import { UrlService } from 'src/services/url.service';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

    /**
     * Constructor
     *
     * @param {FuseConfigService} fuseConfigService
     * @param {FormBuilder} formBuilder
     */
    constructor(private router: Router, private urlService: UrlService, private HttpClient: HttpClient, public loginService: LoginService) { }

    canActivate(): Observable<boolean> | boolean {
        const headers = {
            headers: new HttpHeaders({
                'Content-Type': "application/json"
            }), withCredentials: true
        };
        if ((this.loginService.isAuthenticated === false)) {
            return this.HttpClient.get(this.urlService.getUrl() + 'info', headers).pipe(map(data => {
                console.log('auth.guard');
                return true;
            }, (err) => {
                this.router.navigate(['login']);
                return false;
            }));
        } else if (this.loginService.isAuthenticated === true) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}