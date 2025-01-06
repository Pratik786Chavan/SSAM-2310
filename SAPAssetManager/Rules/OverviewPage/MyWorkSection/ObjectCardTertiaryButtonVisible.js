import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import libPersona from '../../Persona/PersonaLibrary';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ObjectCardTertiaryButtonVisible(context) {
    let roletype = CommonLibrary.getStateVariable(context, 'UserRoleType');
    let persona = libPersona.getActivePersona(context);
    let overallStatusSeq_Nav;
    //My Operation Tertiary Button
    if (IsOperationLevelAssigmentType(context)) {
        overallStatusSeq_Nav = context.binding.OperationMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
    } else if (IsSubOperationLevelAssigmentType(context)) {
    //SubOperation Tertiary Button
        overallStatusSeq_Nav = context.binding.SubOpMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
    } else {
    //My Work Order Tertiary Button
        overallStatusSeq_Nav = context.binding.OrderMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
    }
    for (let x = 0 ; x < overallStatusSeq_Nav.length; x++) {
        if (overallStatusSeq_Nav[x].RoleType === roletype && overallStatusSeq_Nav[x].UserPersona === persona && overallStatusSeq_Nav[x].TransitionType === 'T') {
            return true;
        }
    }
    return false;
}
