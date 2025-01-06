import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function OperationsListViewChangeMode(context) {
    CommonLibrary.setStateVariable(context, 'OperationsToSelectCount', undefined);
    CommonLibrary.setStateVariable(context, 'selectedOperations', []);
    
    let pageProxy = context.getPageProxy();

    if (pageProxy.getControl('SectionedTable').getSections()[0].getSelectionMode() !== 'Multiple') {
        pageProxy.getControl('SectionedTable').getSections()[0].setSelectionMode('Multiple');
    } else {
        pageProxy.getControl('SectionedTable').getSections()[0].setSelectionMode('None');
    }

    return redrawSelectionList(context);
}

export function redrawSelectionList(context) {
    let pageProxy = context.getPageProxy();

    CommonLibrary.setStateVariable(context, 'firstOpenMultiSelectMode', false);
    CommonLibrary.setStateVariable(context, 'selectAllActive', false, 'WorkOrderOperationsListViewPage');

    pageProxy._page._redrawActionBar();

    pageProxy.showActivityIndicator();
    return pageProxy.getControl('SectionedTable').redraw().finally(() => {
        pageProxy.dismissActivityIndicator();
        pageProxy.getToolbar().redraw();
    });
}
