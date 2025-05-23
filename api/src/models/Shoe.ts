type Shoe = {
    shoeId: number;
    name: string;
    datePurchased: Date | string | null;
    isRetired: boolean;
    distance?: number;
    runCount?: number;
    dateFirstRun?: Date | string | null;
    dateLastRun?: Date | string | null;
    lifespan?: number;
}

export default Shoe;
