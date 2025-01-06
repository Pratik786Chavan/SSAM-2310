import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import libPersona from '../../Persona/PersonaLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ObjectCardSecondaryButtonTitle(context) {
    let roletype = CommonLibrary.getStateVariable(context, 'UserRoleType');
    let persona = libPersona.getActivePersona(context);
    const supervisorEnabled = libSuper.isSupervisorFeatureEnabled(context);
    const supervisor = context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Supervisor.global').getValue();
    let overallStatusSeq_Nav;
    //My Operation Secondary Button
    if (IsOperationLevelAssigmentType(context)) {
        overallStatusSeq_Nav = context.binding.OperationMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
    } else if (IsSubOperationLevelAssigmentType(context)) {
        overallStatusSeq_Nav = context.binding.SubOpMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
    } else {
    //My Work Order Secondary Button
        overallStatusSeq_Nav = context.binding.OrderMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
    }
    let titles = [];
    for (let x = 0 ; x < overallStatusSeq_Nav.length; x++) {
        if (overallStatusSeq_Nav[x].RoleType === roletype && overallStatusSeq_Nav[x].UserPersona === persona && (overallStatusSeq_Nav[x].TransitionType === 'S' || overallStatusSeq_Nav[x].TransitionType === 'N')) {
            titles.push(x);
        }
    }
    //only 1 next status
    if (titles.length === 1) {
        let toStatus = overallStatusSeq_Nav[titles[0]].NextOverallStatusCfg_Nav.TransitionTextKey ? overallStatusSeq_Nav[titles[0]].NextOverallStatusCfg_Nav.TransitionTextKey : overallStatusSeq_Nav[titles[0]].NextOverallStatusCfg_Nav.OverallStatusLabel;
        return context.localizeText(toStatus);
    }
    //more than 1 next status because of supervisor
    if (titles.length > 1) {
        for (let x = 0; x < titles.length; x++) {
            if (supervisorEnabled) {
                //Show negative over secondary
                if (overallStatusSeq_Nav[titles[x]].FeatureId === supervisor && overallStatusSeq_Nav[titles[x]].TransitionType === 'N') {
                    let toStatus = overallStatusSeq_Nav[titles[x]].NextOverallStatusCfg_Nav.TransitionTextKey ? overallStatusSeq_Nav[titles[x]].NextOverallStatusCfg_Nav.TransitionTextKey : overallStatusSeq_Nav[titles[x]].NextOverallStatusCfg_Nav.OverallStatusLabel;
                    return context.localizeText(toStatus);
                }
            }
        }
    }
    return '';
}
