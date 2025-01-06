import WorkOrderPickerQueryOptions from './WorkOrderPickerQueryOptions';
import Logger from '../../Log/Logger';

export default function WorkOrderPickerItems(context) {
    let createFrom = [];
    const queryOption = WorkOrderPickerQueryOptions(context);

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], queryOption).then(result => {
        if (result && result.length > 0) {
            result.forEach(item => {
                createFrom.push(
                    {
                        'ReturnValue': item.OrderId,
                        'DisplayValue': `${item.OrderId} - ${item.OrderDescription}`,
                    },
                );
            });
        }
        return createFrom;
    }).catch((error) => {
        Logger.error(error);
        return createFrom;
    });
}
