import ApprovalsReadLink from './ApprovalsReadLink';
import ApprovalsQueryOptions from './ApprovalsQueryOptions';
import libCommon from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import { WCMSystemStatuses } from '../SafetyCertificates/SafetyCertificatesLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export const WCMTypeAbbrev = Object.freeze({
    WCMApplication: 'WA',
    WCMDocumentHeader: 'WD',
});

export default async function PendingApprovalsTarget(context) {
    /** @type {WCMApplication | WCMDocumentHeader} */
    const binding = context.getPageProxy().binding;
    const tCertificate = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue();
    const tPermit = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue();

    const objectType = {
        [tCertificate]: WCMTypeAbbrev.WCMDocumentHeader,
        [tPermit]: WCMTypeAbbrev.WCMApplication,
    }[binding['@odata.type']];

    const canApproveRole = libCommon.getAppParam(context, 'USER_AUTHORIZATIONS', 'WCMApprovalRole') === 'Y';
    const canIssueByHeaderStatus = binding.ActualSystemStatus === WCMSystemStatuses.Prepared;
    const myUserName = libCommon.getSapUserName(context);

    return context.read('/SAPAssetManager/Services/AssetManager.service', ApprovalsReadLink(context), [], ApprovalsQueryOptions('pending'))
        .then((/** @type {WCMApprovalProcess} */ processes) => {
            if (ValidationLibrary.evalIsEmpty(processes)) {
                return [];
            }
            const lowestPendingCounter = processes.getItem(0).Counter;  // processes are sorted by Counter, and all are pending
            return Promise.all(Array.from(processes, async (/** @type {WCMApprovalProcess} */ p) => {
                // only workpermit approval issue is supported for now
                const canBeIssued = tPermit === binding['@odata.type'] && canApproveRole && canIssueByHeaderStatus && p.Counter === lowestPendingCounter && (await HasWCMObjectApproval(context, objectType, p.Permit, binding.PlanningPlant, myUserName)) || false;
                return { ...p, canBeIssued };
            }));
        });
}

async function HasWCMObjectApproval(context, objectType, permit, planningPlant, userName) {
    const filter = `$filter=ObjectType eq '${objectType}' and Permit eq '${permit}' and PlanningPlant eq '${planningPlant}' and Agent eq '${userName}'`;
    try {
        const objectApprovalsCount = await libCommon.getEntitySetCount(context, 'WCMObjectApprovals', filter);
        return !!objectApprovalsCount;
    } catch (error) {
        Logger.error(`Error while getting WCMObjectApprovals count: ${error}`);
    }
    return false;
}
