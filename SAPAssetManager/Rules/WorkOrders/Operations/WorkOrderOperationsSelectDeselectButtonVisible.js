import libCom from '../../Common/Library/CommonLibrary';

export default function WorkOrderOperationsSelectDeselectButtonVisible(context, isSelectAllButton = true) {
    if (context.getPageProxy().getControl('SectionedTable')) {
        if (context.getPageProxy().getControl('SectionedTable').getSections()[0].getSelectionMode() === 'Multiple') {
            if (!libCom.getStateVariable(context, 'OperationsToSelectCount')) {
                return false;
            }
            
            const selectedOperations = libCom.getStateVariable(context, 'selectedOperations');
            if (isSelectAllButton) {
                return (selectedOperations && selectedOperations.length) <= 0;
            } else {
                return (selectedOperations && selectedOperations.length) > 0;
            }
        }
    }
    return false;
}
