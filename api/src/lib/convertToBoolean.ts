export const convertToBoolean = (val: boolean | number | null | undefined): boolean => {
    if (val) {
        if (typeof val === 'boolean') {
            return val;
        }

        if (typeof val === 'number') {
            return val === 1;
        }
    }

    return false;
}