import { Component, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';

import { ToggleNavService, MenuService } from '../../services';
import { IUser } from "../../store/session";


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {

  @ViewChild('sidenav') sidenav: ElementRef;

  isNormalScreen: boolean = true;
  sideNavLock: boolean = false;
  isToggled: Observable<boolean>;
  // Menu Item
  menuList: Array<Object> = [];

  @select(['session', 'token']) loggedIn$: Observable<string>;
  @select(['session', 'user']) user$: Observable<IUser>;

  constructor(private toggleNavService: ToggleNavService, private menuService: MenuService) {
    this.menuList =menuService.getMenu('sideNav').items;
    //subscribe toggle service
    this.isToggled = this.toggleNavService.toggle();

    this.clearCookie("pin");
  }

  ngAfterViewInit() {
    var sidenav = this.sidenav.nativeElement;
    if (this.getCookie("pin") == "true") {
      this.toggleNav();
      this.sideNavLock = true;
    }
  }
  /* SideNav toggle operation*/
  toggleNav() {
    this.toggleNavService.toggle();
  }
  /* Pin sideNav*/
  changePinStatus() {
    if (this.getCookie("pin") == "") {
      this.setCookie("pin", "true", 365);
      this.sideNavLock = true;
    } else {
      if (this.getCookie("pin") == "true") {
        this.setCookie("pin", "false", 365);
        this.sideNavLock = false;
        this.toggleNav();
      } else {
        this.setCookie("pin", "true", 365);
        this.sideNavLock = true;
      }
    }
    console.log("pin", document.cookie);
  }
  /*Cookie operation*/
  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  clearCookie(cname) {
    this.setCookie("cname", "", -1);
  }

}
