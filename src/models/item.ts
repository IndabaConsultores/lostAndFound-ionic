export class Item {
	$key: string;
	createDate: Date;
	modifiedDate: Date;
	createdBy: string;
	office: number;
	name: string;
	description: string;
	location: {latitude: number, longitude: number};
	category: any;
	images: any;
	messages: any;
	type: string;
}

