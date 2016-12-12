import { Component, Input, Output, EventEmitter, ViewChild, trigger, state, style, transition, animate } from '@angular/core';

import { Platform, Searchbar } from 'ionic-angular';

@Component({
	selector: 'ion-searchbar-wrapper',
	templateUrl: 'ion-searchbar-wrapper.html',
	animations: [
		trigger('flyInOut', [
			state('in', style({transform: 'translateY(0)'})),
			transition(':enter', [
				style({transform: 'translateY(-100%)'}),
				animate('0.3s ease-out')
			]),
			transition(':leave', [
				animate('0.3s ease-out', style({transform: 'translateY(-100%)'}))
			])
		])
	]
})
export class IonSearchbarWrapperComponent {

	@ViewChild(Searchbar)
	searchbar: Searchbar;

	@Input()
	color: string;

	@Output()
	ionInput: EventEmitter<any> = new EventEmitter<any>();

	isShowing: boolean = false;

	isIOS: boolean;

	constructor(platform: Platform) {
		this.isIOS = platform.is('ios');
	}

	show(): void {
		this.isShowing = true;
	}

	hide(): void {
		let fakeEvent: any = {
			target: {
				value: ''
			}
		};
		this.ionInput.emit(fakeEvent);
		this.isShowing = false;
	}

	redirecInput(event: any): void {
		this.ionInput.emit(event);
	}
}

