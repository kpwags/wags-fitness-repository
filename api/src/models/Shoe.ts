type Shoe = {
    shoeId: number;
    name: string;
    datePurchased: Date;
    isRetired: boolean;
    milesRun?: number;
    runCount?: number;
    dateFirstRun?: Date;
    dateLastRun?: Date;
    lifespan?: number;
}

export default Shoe;
