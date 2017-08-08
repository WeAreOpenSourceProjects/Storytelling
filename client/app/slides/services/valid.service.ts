import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ValidService {
    validAllSource = new BehaviorSubject<Object>({ status: false, msg: ["initial status all"] });
    validAll$ = this.validAllSource.asObservable();
    //validation for all page of slide
    validSlideSource = new BehaviorSubject<Object>({ status: true, msg: ["initial status slide"] });
    validSlide$ = this.validAllSource.asObservable();
    //validation for slides setting
    validSettingSource = new BehaviorSubject<Object>({ status: false, msg: ["initial status setting"] });
    validSetting$ = this.validSettingSource.asObservable();
    //record the validation for all page of slides


    readonly ERROR_MSG = {
        SLIDES_NAME: "Slides name is required",
        LAYOUT: "Please choose a layout type in slide page"
    }
    private unvalidSlideList: Array<number> = []; //list of unvalid slide page index

    constructor() {
    }

    handleNewChange(status, index, option) {
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
        if (option == "DELETE") {
            if (!find) return;
            this.unvalidSlideList.splice(find_index, 1);
            this.unvalidSlideList.forEach((l, i) => {
                if (l > index) this.unvalidSlideList[i]--;
            })
        }

        /* normal change*/
        else {
            if (status == false) {
                if (!find) {
                    this.unvalidSlideList.push(index);
                }
            }
            else {
                if (find) {
                    this.unvalidSlideList.splice(find_index, 1);
                }
            }
        }
    }

    changeValidStatus() {
        if (this.validSlideSource.value['status'] && this.validSettingSource.value['status']) {
            let validMsg = {
                status: true,
                msg: []
            };
            this.validAllSource.next(validMsg);
        }
        else {
            let validMsg = {
                status: false,
                msg: []
            };

            if (!this.validSettingSource.value['status']) {
                this.validSettingSource.value['msg'].forEach(m => validMsg.msg.push(m))
            }
            if (!this.validSlideSource.value['status']) {
                this.validSlideSource.value['msg'].forEach(m => validMsg.msg.push(m))
            }
            this.validAllSource.next(validMsg);
        }
    }

    changeSlideValid(status, index, option?) {
        this.handleNewChange(status, index, option || "");
        /* check the valid for all pages*/
        if (this.unvalidSlideList.length) {
            let validMsg = {
                status: false,
                msg: []
            };
            this.unvalidSlideList.forEach(l=>validMsg.msg.push("Slide"+" "+l+" "+"is not finished :("));
            this.validSlideSource.next(validMsg);
        }
        else {
            let validMsg = {
                status: true,
                msg: []
            };
            this.validSlideSource.next(validMsg);
        }
        this.changeValidStatus();
    }

    changeSettingValid(status, option?) {
        let validMsg = {
            status: status,
            msg: ["Slides name is required"]
        }
        this.validSettingSource.next(validMsg);
        this.changeValidStatus();
    }
}
