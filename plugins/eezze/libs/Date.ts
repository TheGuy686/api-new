export default class DateMethods {
    static formatDatePattern(pattern: string, inputDate: Date | string = new Date()): string {
        let date: Date;

        // Check if the inputDate is a string and convert it to a Date object if necessary
        if (typeof inputDate === 'string') {
            date = new Date(inputDate);

            if (isNaN(date.getTime())) {
                throw new Error('Invalid date string');
            }
        }
        else if (inputDate instanceof Date) {
            date = inputDate;
        }
        else {
            throw new Error('Invalid date input');
        }

        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        // Replace the placeholders in the pattern with actual date/time components
        return pattern
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('hh', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    }

    static formatDate(inputDate: Date | string, pattern: string): string {
        let date: Date;

        // Check if the inputDate is a string and convert it to a Date object if necessary
        if (typeof inputDate === 'string') {
            date = new Date(inputDate);

            if (isNaN(date.getTime())) {
                throw new Error('Invalid date string');
            }
        }
        else if (inputDate instanceof Date) {
            date = inputDate;
        }
        else {
            throw new Error('Invalid date input');
        }

        // Define date formatting options
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long', // Use 'long' for full month name
        };

        // Format the date based on the pattern
        return date.toLocaleDateString('en-US', options);
    }
}