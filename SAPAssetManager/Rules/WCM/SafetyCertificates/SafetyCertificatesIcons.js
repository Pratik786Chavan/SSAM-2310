import AttachedDocumentIcon from '../../Documents/AttachedDocumentIcon';
import { GetApprovalStatus } from '../Common/GetApprovalStatus';
import TrafficLightStatusIcon from '../Common/TrafficLightStatusIcon';
import { GetSyncIcon, HasLocalApprovals } from '../WorkPermits/WorkPermitIcons';
import DocumentsBDSCount from '../../Documents/Count/DocumentsBDSCount';

export default function SafetyCertificatesIcons(context) {
    return Promise.all([
        GetApprovalStatus(context),
        DocumentsBDSCount(context, context.binding),
        HasLocalApprovals(context, context.binding),
    ]).then(([status, docsCount, hasLocalApprovals]) => {
        const icons = [TrafficLightStatusIcon(context, status), AttachedDocumentIcon(context, undefined, docsCount), hasLocalApprovals ? GetSyncIcon(context) : undefined];
        return icons.filter(x => x !== undefined);
    });
}
