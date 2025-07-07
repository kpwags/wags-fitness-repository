export const convertDateToJsonDate = (d: Date | null | undefined): string | null => {
    try {
        if (d) {
            if (typeof d === 'string') {
                return new Date(d).toISOString();
            }

            return d.toUTCString();
        }

        return null;
    } catch {
        return null;
    }
}