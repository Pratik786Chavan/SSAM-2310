import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import {GlobalVar} from '../../Common/Library/GlobalCommon';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';

export default function MyWorkSectionFilterQuery(context, filterPrefix = '$filter=') {
    const PARENT_FUNCTION_TYPE = 'VW';
    const DEFAULT_PERSONAL_NUMBER = '00000000';
    const STARTED = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue();
    const COMPLETED = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue();

    let personnelNum = CommonLibrary.getPersonnelNumber();
    let filter;

    return getLocallyCompletedObjectsQuery(context).then((locallyCompletedObjectsQuery) => {
        if (IsOperationLevelAssigmentType(context)) {
            if (!personnelNum) {
                personnelNum = DEFAULT_PERSONAL_NUMBER;
            }
            filter = `(PersonNum eq '${personnelNum}' or OperationMobileStatus_Nav/MobileStatus eq '${STARTED}')`;

            if (locallyCompletedObjectsQuery) {
                filter += ` and (OperationMobileStatus_Nav/MobileStatus ne '${COMPLETED}' or ${locallyCompletedObjectsQuery})`;
            } else {
                filter += ` and OperationMobileStatus_Nav/MobileStatus ne '${COMPLETED}'`;
            }
        }  else if (IsSubOperationLevelAssigmentType(context)) {
            if (!personnelNum) {
                personnelNum = DEFAULT_PERSONAL_NUMBER;
            }
            filter = `(PersonNum eq '${personnelNum}' or SubOpMobileStatus_Nav/MobileStatus eq '${STARTED}')`;
            if (locallyCompletedObjectsQuery) {
                filter += ` and (SubOpMobileStatus_Nav/MobileStatus ne '${COMPLETED}' or ${locallyCompletedObjectsQuery})`;
            } else {
                filter += ` and SubOpMobileStatus_Nav/MobileStatus ne '${COMPLETED}'`;
            }
        } else {
            if (!personnelNum) {
                filter = `((not sap.entityexists(WOPartners) or WOPartners/all(w: w/PartnerFunction ne '${PARENT_FUNCTION_TYPE}')) or OrderMobileStatus_Nav/MobileStatus eq '${STARTED}' or MarkedJob/PreferenceValue eq 'true')`;
            } else {
                filter = `((WOPartners/any(wp : wp/PartnerFunction eq '${PARENT_FUNCTION_TYPE}' and wp/PersonnelNum eq '${personnelNum}')) or OrderMobileStatus_Nav/MobileStatus eq '${STARTED}' or MarkedJob/PreferenceValue eq 'true')`;
            }

            if (locallyCompletedObjectsQuery) {
                filter += ` and (OrderMobileStatus_Nav/MobileStatus ne '${COMPLETED}' or ${locallyCompletedObjectsQuery})`;
            } else {
                filter += ` and OrderMobileStatus_Nav/MobileStatus ne '${COMPLETED}'`;
            }
        }

        return filterPrefix + filter;
    });
}

function getLocallyCompletedObjectsQuery(context) {
    const completed = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue();
    let mobileStatusObjectType;
    if (IsOperationLevelAssigmentType(context)) {
        mobileStatusObjectType = GlobalVar.getAppParam().OBJECTTYPE.Operation;
    } else if (IsSubOperationLevelAssigmentType(context)) {
        mobileStatusObjectType = GlobalVar.getAppParam().OBJECTTYPE.SubOperation;
    } else {
        mobileStatusObjectType = GlobalVar.getAppParam().OBJECTTYPE.WorkOrder;
    }

    let query = `$filter=sap.islocal() and MobileStatus eq '${completed}' and ObjectType eq '${mobileStatusObjectType}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'PMMobileStatuses', ['ObjectKey'], query)
        .then(result => {
            if (result && result.length) {
                return result.map(object => `ObjectKey eq '${object.ObjectKey}'`).join(' or ');
            }

            return '';
        })
        .catch(error => {
            Logger.error('getLocallyCompletedObjectsQuery', error);
            return '';
        });
}
