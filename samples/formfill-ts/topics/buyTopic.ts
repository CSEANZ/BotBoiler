import * as BotBoiler from '../../../src/botboiler';
import * as buyBot from "../buyBot";
import { buyForm } from '../buyBot';


export default class buyTopic extends
    BotBoiler.BotBase<buyBot.BotUserState, buyBot.BotConvState>
    implements BotBoiler.Contracts.ITopic {

    id: string = 'guessTopic';
    trigger: RegExp = /buy/i;

    private _netClient: BotBoiler.Contracts.INetClient;
    private _formTemplate: buyForm[];

    constructor(
        @BotBoiler.inject(BotBoiler.Contracts.contractSymbols.INetClient)
        netClient: BotBoiler.Contracts.INetClient,
    ) {
        super();

        this._netClient = netClient;

    }

    /**
     * setup base template from state
     * 
     * @private
     * @memberof buyTopic
     */
    private async _setup() {
        this._formTemplate = this.Conversation.formTemplate;
        // this._formTemplate = [{
        //     id: 'brand',
        //     prompt: 'What type of brand are you interested in?',
        //     response: 'You chose brand %s',
        //     errorPrompt: 'Please choose a brand',
        //     choices: 'Apple|Android',
        //     type: 'choice'
        // },
        // {
        //     id: 'screenSize',
        //     prompt: 'Screen size should be no less than',
        //     response: 'Screen size no less than %d',
        //     errorPrompt: 'Please provide a numerical value',
        //     type: 'number'
        // },
        // {
        //     id: 'price',
        //     prompt: 'The phone should cost no more than',
        //     response: 'The maximum price of the phone is %d',
        //     errorPrompt: 'Please choose a numerical value',
        //     type: 'number'
        // }];
    }

    /**
     * Gets the form template from the server and preps the state
     * 
     * @param {BotBoiler.BotBuilder.TurnContext} context 
     * @returns {Promise<boolean>} 
     * @memberof buyTopic
     */
    @BotBoiler.Decorators.Topic
    public async begin(context: BotBoiler.BotBuilder.TurnContext): Promise<boolean> {

        if (!this.Conversation.formTemplate) {
            this.Conversation.formTemplate =
                await this._netClient.getJson<buyForm[]>(
                    "https://19698aa3.ngrok.io/", "/services/prompts.json");
        }


        await this._setup();

        this.Conversation.formfill = {};


        // Prompt for first field
        return await this.nextField();
    }

    /**
     * re-entry point for the topic
     * 
     * @returns {Promise<boolean>} 
     * @memberof buyTopic
     */
    @BotBoiler.Decorators.Topic
    public async routeReply(): Promise<boolean> {
        return await this.nextField();
    }


    /**
     * 
     * check each field for satisfaction 
     * @returns {Promise<boolean>} 
     * @memberof buyTopic
     */
    async nextField(): Promise<boolean> {
        await this._setup();

        var fill = this.Conversation.formfill;

        for (var i in this._formTemplate) {

            var template = this._formTemplate[i];

            var sat = await this.satisfy(fill,
                template.id,
                template.prompt,
                template.response,
                template.type,
                template.errorPrompt,
                template.choices
            )

            if (!sat) {
                return true;
            }
        }
        console.log(this.Conversation.formfill);
        return false;
    }


    /**
     * Check each field from the template is satisfied. 
     * 
     * @param {*} obj 
     * @param {string} field 
     * @param {string} prompt 
     * @param {string} response 
     * @param {string} type 
     * @param {string} error 
     * @param {string} [choices] 
     * @returns {Promise<boolean>} 
     * @memberof buyTopic
     */
    async satisfy(obj: any, field: string, prompt: string, response: string, type: string, error: string, choices?: string
    ): Promise<boolean> {

        if (!obj[field]) {

            if (this.Conversation._conversationFlow !== "asking") {
                this.Conversation._conversationFlow = "asking";

                await this.Context.sendActivity(prompt);
                return false;
            } else {

                switch (type) {
                    case "number":
                        if (isNaN(Number.parseFloat(this.Context.activity.text))) {
                            await this.Context.sendActivity(error);
                            return false;
                        }

                        break;
                    case "choice":
                        console.log(type);
                        if (choices &&
                            choices.toLowerCase().indexOf(this.Context.activity.text.toLowerCase()) == -1) {
                            await this.Context.sendActivity(error);
                            return false;
                        }
                        break;
                    default:

                        break;
                }
                
                await this.Context.sendActivity(response + " " + this.Context.activity.text);
                obj[field] = this.Context.activity.text

                this.Conversation.formfill = obj;
                this.Conversation._conversationFlow = "";
            }
        }

        return true;
    }

}