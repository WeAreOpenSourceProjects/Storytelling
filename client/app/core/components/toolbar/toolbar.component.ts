import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {TooltipPosition} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { SessionActions } from '../../actions';
import { IUser } from '../../store/session';
import { ToggleNavService } from '../../services';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  title : string;
  isToggled: Observable<boolean>;

  @Input() titleToolbar: string;
  @select(['session', 'token']) loggedIn$: Observable<string>;
  @select(['session', 'user']) user$: Observable<IUser>;
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private actions: SessionActions,
              private toggleNavService: ToggleNavService) {}


  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((event) => this.title = event['title'] );
    //subscribe toggle service
    this.isToggled = this.toggleNavService.toggle$;

  }

  logout() {
   this.actions.logoutUser();
   this.router.navigate(['/']);
  }

}
