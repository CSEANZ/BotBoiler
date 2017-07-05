import startup from '../src/startup';

export class testBase{
    
    protected _startup:startup;

    constructor() {
        this._startup = new startup();        
    }

    public resolve<T>(symbol:symbol){
        return this._startup.container.get<T>(symbol);
    }
    public resolveDialog<T>(dialog:string){
        return this._startup.container.getNamed<T>("dialog", dialog);
    }
}