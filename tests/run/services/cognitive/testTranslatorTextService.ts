import test, { TestContext } from 'ava';
import * as sinon from 'sinon';
import { testBase } from './../../../testBase';

import luisDialog from "../../../../src/dialogs/samples/luisDIalog";
import * as contracts from "../../../../src/system/contract/contracts";


class testTranslatorTextService extends testBase {

    private _translatorTextService: contracts.ITranslatorTextService;

    constructor() {
        super();
        this._translatorTextService = this.resolve<contracts.ITranslatorTextService>(contracts.contractSymbols.ITranslatorTextService);

    }



    async _translatorTextService_should_detect_correct_language(t: TestContext) {

        //arrange
        t.not(undefined, this._translatorTextService);
        let text = "Este es un texto en español"; //this is a text in spanish
        this._startup.config.translatorTextAPIKey="{api key}";
        this._startup.config.translatorTextAPIUrl="https://api.microsofttranslator.com/V2/Http.svc";

       
        //act
        var result = await this._translatorTextService.Detect(text);
      

        //assert
        t.not(undefined, result);
        t.is( result,"es");


    }
    async _translatorTextService_should_translate_text_to_another_language(t: TestContext) {

        //arrange
        t.not(undefined, this._translatorTextService);
        let text = "Este es un texto en español"; //this is a text in spanish
        this._startup.config.translatorTextAPIKey="{api key}";
        this._startup.config.translatorTextAPIUrl="https://api.microsofttranslator.com/V2/Http.svc";

       
        //act
        var result = await this._translatorTextService.Translate(text,"en");
        
        //assert
        t.is(result.toLocaleLowerCase(), "this is a text in spanish");
        
    }
   
}

var testClass = new testTranslatorTextService();

test(testClass._translatorTextService_should_detect_correct_language.bind(testClass));
test(testClass._translatorTextService_should_translate_text_to_another_language.bind(testClass));

