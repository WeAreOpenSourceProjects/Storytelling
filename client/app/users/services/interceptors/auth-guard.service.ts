import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { select } from '@angular-redux/store';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs/Observable';
import { IUserRecord, SessionActions } from 'app/core';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    userRoles = [];
    @select(['session', 'user']) user$: Observable<IUserRecord>;

    constructor(private router: Router, private usersService: UsersService, private actions: SessionActions ) {}

    isAuthorised(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, user: IUserRecord): boolean {
        // console.log('isAuthorised');
        this.userRoles = user.roles;
        if (route.data.roles === undefined || route.data.roles.indexOf('*') !== -1) {
            // console.log('true');
            return true;
        } else if (this.userRoles) {
            for (const userRoleIndex in this.userRoles) {
                if (this.userRoles.hasOwnProperty(userRoleIndex)) {
                    for (const roleIndex in route.data.roles) {
                        if (route.data.roles.hasOwnProperty(roleIndex) && route.data.roles[roleIndex] === this.userRoles[userRoleIndex]) {
                            return true;
                        }
                    }
                }
            }
            this.router.navigate(['/forbiden']);
            return false;
        }
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        // console.log('AuthGuard');
        this.actions.getProfile();
        // Wait to refresh user token from API
        return this.user$
            .skip(1)
            .map((user: IUserRecord) =>  this.isAuthorised(route, state, user))
            .first();
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canActivate(route, state);
    }

}
