
import { injectable } from "inversify";
import * as builder from 'botbuilder';

import { serviceBase } from './../../system/services/serviceBase';
import * as contracts  from '../../system/contract/contracts';

export default class dynamicDialogBase extends serviceBase implements contracts.IDialog{
    id: string;
    name: string = "dataDialog";
    trigger: string | RegExp;
    
    waterfall: builder.IDialogWaterfallStep[]    
}