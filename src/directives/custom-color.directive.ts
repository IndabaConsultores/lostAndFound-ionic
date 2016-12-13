import { Directive, ElementRef } from '@angular/core';

import { Office } from '../models/office';

import { OfficeService } from '../services/office.service';

@Directive({
	selector: '[customColor]'
})
export class CustomColorDirective {
	constructor(
		el: ElementRef,
		officeService: OfficeService
	) {
		let head: HTMLHeadElement = document.head || document.getElementsByTagName('head')[0];
		let style: HTMLStyleElement = document.createElement('style');
		style.type = 'text/css';
		officeService.getObservableOffice().subscribe((office) => {
			console.log(office);
			let css: string = `
				.toolbar-background {
					background-color: ${office.color1} !important;
					border: none !important;
				}
				.toolbar-title, .bar-button {
					color: ${office.color2} !important;
				}
			`;

			style.appendChild(document.createTextNode(css));

			head.appendChild(style);
		});
	}
}

