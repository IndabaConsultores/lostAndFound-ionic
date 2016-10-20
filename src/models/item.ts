export class Item {
	$key: string;
	createDate: number;
	modifiedDate: number;
	createdBy: string;
	office: number;
	name: string;
	description: string;
	location: {latitude: number, longitude: number};
	category: any;
	images: any;
	messages: any;
}

