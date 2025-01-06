import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import MyWorkSectionFilterQuery from './MyWorkSectionFilterQuery';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';

export default function MyWorkSectionFooterLabel(context) {
    return CountMyWork(context)
        .then(count => {
            return count;
        })
        .catch(() => {
            return '';
        });
}

export function CountMyWork(context) {
    return MyWorkSectionFilterQuery(context).then(filter => {

        if (IsOperationLevelAssigmentType(context)) {
            //My Operation Count
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', filter);
        } else if (IsSubOperationLevelAssigmentType(context)) {
            //SupOpertaion Count
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', filter);
        } else {
            //My Work Order Count
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', filter);
        }
    });
}
