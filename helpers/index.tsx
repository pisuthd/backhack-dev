export const slugify = (text: string) => {
    return text
        .toString()
        .normalize('NFD')                   // split an accented letter in the base letter and the acent
        .replace(/[\u0300-\u036f]/g, '')   // remove all previously split accents
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};


export const shortText = (address: string, first: number = 6, last: number = -4) => {
    return `${address.slice(0, first)}...${address.slice(last)}`
}


export const secondsToHHMMSS = (totalSeconds: number) => {
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    let strHours: string = `${hours}`
    let strMinutes: string = `${minutes}`
    let strSeconds: string = `${seconds}`

    // Padding the values to ensure they are two digits
    if (hours < 10) { strHours = "0" + hours; }
    if (minutes < 10) { strMinutes = "0" + minutes; }
    if (seconds < 10) { strSeconds = "0" + seconds; }

    return {
        hours: strHours,
        minutes: strMinutes,
        seconds: strSeconds
    }
}

export const secondsToDDHHMMSS = (totalSeconds: number) => {

    var days = Math.floor(totalSeconds / 24 / 60 / 60);
    var hoursLeft = Math.floor((totalSeconds) - (days * 86400));
    var hours = Math.floor(hoursLeft / 3600);
    var minutesLeft = Math.floor((hoursLeft) - (hours * 3600));
    var minutes = Math.floor(minutesLeft / 60);
    var seconds = totalSeconds % 60;

    let strDays: string = `${days}`
    let strHours: string = `${hours}`
    let strMinutes: string = `${minutes}`
    let strSeconds: string = `${seconds}`

    // Padding the values to ensure they are two digits
    if (hours < 10) { strHours = "0" + hours; }
    if (minutes < 10) { strMinutes = "0" + minutes; }
    if (seconds < 10) { strSeconds = "0" + seconds; }

    return {
        days: strDays,
        hours: strHours,
        minutes: strMinutes,
        seconds: strSeconds
    }
}