import { botStateBase } from "../../../src/system/services/botStateBase";
import { AlarmUser, AlarmConversation, Alarm } from "../alamBot";
import { TurnContext } from "botbuilder";
import { ITopic } from "../../../src/system/contracts/systemContracts";


export default class cancel extends botStateBase<AlarmUser, AlarmConversation> implements ITopic{

    public async begin(context: TurnContext): Promise<any> {
        const conversation = this.stateService.getConversationState(context);
        if (conversation.topic) {
            conversation.topic = undefined;
            await context.sendActivity(`Ok... Canceled.`);
        } else {
            await context.sendActivity(`Nothing to cancel.`);
        }
    }

    public async routeReply(context: TurnContext): Promise<any> {
       
    }
}