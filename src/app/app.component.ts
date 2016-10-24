import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { FirebaseObjectObservable } from 'angularfire2';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { TranslateService } from 'ng2-translate';

import { Office } from '../models/office';
import { OfficeService } from '../services/office.service';
import { AuthService } from '../services/auth.service';

import { OfficeItemListPage } from '../pages/office-item-list/office-item-list';
import { AlertItemListPage } from '../pages/alert-item-list/alert-item-list';
import { PreLaunchAlertPage } from '../pages/pre-launch-alert/pre-launch-alert';
import { LoginPage } from '../pages/login/login';

import moment from 'moment';
import 'moment/src/locale/eu';

declare var navigator: any;

@Component({
	templateUrl: 'app.html'
})
export class MyApp implements OnInit {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = OfficeItemListPage;
	currentPage: any = OfficeItemListPage;
	pages: Array<{icon: string, title: string, component: any}>;
	office: FirebaseObjectObservable<Office>;

	innerHeight: number;

	constructor(
		public platform: Platform,
		public translate: TranslateService,
		public menu: MenuController,
		public officeService: OfficeService,
		public authService: AuthService
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
				title: 'item_list.office.title',
				component: OfficeItemListPage
			},
			{
				icon: 'alert',
				title: 'item_list.alert.title',
				component: AlertItemListPage
			},
			{
				icon: 'megaphone',
				title: 'launch_alert.title',
				component: PreLaunchAlertPage
			}
		];
		this.office = this.officeService.getObservableOffice();
	}

	openPage(page) {
		// close the menu when clicking a link from the menu
		this.menu.close();
		// navigate to the new page if it is not the current page
		if (this.currentPage !== page.component) {
			this.nav.setRoot(page.component)
			.then(() => {
				this.currentPage = page.component;
			})
			.catch((error) => {
				this.nav.push(LoginPage, {
					redirect: page.component
				});
			});
		}
	}

	isAuthenticated(): boolean {
		if (this.authService.getCurrentUser()) {
			return true;
		} else {
			return false
		}
	}

	login(): void {
		this.menu.close();
		this.nav.push(LoginPage, {redirect: this.rootPage});
	}

	logout(): void {
		this.menu.close();
		this.authService.logout();
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any): void {
		this.innerHeight = window.innerHeight;
	}
}

