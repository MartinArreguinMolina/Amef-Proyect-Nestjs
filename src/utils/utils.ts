


export class Utils {

    constructor(){}

    capitalizeWords(value: string): string {

        if(value === undefined){
            return '';
        }

        const words = value.split(' ');
        const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
        return capitalizedWords.join(' ');
    }
}