export class User {
	$key: number;
	alerts: boolean;
	avatar: string;
	language: string;
	username: string;
	email: string;
	password: string;

	constructor() {
		this.alerts = true;
		this.language = 'eu';
	}
}

