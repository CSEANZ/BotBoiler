

export class SimpleValidator{

    /**
     * Check to see if the entry is a number
     * 
     * @static
     * @param {*} number 
     * @param {number} [min] 
     * @param {number} [max] 
     * @returns {boolean} 
     * @memberof SimpleValidator
     */
    public static Number(number:any, min?:number, max?:number):boolean{
        var numbParsed = Number.parseFloat(number);
        if (isNaN(numbParsed)) {            
            return false;
        }

        if(min && numbParsed < min){
            return false;
        }

        if(max && numbParsed > max){
            return false;
        }

        return true;
    }

    /**
     * Check to see if the entry matches the options. 
     * 
     * @static
     * @param {*} entry 
     * @param {(string[]|string)} choices 
     * Pass in | separated string or array of string. 
     * @returns {boolean} 
     * @memberof SimpleValidator
     */
    public static Choices(entry:any, choices:string[]|string):boolean{
        
        var array:string[];

        if(!Array.isArray(choices)){
            array = choices.split("|");
        }else{
            array = choices;
        }

        for(var i in array){
            var compare = array[i];            
            if(compare.toLowerCase().indexOf(entry.toLowerCase())!=-1){
                return true;
            }
        }

        return false;
    }
}