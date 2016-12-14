import { ElementRef, Directive, AfterViewInit } from '@angular/core';

@Directive({
	selector: 'ion-textarea[ion-autosize]'
})

export class IonAutosizeDirective implements AfterViewInit {

	constructor(private element: ElementRef) { }

	ngAfterViewInit(): void {
		let textarea: HTMLTextAreaElement = this.element.nativeElement.getElementsByTagName('textarea')[0];
		textarea.oninput = this.adjust;
	}

	adjust(this: HTMLTextAreaElement, event: Event): void {
		this.style.overflow = 'hidden';
		this.style.height = 'auto';
		this.style.height = this.scrollHeight + 'px';
	}
}

