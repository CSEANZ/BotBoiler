import * as BotBoiler from '../../../src/botboiler';
import { AlarmUser, AlarmConversation, Alarm } from "../alarmBot";


@BotBoiler.injectable()
export default class showAlarms
    extends BotBoiler.BotBase<AlarmUser, AlarmConversation>
    implements BotBoiler.Contracts.ITopic {

    id: string = 'showAlarms';

    public async begin(context: BotBoiler.BotBuilder.TurnContext): Promise<any> {
        // Delete any existing topic
        this.stateService.getConversationState(context).topic = undefined;

        // Render alarms to user.
        // - No reply is expected so we don't set a new topic.
        await this.renderAlarms(context);
    }

    public async renderAlarms(context: BotBoiler.BotBuilder.TurnContext): Promise<number> {
        // Get user state w/alarm list
        const user = this.stateService.getUserState(context);

        // Build message
        let msg = `No alarms found.`;
        if (user.alarms.length > 0) {
            msg = `**Current Alarms**\n\n`;
            let connector = '';
            user.alarms.forEach((alarm) => {
                msg += connector + `- ${alarm.title} (${alarm.time})`;
                connector = '\n';
            });
        }

        // Send message to user and return alarm count
        await context.sendActivity(msg);
        return user.alarms.length;
    }
    public async routeReply(context: BotBoiler.BotBuilder.TurnContext): Promise<any> {

    }

}