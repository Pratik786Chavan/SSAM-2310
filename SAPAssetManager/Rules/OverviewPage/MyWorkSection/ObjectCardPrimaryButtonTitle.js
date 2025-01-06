import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import libPersona from '../../Persona/PersonaLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';

export default function ObjectCardPrimaryButtonTitle(context) {
    let roletype = libCom.getStateVariable(context, 'UserRoleType');
    let persona = libPersona.getActivePersona(context);
    const cicoEnabled = libClock.isCICOEnabled(context);
    const supervisorEnabled = libSuper.isSupervisorFeatureEnabled(context);
    const supervisor = context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Supervisor.global').getValue();
    const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const REVIEW = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const COMPLETE = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    let overallStatusSeq_Nav;
    //My Operation Primary Button
    if (IsOperationLevelAssigmentType(context)) {
        overallStatusSeq_Nav = context.binding.OperationMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
    } else if (IsSubOperationLevelAssigmentType(context)) {
        overallStatusSeq_Nav = context.binding.SubOpMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
    } else {
    //My Work Order Primary Button
        overallStatusSeq_Nav = context.binding.OrderMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
    }
    let titles = [];
    for (let x = 0 ; x < overallStatusSeq_Nav.length; x++) {
        if (overallStatusSeq_Nav[x].RoleType === roletype && overallStatusSeq_Nav[x].UserPersona === persona && overallStatusSeq_Nav[x].TransitionType === 'P') {
            titles.push(x);
        }
    }
    //only 1 next status
    if (titles.length === 1) {
        let toStatus = overallStatusSeq_Nav[titles[0]].NextOverallStatusCfg_Nav.TransitionTextKey ? overallStatusSeq_Nav[titles[0]].NextOverallStatusCfg_Nav.TransitionTextKey : overallStatusSeq_Nav[titles[0]].NextOverallStatusCfg_Nav.OverallStatusLabel;
        if (overallStatusSeq_Nav[titles[0]].NextOverallStatusCfg_Nav.MobileStatus === STARTED && cicoEnabled) {
            return context.localizeText('clock_in');
        }
        return context.localizeText(toStatus);
    }
    //more than 1 next status because of supervisor
    if (titles.length > 1) {
        for (let x = 0; x < titles.length; x++) {
            if (supervisorEnabled) {
                if (overallStatusSeq_Nav[titles[x]].FeatureId === supervisor) {
                    let toStatus = overallStatusSeq_Nav[titles[x]].NextOverallStatusCfg_Nav.TransitionTextKey ? overallStatusSeq_Nav[titles[x]].NextOverallStatusCfg_Nav.TransitionTextKey : overallStatusSeq_Nav[titles[x]].NextOverallStatusCfg_Nav.OverallStatusLabel;
                    if (overallStatusSeq_Nav[titles[x]].NextOverallStatusCfg_Nav.MobileStatus === STARTED && cicoEnabled) {
                        return context.localizeText('clock_in');
                    }
                    if (overallStatusSeq_Nav[titles[x]].NextOverallStatusCfg_Nav.MobileStatus === REVIEW || overallStatusSeq_Nav[titles[x]].NextOverallStatusCfg_Nav.MobileStatus === COMPLETE) {
                        return libSuper.checkReviewRequired(context, context.binding).then(result => {
                            if (result) {
                                return context.localizeText('review_text');
                            } else {
                                return context.localizeText('complete');
                            }
                        });
                    }
                    return context.localizeText(toStatus);
                }
            } else {
                //Supervisor is not enabled
                if (overallStatusSeq_Nav[titles[x]].FeatureId !== supervisor) {
                    let toStatus = overallStatusSeq_Nav[titles[x]].NextOverallStatusCfg_Nav.TransitionTextKey ? overallStatusSeq_Nav[titles[x]].NextOverallStatusCfg_Nav.TransitionTextKey : overallStatusSeq_Nav[titles[x]].NextOverallStatusCfg_Nav.OverallStatusLabel;
                    if (overallStatusSeq_Nav[titles[x]].NextOverallStatusCfg_Nav.MobileStatus === STARTED && cicoEnabled) {
                        return context.localizeText('clock_in');
                    }
                    return context.localizeText(toStatus);
                }
            }
        }
    }
    return '';
}
