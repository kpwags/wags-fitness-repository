type Run = {
    runId: number;
    dateRan: Date;
    temperature: number;
    hours: number;
    minutes: number;
    seconds: number;
    runTime?: string;
    distance: number;
    pace?: string;
    elevation: number;
    heartRate: number;
    shoeId: number | null;
    shoeName?: string | null;
}

export { Run };
