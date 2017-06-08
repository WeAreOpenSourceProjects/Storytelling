import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ValidService {
    validAllSource = new BehaviorSubject<boolean>(false);
    validAll$ = this.validAllSource.asObservable();
    //validation for all page of slide
    validSlideSource = new BehaviorSubject<boolean>(true);
    validSlide$ = this.validAllSource.asObservable();
    //validation for slides setting
    validSettingSource = new BehaviorSubject<boolean>(false);
    validSetting$ = this.validSettingSource.asObservable();
    //record the validation for all page of slides
    unvalidSlideList: Array<number> = [];
    constructor() {
    }
    changeValidStatus() {
        if (this.validSlideSource.value && this.validSettingSource.value) {

            this.validAllSource.next(true);
        }
        else {
            this.validAllSource.next(false);
        }
    }
    changeSlideValid(status, index, option?) {

        /* set the unvalid slide list*/
        let find = false;
        let find_index = 0;
        this.unvalidSlideList.forEach((l, i) => {
            if (index == l) {
                find = true;
                find_index = i;
            }
        })
        /* delete slide option*/
        if (option) {
            if (option == "DELETE" && find){

              this.unvalidSlideList.splice(find_index, 1);
              this.unvalidSlideList.forEach((l,i)=>{
                if(l>index) this.unvalidSlideList[i]--;
              })
            }

        }
        /* normal change*/
        else {
            if (status == false) {

                if (!find) this.unvalidSlideList.push(index);
            }
            else {
                if (find) this.unvalidSlideList.splice(find_index, 1);
            }
        }

        /* check the valid for all pages*/
        if (this.unvalidSlideList.length) {
            this.validSlideSource.next(false);
        }
        else {
            this.validSlideSource.next(true);
        }
        this.changeValidStatus();
    }
    changeSettingValid(status) {
        this.validSettingSource.next(status);
        this.changeValidStatus();
    }
}
