import { botStateBase } from "../../../src/system/services/botStateBase";
import { AlarmUser, AlarmConversation, Alarm } from "../alamBot";
import { TurnContext } from "botbuilder";
import { ITopic } from "../../../src/system/contracts/systemContracts";
import showAlarms from "./showAlarms";
import { inject } from "inversify";


export default class deleteAlarm extends botStateBase<AlarmUser, AlarmConversation> implements ITopic {

    private _showAlarms:showAlarms;
    /**
     *
     */
    constructor(
        @inject(showAlarms)showAlarms:showAlarms
    ) {
        super();
        this._showAlarms = showAlarms;
    }

    public async begin(context: TurnContext): Promise<any> {
        const conversation = this.stateService.getConversationState(context);
        conversation.topic = undefined;

        // Render list of topics to user
        const count = await this._showAlarms.renderAlarms(context);
        if (count > 0) {
            // Set topic and prompt user for alarm to delete.
            conversation.topic = 'deleteAlarm';
            await context.sendActivity(`Which alarm would you like to delete?`);
        }
    }

    public async routeReply(context: TurnContext): Promise<any> {
        // Validate users reply and delete alarm
        let deleted = false;
        const title = context.activity.text.trim();
        const user = this.stateService.getUserState(context);
        for (let i = 0; i < user.alarms.length; i++) {
            if (user.alarms[i].title.toLowerCase() === title.toLowerCase()) {
                user.alarms.splice(i, 1);
                deleted = true;
                break;
            }
        }

        // Notify user of deletion or re-prompt
        if (deleted) {
            this.stateService.getConversationState(context).topic = undefined;
            await context.sendActivity(`Deleted the "${title}" alarm.`);
        } else {
            await context.sendActivity(`An alarm named "${title}" doesn't exist. Which alarm would you like to delete? Say "cancel" to quit.`)
        }
    }



}