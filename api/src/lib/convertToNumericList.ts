const convertToNumericList = (arr: any[]): number[] => {
    const convertedArray: number[] = [];

    for (let i = 0; i < arr.length; i += 1) {
        const val = parseInt(arr[i]);

        if (!Number.isNaN(val)) {
            convertedArray.push(val);
        }
    }

    return convertedArray;
};

export default convertToNumericList;