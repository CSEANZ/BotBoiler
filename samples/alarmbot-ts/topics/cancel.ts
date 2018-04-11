import * as BotBoiler from '../../../src/botboiler';
import { AlarmUser, AlarmConversation, Alarm } from "../alarmBot";



export default class cancel
    extends BotBoiler.BotStateBase<AlarmUser, AlarmConversation>
    implements BotBoiler.Contracts.ITopic {

    id: string = 'cancel';

    public async begin(context: BotBoiler.BotBuilder.TurnContext): Promise<any> {
        const conversation = this.stateService.getConversationState(context);
        if (conversation.topic) {
            conversation.topic = undefined;
            await context.sendActivity(`Ok... Canceled.`);
        } else {
            await context.sendActivity(`Nothing to cancel.`);
        }
    }

    public async routeReply(context: BotBoiler.BotBuilder.TurnContext): Promise<any> {

    }
}