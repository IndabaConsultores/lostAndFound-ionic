import { NgModule } from '@angular/core';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate/ng2-translate';
import { MomentModule } from 'angular2-moment';

import { IonicApp, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { Constants, FirebaseConfig } from './app.constants';
import { OfficeService } from '../services/office.service';
import { CategoryService } from '../services/category.service';
import { ItemService } from '../services/item.service';
import { ImageService } from '../services/image.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { LocationService } from '../services/location.service';
import { MessageService } from '../services/message.service';
import { SettingsService } from '../services/settings.service';

import { NormalizeDistancePipe } from '../pipes/normalize-distance.pipe';
import { LeafletMapComponent, LeafletMarker } from '../components/leaflet-map/leaflet-map';
import { ImageSelectorComponent } from '../components/image-selector/image-selector';
import { IonSearchbarWrapperComponent } from '../components/ion-searchbar-wrapper/ion-searchbar-wrapper';
import { OfficeItemListPage } from '../pages/office-item-list/office-item-list';
import { OfficeItemDetailPage } from '../pages/office-item-detail/office-item-detail';
import { AlertItemListPage } from '../pages/alert-item-list/alert-item-list';
import { AlertItemDetailPage } from '../pages/alert-item-detail/alert-item-detail';
import { LaunchAlertPage } from '../pages/launch-alert/launch-alert';
import { PreLaunchAlertPage } from '../pages/pre-launch-alert/pre-launch-alert';
import { ImageDetailPage } from '../pages/image-detail/image-detail';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/signup/signup';
import { ItemMessagesPage } from '../pages/item-messages/item-messages';
import { SettingsPage } from '../pages/settings/settings';
import { AlertItemMapPage } from '../pages/alert-item-map/alert-item-map';

export function translateLoaderFactory(http: Http) {
	return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

@NgModule({
	declarations: [
		MyApp,
		OfficeItemListPage,
		AlertItemListPage,
		PreLaunchAlertPage,
		LaunchAlertPage,
		OfficeItemDetailPage,
		AlertItemDetailPage,
		ImageDetailPage,
		LeafletMarker,
		LoginPage,
		SignUpPage,
		ItemMessagesPage,
		SettingsPage,
		AlertItemMapPage,
		LeafletMapComponent,
		ImageSelectorComponent,
		IonSearchbarWrapperComponent,
		NormalizeDistancePipe
	],
	imports: [
		IonicModule.forRoot(MyApp),
		MomentModule,
		HttpModule,
		TranslateModule.forRoot({
			provide: TranslateLoader,
			useFactory: translateLoaderFactory,
			deps: [Http]
		}),
		AngularFireModule.initializeApp(FirebaseConfig, {
			provider: AuthProviders.Password,
			method: AuthMethods.Password
		})
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		OfficeItemListPage,
		AlertItemListPage,
		OfficeItemDetailPage,
		AlertItemDetailPage,
		PreLaunchAlertPage,
		LaunchAlertPage,
		ImageDetailPage,
		LoginPage,
		SignUpPage,
		ItemMessagesPage,
		SettingsPage,
		AlertItemMapPage
	],
	providers: [
		Constants,
		AuthService,
		OfficeService,
		CategoryService,
		ItemService,
		ImageService,
		UserService,
		LocationService,
		MessageService,
		SettingsService
	]
})
export class AppModule {}

