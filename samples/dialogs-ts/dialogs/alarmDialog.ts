import * as BotBoiler from '../../../src/botboiler';
import * as AlarmBot from '../alarmBot';
import * as moment from 'moment';


@BotBoiler.injectable()

export default class alarmDialog 
    extends BotBoiler.DialogBase<AlarmBot.AlarmUser, AlarmBot.AlarmConversation>{
    
    public id: string = "alarmDialog";   
    public trigger: RegExp =  /jordan/gi;

   
    public get waterfall(): BotBoiler.Contracts.IDialogWaterfallStep[]{
        return [this.step1.bind(this), this.step2.bind(this)];
    }
    
    /**
     * Add alarm starter
     * 
     * @param {BotBoiler.BotBuilder.DialogContext<BotBoiler.BotBuilder.TurnContext>} dc 
     * @memberof simpleDialog
     */
    public async step1(dc:BotBoiler.BotBuilder.DialogContext<BotBoiler.BotBuilder.TurnContext>){
        dc.instance.state = {} as AlarmBot.Alarm;
        await dc.prompt('titlePrompt', `What would you like to call your alarm?`);
    }


    /**
     * 
     * 
     * @param {BotBoiler.BotBuilder.DialogContext<BotBoiler.BotBuilder.TurnContext>} dc 
     * @param {*} args 
     * @memberof simpleDialog
     */
    public async step2(dc:BotBoiler.BotBuilder.DialogContext<BotBoiler.BotBuilder.TurnContext>, args:any){
         // Save alarm title and prompt for time
         const alarm = dc.instance.state as AlarmBot.Alarm;
         alarm.title = args;
         await dc.prompt('timePrompt', `What time would you like to set the "${alarm.title}" alarm for?`);
    }

    public async step3(dc:BotBoiler.BotBuilder.DialogContext<BotBoiler.BotBuilder.TurnContext>, args:any){
        // Save alarm time
        const alarm = dc.instance.state as AlarmBot.Alarm;
        alarm.time = args.toISOString();

        // Alarm completed so set alarm.
        const user = this.stateService.getUserState(dc.context);
        user.alarms.push(alarm);
        
        // Confirm to user
        await dc.context.sendActivity(`Your alarm named "${alarm.title}" is set for "${moment(alarm.time).format("ddd, MMM Do, h:mm a")}".`);
        await dc.end();
    }


}