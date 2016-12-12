import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'normalizeDistance'})
export class NormalizeDistancePipe implements PipeTransform {
	transform(value: number): string {
		let unit: string = 'm';
		if (value >= 1000) {
			unit = 'km';
			value = Math.floor(value/10)/100;
		} else if (value < 1) {
			unit = 'cm';
			value = value*100;
		}

		let distance: string = [value, unit].join('');
		return distance;
	}
}

