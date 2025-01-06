import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import UserFeaturesLibrary from '../../UserFeatures/UserFeaturesLibrary';
import MyWorkSectionFilterQuery from './MyWorkSectionFilterQuery';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import ClockInClockOutLibrary from '../../ClockInClockOut/ClockInClockOutLibrary';

//My Work Section Query Option
export default function MyWorkSectionQueryOption(context) {
    const started = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue();
    const received = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue();
    const hold = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue();
    const review = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue();
    let orderBy;
    let expand;
    let top = '$top=50';
    let entitySet;
    let startArray = [];
    let holdArray = [];
    let receivedArray = [];
    let array = [];

    return prepareDataForMyWorkSection(context).then(() => {
        return MyWorkSectionFilterQuery(context, '$filter=').then(filter => {
            if (IsOperationLevelAssigmentType(context)) {
                //My Operation Query
                orderBy = '$orderby=OperationMobileStatus_Nav/MobileStatus desc,PersonNum,WOHeader/DueDate';
                expand = '$expand=Confirmations,OperationMobileStatus_Nav,OperationMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,OperationLongText,WOHeader,UserTimeEntry_Nav,WOHeader/WOPriority,EquipmentOperation,EquipmentOperation/Location_Nav,FunctionalLocationOperation,FunctionalLocationOperation/Location_Nav,Tools,WOOprDocuments_Nav';
                entitySet = 'MyWorkOrderOperations';
                if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                    expand += ',WOHeader/OrderISULinks,WOHeader/DisconnectActivity_Nav';
                }
            } else if (IsSubOperationLevelAssigmentType(context)) {
                //My SubOperation Query
                orderBy = '$orderby=SubOpMobileStatus_Nav/MobileStatus desc,PersonNum,WorkOrderOperation/WOHeader/DueDate';
                expand = '$expand=Confirmations,SubOpMobileStatus_Nav,SubOpMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,SubOperationLongText,WorkOrderOperation,WorkOrderOperation/WOHeader,UserTimeEntry_Nav,WorkOrderOperation/WOHeader/WOPriority,EquipmentSubOperation,EquipmentSubOperation/Location_Nav,FunctionalLocationSubOperation,FunctionalLocationSubOperation/Location_Nav';
                entitySet = 'MyWorkOrderSubOperations';
                if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                    expand += ',WorkOrderOperation/WOHeader/OrderISULinks,WorkOrderOperation/WOHeader/DisconnectActivity_Nav';
                }
            } else {
                //My Work Order Query
                orderBy = '$orderby=OrderMobileStatus_Nav/MobileStatus desc,WOPartners/PersonnelNum,DueDate,Priority,MarkedJob/PreferenceValue';
                expand = '$expand=Confirmations,Equipment,Equipment/Location_Nav,FunctionalLocation,FunctionalLocation/Location_Nav,WOPriority,Components,OrderMobileStatus_Nav,OrderMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,MarkedJob,HeaderLongText,WOPartners';
                entitySet = 'MyWorkOrderHeaders';
                if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                    expand += ',OrderISULinks,DisconnectActivity_Nav';
                }
            }
            filter = filter + '&' + orderBy + '&' + expand + '&' + top;
            return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], filter).then(result => {
                if (result) {
                    switch (entitySet) {
                        case 'MyWorkOrderOperations':
                            for (let x = 0; x < result.length; x++) {
                                if (result.getItem(x).OperationMobileStatus_Nav.MobileStatus === started.toUpperCase()) {
                                    startArray.push(result.getItem(x));
                                } else if (result.getItem(x).OperationMobileStatus_Nav.MobileStatus === received.toUpperCase()) {
                                    receivedArray.push(result.getItem(x));
                                } else if (result.getItem(x).OperationMobileStatus_Nav.MobileStatus === hold.toUpperCase() || result.getItem(x).OperationMobileStatus_Nav.MobileStatus === review.toUpperCase()) {
                                    holdArray.push(result.getItem(x));
                                }
                            }
                            array = startArray.concat(holdArray, receivedArray);
                            break;
                        case 'MyWorkOrderSubOperations':
                            for (let x = 0; x < result.length; x++) {
                                if (result.getItem(x).SubOpMobileStatus_Nav.MobileStatus === started.toUpperCase()) {
                                    startArray.push(result.getItem(x));
                                } else if (result.getItem(x).SubOpMobileStatus_Nav.MobileStatus === received.toUpperCase()) {
                                    receivedArray.push(result.getItem(x));
                                } else if (result.getItem(x).SubOpMobileStatus_Nav.MobileStatus === hold.toUpperCase() || result.getItem(x).SubOpMobileStatus_Nav.MobileStatus === review.toUpperCase()) {
                                    holdArray.push(result.getItem(x));
                                }
                            }
                            array = startArray.concat(holdArray, receivedArray);
                            break;
                        case 'MyWorkOrderHeaders':
                            for (let x = 0; x < result.length; x++) {
                                if (result.getItem(x).OrderMobileStatus_Nav.MobileStatus === started.toUpperCase()) {
                                    startArray.push(result.getItem(x));
                                } else if (result.getItem(x).OrderMobileStatus_Nav.MobileStatus === received.toUpperCase()) {
                                    receivedArray.push(result.getItem(x));
                                } else if (result.getItem(x).OrderMobileStatus_Nav.MobileStatus === hold.toUpperCase() || result.getItem(x).OrderMobileStatus_Nav.MobileStatus === review.toUpperCase()) {
                                    holdArray.push(result.getItem(x));
                                }
                            }
                            array = startArray.concat(holdArray, receivedArray);
                            break;
                        default:
                            break;
                    }
                }
                return array;
            });
        });
    });
}

