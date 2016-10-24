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

import { OfficeItemListPage } from '../pages/office-item-list/office-item-list';
import { OfficeItemDetailPage } from '../pages/office-item-detail/office-item-detail';
import { ImageDetailPage } from '../pages/image-detail/image-detail';
import { LeafletMapComponent } from '../pages/leaflet-map/leaflet-map';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/signup/signup';

export function translateLoaderFactory(http: Http) {
	return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    OfficeItemListPage,
		OfficeItemDetailPage,
		ImageDetailPage,
		LeafletMapComponent,
		LoginPage,
		SignUpPage
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
		OfficeItemDetailPage,
		ImageDetailPage,
		LoginPage,
		SignUpPage
  ],
  providers: [
		Constants,
		AuthService,
		OfficeService,
		CategoryService,
		ItemService,
		ImageService
	]
})
export class AppModule {}

