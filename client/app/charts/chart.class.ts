import { Component, OnInit, Input } from '@angular/core';

export abstract class Chart {
    @Input() dataInput: any;
    @Input() configInput: any;
    constructor(){};

}
