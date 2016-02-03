angular.module('lf')

	.config(function($translateProvider) {

			$translateProvider.translations('eu', {
		        found_items: "Aurkitutakoak",
		        alerts: "Alertak",
		        launch_alert: "Alerta Berria",
		        info: "Informazioa",
		        settings: "Ezarpenak",
		        logout: "Irten",
		        login: "Login",
		        get_alerts: "Alertak Jaso",
		        back: "Itzuli",
		        item_name: "Izena",
		        item_description: "Deskribapena",
		        picture: "Irudia",
		        camera: "Kamera",
		        use_picture: "Erabili Irudia",
		        comments: "Iruzkin",
		        comment: "Iruzkinak",
		        messages: "Iruzkinak",
		        share: "Elkarbanatu",
		        language: "Hizkuntza",
		        username: "Erabiltzailea",
		        password: "Pasahitza",
		        email: "Emaila",
		        create_account: "Kontua Sortu",
		        cancel: "Utzi",
		        choose_from_camera_or_gallery: "Kamaratik edo argazki galeriatik aukeratu",
		        sign_up: "Alta eman"
		    });
    		
	});