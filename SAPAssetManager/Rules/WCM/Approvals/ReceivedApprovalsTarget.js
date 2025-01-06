import ApprovalsReadLink from './ApprovalsReadLink';
import ApprovalsQueryOptions from './ApprovalsQueryOptions';

export default function ReceivedApprovalsTarget(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', ApprovalsReadLink(context), [], ApprovalsQueryOptions('received'));
}
