
export interface IQnAAnswer {
    answer: string;
    score: number;
}

export interface IQnaComponent{
    getAnswer(question:string):Promise<IQnAAnswer>;
}

let modelSymbols = {
    IQnaComponent: Symbol("IQnaComponent")
}

export {modelSymbols}