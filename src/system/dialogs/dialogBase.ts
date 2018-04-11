import "reflect-metadata";
import { injectable, inject } from "inversify";
import * as contracts from "../contracts/systemContracts";

@injectable()
export default abstract class DialogBase<TUserState, TConversationState>
    implements contracts.IDialog {

    @inject(contracts.contractSymbols.IStateService)
    public stateService: contracts.IStateService<TUserState, TConversationState>;        

    abstract id: string;   
}