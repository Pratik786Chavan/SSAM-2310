import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import libPersona from '../../Persona/PersonaLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ObjectCardSecondaryButtonVisible(context) {
    if (!libMobile.isMobileStatusChangeAllowedForLocalObjects(context)) {
        return false;
    }

    if (libWO.isWorkOrderInCreatedState(context)) {
        return false;
    }

    let roletype = CommonLibrary.getStateVariable(context, 'UserRoleType');
    let persona = libPersona.getActivePersona(context);
    let overallStatusSeq_Nav;
    //My Operation Secondary Button
    if (IsOperationLevelAssigmentType(context)) {
        overallStatusSeq_Nav = context.binding.OperationMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
    } else if (IsSubOperationLevelAssigmentType(context)) {
    //My SubOperation Secondary Button
        overallStatusSeq_Nav = context.binding.SubOpMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
    } else {
    //My Work Order Secondary Button
        overallStatusSeq_Nav = context.binding.OrderMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
    }
    for (let x = 0 ; x < overallStatusSeq_Nav.length; x++) {
        if (overallStatusSeq_Nav[x].RoleType === roletype && overallStatusSeq_Nav[x].UserPersona === persona && (overallStatusSeq_Nav[x].TransitionType === 'S' || overallStatusSeq_Nav[x].TransitionType === 'N')) {
            return true;
        }
    }
    return false;
}
