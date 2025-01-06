import libCommon from '../../Common/Library/CommonLibrary';
import WorkOrderOperationListViewCaption from './WorkOrderOperationListViewCaption';
import IsAndroid from '../../Common/IsAndroid';

export default function DeselectAllOperations(context) {
    libCommon.setStateVariable(context, 'selectAllActive', false, 'WorkOrderOperationsListViewPage');
    const pageProxy = context.getPageProxy();
    const table = pageProxy.getControls()[0].getSections()[0];
    table.deselectAllItems();

    libCommon.setStateVariable(context, 'selectedOperations', []);
    libCommon.removeStateVariable(context, 'removedOperations');

    if (IsAndroid(context)) {
        pageProxy.getToolbar().redraw();
    } else {
        let confirmButton = context.getPageProxy().getToolbar().getToolbarControls()[1];
        confirmButton.redraw();
    }

    pageProxy.setActionBarItemVisible('SelectAll', true);
    pageProxy.setActionBarItemVisible('DeselectAll', false);

    return WorkOrderOperationListViewCaption(context).then(caption => {
        return pageProxy.setCaption(caption);
    });
}
