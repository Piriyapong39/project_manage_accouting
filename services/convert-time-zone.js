class ConvertTime {
    constructor() {}
    convertToThaiTime(utcDateString) {
        try {
            const utcDate = new Date(utcDateString);
            const bangkokTime = new Date(utcDate.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
            const year = bangkokTime.getFullYear();
            const month = String(bangkokTime.getMonth() + 1).padStart(2, '0'); 
            const day = String(bangkokTime.getDate()).padStart(2, '0');
            const hours = String(bangkokTime.getHours()).padStart(2, '0');
            const minutes = String(bangkokTime.getMinutes()).padStart(2, '0');
            const seconds = String(bangkokTime.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        } catch (error) {
            console.log(error.message);
        }
    }
}

const convertTime = new ConvertTime();
module.exports = convertTime

