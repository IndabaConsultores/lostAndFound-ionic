import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { FirebaseObjectObservable } from 'angularfire2';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { TranslateService } from 'ng2-translate';

import { Office } from '../models/office';
import { OfficeService } from '../services/office.service';

import { OfficeItemListPage } from '../pages/office-item-list/office-item-list';

import moment from 'moment';
import 'moment/src/locale/eu';

declare var navigator: any;

@Component({
	templateUrl: 'app.html'
})
export class MyApp implements OnInit {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = OfficeItemListPage;
	pages: Array<{icon: string, title: string, component: any}>;
	office: FirebaseObjectObservable<Office>;

	innerHeight: number;

	constructor(
		public platform: Platform,
		public translate: TranslateService,
		public menu: MenuController,
		public officeService: OfficeService,
	) {
		platform.ready().then(() => {
			this.innerHeight = window.innerHeight;
			StatusBar.styleDefault();
			translate.setDefaultLang('eu');
			translate.use('eu');
			moment.locale('eu');
			if (navigator.splashscreen) navigator.splashscreen.hide();
		});
	}

	ngOnInit(): void {
		this.pages = [
			{
				icon: 'pricetags',
				title: 'found_items.title',
				component: OfficeItemListPage
			}
		];
		this.office = this.officeService.getObservableOffice();
	}

	openPage(page) {
		// close the menu when clicking a link from the menu
		this.menu.close();
		// navigate to the new page if it is not the current page
		this.nav.setRoot(page.component);
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any): void {
		this.innerHeight = window.innerHeight;
	}
}

