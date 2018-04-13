import * as BotBoiler from '../../../src/botboiler';
import { AlarmUser, AlarmConversation, Alarm } from "../alarmBot";





export default class addAlarm extends 
    BotBoiler.BotBase<AlarmUser, AlarmConversation> 
    implements BotBoiler.Contracts.ITopic{
       
    id: string = 'addAlarm';
    trigger:RegExp = /add alarm/gi;

    

    private _alarmDialog:BotBoiler.Contracts.IDialog;
    /**
     *
     */
    constructor(
            @BotBoiler.inject("dialogs") @BotBoiler.named("alarmDialog") 
            alarmDialog:BotBoiler.Contracts.IDialog) {
        super();
     
        this._alarmDialog = alarmDialog;
    }

    @BotBoiler.Decorators.Topic
    public async begin(context: BotBoiler.BotBuilder.TurnContext): Promise<boolean> {
        // Set topic and initialize empty alarm
        const conversation = this.stateService.getConversationState(context);
        conversation.topic = 'addAlarm';
        conversation.alarm = {};
        
        // Prompt for first field
        return await this.nextField(context);
    }
    
    @BotBoiler.Decorators.Topic
    public async routeReply(context: BotBoiler.BotBuilder.TurnContext): Promise<boolean> {
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
        return await this.nextField(context);
    }

    async nextField(context: BotBoiler.BotBuilder.TurnContext): Promise<boolean> {
        // Prompt user for next missing field
        const conversation = this.stateService.getConversationState(context);
        const alarm = conversation.alarm;
        if (alarm.title === undefined) {
            //conversation.prompt = 'title';
            //await context.sendActivity(`What would you like to call your alarm?`);
            await this.Bot.RunDialog(this._alarmDialog, context);        
        } else {
            // Alarm completed so set alarm.
            const user = this.stateService.getUserState(context);
            if (!user.alarms) { user.alarms = [] }
            user.alarms.push(alarm as Alarm);
    
            // TODO: set alarm
    
            conversation.prompt = undefined;
            await context.sendActivity(`Your alarm named "${alarm.title}" is set for "${alarm.time}".`);
            return false;
        }

        return true;
    }

}