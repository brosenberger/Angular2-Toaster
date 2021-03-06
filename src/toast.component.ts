import {Component, Input, ViewChild, ComponentResolver, ViewContainerRef, EventEmitter}
from '@angular/core';

import {Toast, ClickHandler} from './toast';
import {BodyOutputType} from './bodyOutputType';

@Component({
    selector: '[toastComp]',
    template: `
        <div *ngIf="toast.showCloseButton" (click)="click(toast)" [innerHTML]="toast.closeHtml"></div>
        <i class="toaster-icon" [ngClass]="iconClass"></i>
        <div [ngClass]="toast.toasterConfig.titleClass">{{toast.title}}</div>
        <div [ngClass]="toast.toasterConfig.messageClass" [ngSwitch]="toast.bodyOutputType">
            <div *ngSwitchWhen="bodyOutputType.Component" #componentBody></div> 
            <div *ngSwitchWhen="bodyOutputType.TrustedHtml" [innerHTML]="toast.html"></div>
            <div *ngSwitchWhen="bodyOutputType.Default">{{toast.body}}</div>
        </div>`,
    outputs: ['clickEvent']
})

export class ToastComponent {

    @Input() toast: Toast;
    @Input() iconClass: string;
    @ViewChild('componentBody', { read: ViewContainerRef }) componentBody: ViewContainerRef;

    private bodyOutputType = BodyOutputType;
    public clickEvent = new EventEmitter();

    constructor(private resolver: ComponentResolver) { }

    ngOnInit() {
        if (this.toast.bodyOutputType === this.bodyOutputType.Component) {
            this.resolver.resolveComponent(this.toast.body).then(factory => {
                this.componentBody.createComponent(factory, 0, this.componentBody.injector);
            });
        }
    }
    
    click(toast: Toast) {
        this.clickEvent.emit({
            value : { toast: toast, isCloseButton: true}
        });
    }
}