function prepareDataForMyWorkSection(context) {
    CommonLibrary.setStateVariable(context, 'UserRoleType', 'T');
    CommonLibrary.setStateVariable(context, 'StartedCount', 0);

    const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    let isUserSupervisorPromise = SupervisorLibrary.isUserSupervisor(context);
    let startedCountPromise;

    let userId = CommonLibrary.getSapUserName(context);
    let isCICOEnabled = ClockInClockOutLibrary.isCICOEnabled(context);
    let queryOption;
    if (IsOperationLevelAssigmentType(context)) {
        queryOption = `$filter=OperationMobileStatus_Nav/MobileStatus eq '${STARTED}'`;
        if (isCICOEnabled) {
            queryOption += " and OperationMobileStatus_Nav/CreateUserId eq '" + userId + "'"; //Only find operations that we started
        }
        startedCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', queryOption);
    } else if (IsSubOperationLevelAssigmentType(context)) {
        queryOption = `$filter=SubOpMobileStatus_Nav/MobileStatus eq '${STARTED}'`;
        if (isCICOEnabled) {
            queryOption += " and SubOpMobileStatus_Nav/CreateUserId eq '" + userId + "'"; //Only find sub-operations that we started
        }
        startedCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', queryOption);
    } else {
        queryOption = `$expand=OrderMobileStatus_Nav&$filter=OrderMobileStatus_Nav/MobileStatus eq '${STARTED}'`;
        if (isCICOEnabled) {
            queryOption += " and OrderMobileStatus_Nav/CreateUserId eq '" + userId + "'"; //Only find work orders that we started
        }
        startedCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', queryOption);
    }

    return Promise.all([isUserSupervisorPromise, startedCountPromise])
        .then((results) => {
            let roletype = results[0] ? 'S' : 'T';
            CommonLibrary.setStateVariable(context, 'UserRoleType', roletype);
            CommonLibrary.setStateVariable(context, 'StartedCount', results[1]);
            return Promise.resolve();
        })
        .catch((error) => {
            Logger.error('prepareDataForMyWorkSection', error);
            return Promise.resolve();
        });
}
