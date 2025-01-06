import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import libPersona from '../../Persona/PersonaLibrary';
import Logger from '../../Log/Logger';
import libCommon from '../../Common/Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';

export default function ObjectCardPrimaryButtonVisible(context) {
    try {
        if (!libMobile.isMobileStatusChangeAllowedForLocalObjects(context)) {
            return false;
        }

        if (libWO.isWorkOrderInCreatedState(context)) {
            return false;
        }

        let roletype = libCommon.getStateVariable(context, 'UserRoleType');
        let mobileStatus;
        const STARTED = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        const REVIEW = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
        let startedCount = libCommon.getStateVariable(context, 'StartedCount');

        let persona = libPersona.getActivePersona(context);
        let overallStatusSeq_Nav;
        if (IsOperationLevelAssigmentType(context)) {
            overallStatusSeq_Nav = context.binding.OperationMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
            mobileStatus = context.binding.OperationMobileStatus_Nav.MobileStatus;
        } else if (IsSubOperationLevelAssigmentType(context)) {
            overallStatusSeq_Nav = context.binding.SubOpMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
            mobileStatus = context.binding.SubOpMobileStatus_Nav.MobileStatus;
        } else {
            overallStatusSeq_Nav = context.binding.OrderMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
            mobileStatus = context.binding.OrderMobileStatus_Nav.MobileStatus;
        }

        //Supervisor section for Pending Review non-local Orders
        if (roletype === 'T' && mobileStatus === REVIEW && !libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
            return false;
        }

        for (let x = 0 ; x < overallStatusSeq_Nav.length; x++) {
            if (overallStatusSeq_Nav[x].RoleType === roletype && overallStatusSeq_Nav[x].UserPersona === persona && overallStatusSeq_Nav[x].TransitionType === 'P') {
                if (startedCount > 0 && mobileStatus !== STARTED) {
                    return false;
                }
                return true;
            }
        }
        return false;
    } catch (error) {
        Logger.error('ObjectCardPrimaryButtonVisible', error);
        return false;
    }
}
