import { Injectable } from '@angular/core';
import {MenuService} from '../core/services/menu.client.service';
@Injectable()
export class UsersConfig {
  constructor(private menuService : MenuService){

  }
  addMenu(){
    this.menuService.addMenuItem('toolBar',{
      state: '#/users-list-users',
      title: 'User users-list',
      icon: 'fa-users-list',
      roles: ['admin'],
    })
  }


}
