import ODataDate from '../../Common/Date/ODataDate';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';

/** @param {IClientAPI} context  */
export default function IssueApproval(context) {
    /** @type {WCMApprovalProcess & { canBeIssued: boolean, issueCreateProperties: { WCMDocument: string, ObjectNumber:string, Permit: string }}} */
    const binding = context.binding;

    return context.executeAction('/SAPAssetManager/Actions/WCM/Approvals/ConfirmIssue.action')
        .then((/** @type {{data: boolean, enabled: boolean, error: any, status: number}} */ result) => result.data)
        .then(isOk => {
            if (!isOk) {
                throw new Error('IssueApproval confirm page cancelled');
            }
            context.showActivityIndicator();
        })
        .then(() => issueWCMApproval(context, binding))
        .then(() => createApprovalProcessSegment(context, binding))
        .then(() => UpdateTrafficLightStatus(context, binding))
        .then(() => context.executeAction({
            'Name': '/SAPAssetManager/Actions/Page/ClosePage.action',
            'Properties': {
                'DismissModal': false,
            },
        }))
        .then(() => context.executeAction({
            'Name': '/SAPAssetManager/Actions/WCM/OperationalItems/SetTagged/ItemsSubmittedToast.action',
            'Properties': {
                'Message': context.localizeText('item_issued_success_message'),
            },
        }))
        .catch((error) => {
            Logger.error('IssueApproval', error);
        })
        .finally(() => {
            context.dismissActivityIndicator();
        });
}

/** @param {WCMApprovalProcess} wcmApprovalProcess  */
function issueWCMApproval(context, wcmApprovalProcess) { // backend needs this PUT request to issue the approval, then regen the corresponding ProcessSegment
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action',
        'Properties': {
            'Target':
            {
                'EntitySet': 'WCMApprovalProcesses',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink': wcmApprovalProcess['@odata.readLink'],
            },
            'Properties': {
                'ChangedOn': new ODataDate().toDBDateTimeString(context),
            },
            'RequestOptions': {
                'UpdateMode': 'Replace',
            },
        },
    });
}

/** @param {WCMApprovalProcess} wcmApprovalProcess  */
function createApprovalProcessSegment(context, wcmApprovalProcess) {  // need to create something tangible locally to be able to determine if the process is approved or not (after sync the backend generated segment will replace this)
    const now = new ODataDate();
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action',
        'Properties': {
            'Target':
            {
                'EntitySet': 'WCMApprovalProcessSegments',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            'Properties': {
                'ObjectNumber': wcmApprovalProcess.ObjectNumber,
                'Counter': wcmApprovalProcess.Counter,
                'SegmentCounter': '999999',
                'SegmentInactive': '',
                'CreatedOn': now.toLocalDateString(),
                'EnteredAt': now.toLocalTimeString(),
                'EnteredBy': CommonLibrary.getSapUserName(context),
            },
            'RequestOptions': {
                'RemoveCreatedEntityAfterUpload': true,
            },
            'CreateLinks': [
                {
                    'Property': 'WCMApprovalProceses',
                    'Target': {
                        'EntitySet': 'WCMApprovalProcesses',
                        'ReadLink': wcmApprovalProcess['@odata.readLink'],
                    },
                },
            ],
        },
    });
}

/** @param {WCMApprovalProcess} wcmApprovalProcess  */
function UpdateTrafficLightStatus(context, wcmApprovalProcess) {  // after sync, banckend will ignore this and re-set the trafficLight value (which should be equivalent with the updated/ignored one)
    const headerNavProperty = (wcmApprovalProcess.WCMApplication && 'WCMApplications') || (wcmApprovalProcess.WCMDocument && 'WCMDocumentHeaders') || undefined;
    if (!headerNavProperty) {
        return undefined;
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${wcmApprovalProcess['@odata.readLink']}/${headerNavProperty}`, [], '$expand=WCMApprovalProcesses/WCMApprovalProcessSegments')
        .then((/** @type {ObservableArray<WCMApplication | WCMDocumentHeader>} */ result) => {
            if (ValidationLibrary.evalIsEmpty(result)) {
                return undefined;
            }
            const headerObject = result.getItem(0);
            const newTrafficLightStatus = GetTrafficLightStatus(headerObject.WCMApprovalProcesses, context);
            if (newTrafficLightStatus === headerObject.TrafficLight) {  // no update necessary
                return undefined;
            }
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action',
                'Properties': {
                    'Target': {
                        'EntitySet': headerNavProperty,  // WCMApplications or WCMDocumentHeaders
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': headerObject['@odata.readLink'],
                    },
                    'Properties': {
                        'TrafficLight': newTrafficLightStatus,
                    },
                    'RequestOptions': {
                        'UpdateMode': 'Merge',
                    },
                },
            });
        });
}

/** @param {WCMApprovalProcess[]} wcmApprovalProcess  */
function GetTrafficLightStatus(wcmApprovalProcesses, context) {
    const notApprovedProcesses = wcmApprovalProcesses.filter(p => (p.WCMApprovalProcessSegments || []).every(s => s.SegmentInactive !== ''));  // if there is any, all segments are inactive -- revoked approval
    return wcmApprovalProcesses.length === notApprovedProcesses.length ?
        context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/WaitForApproval.global').getValue() :
        (notApprovedProcesses.length === 0 ?
            context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/Approved.global').getValue() :
            context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/PartiallyApproved.global').getValue());
}
