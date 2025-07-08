type Bike = {
	bikeId: number;
	name: string;
	isRetired: boolean;
	distance?: number;
	runCount?: number;
	dateFirstRide?: Date | string | null;
	dateLastRide?: Date | string | null;
}

export { Bike };
