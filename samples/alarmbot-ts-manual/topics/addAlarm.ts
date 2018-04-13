import { botStateBase } from "../../../src/system/services/botBase";
import { AlarmUser, AlarmConversation, Alarm } from "../alamBot";
import { TurnContext } from "botbuilder";
import { ITopic } from "../../../src/system/contracts/systemContracts";


export default class addAlarm extends BotBase<AlarmUser, AlarmConversation> implements ITopic{

    public async begin(context: TurnContext): Promise<any> {
        // Set topic and initialize empty alarm
        const conversation = this.stateService.getConversationState(context);
        conversation.topic = 'addAlarm';
        conversation.alarm = {};
        
        // Prompt for first field
        await this.nextField(context);
    }

    public async routeReply(context: TurnContext): Promise<any> {
        // Handle users reply to prompt
        const conversation = this.stateService.getConversationState(context);
        const utterance = context.activity.text.trim();
        switch (conversation.prompt) {
            case 'title':
                // Validate reply and save to alarm
                if (utterance.length > 2) {
                    conversation.alarm.title = utterance;
                } else {
                    await context.sendActivity(`I'm sorry. Your alarm should have a title at least 3 characters long.`);
                }
                break;
            case 'time':
                // TODO: validate time user replied with
                conversation.alarm.time = utterance;
                break;
        }
    
        // Prompt for next field
        await this.nextField(context);
    }

    async nextField(context: TurnContext): Promise<any> {
        // Prompt user for next missing field
        const conversation = this.stateService.getConversationState(context);
        const alarm = conversation.alarm;
        if (alarm.title === undefined) {
            conversation.prompt = 'title';
            await context.sendActivity(`What would you like to call your alarm?`);
        } else if (alarm.time === undefined) {
            conversation.prompt = 'time';
            await context.sendActivity(`What time would you like to set the "${alarm.title}" alarm for?`);
        } else {
            // Alarm completed so set alarm.
            const user = this.stateService.getUserState(context);
            if (!user.alarms) { user.alarms = [] }
            user.alarms.push(alarm as Alarm);
    
            // TODO: set alarm
    
            // Notify user and cleanup topic state
            conversation.topic = undefined;
            conversation.alarm = undefined;
            conversation.prompt = undefined;
            await context.sendActivity(`Your alarm named "${alarm.title}" is set for "${alarm.time}".`);
        }
    }

}