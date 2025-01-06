
export default function MeasuringPointFDCFilterListIsVisible(context) {

    let skipEquipment = false;
    let skipFloc = false;
    let skipOperations = false;
    let skipPRT = false;
    let skip4Items = true;

    const dataType = context.binding['@odata.type'];

    if (dataType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue()) {
        skipEquipment = true;
        skipFloc = true;
        skipPRT = true;
        skipOperations = true;
    }
    if (dataType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue()) {
        skipFloc = true;
        skipPRT = true;
        skipOperations = true;
    }

    if (dataType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue()) {
        skipPRT = true;
        skipOperations = true;
        skip4Items = false;
    }

    if (dataType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Notification.global').getValue()) {
        skipPRT = true;
        skipOperations = true;
    }



    if (context.evaluateTargetPathForAPI('#Page:-Previous')._page.previousPage.id === 'PRTListViewPage') {
        skipPRT = true;
    }

    if (context.getName() === 'Equipment') {
        let equipments = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Equipments;
        if (equipments && equipments.length > 0 && !skipEquipment) {
            return true;
        }
        return false;
    }
    if (context.getName() === 'FuncLoc') {
        let FuncLocs = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FuncLocs;
        if (FuncLocs && FuncLocs.length > 0  && !skipFloc) {
           return true;
        }
        return false;
    }
    if (context.getName() === 'FilterPRT') {
        if (skipPRT) {
            return false;
        }
        return true;
    }
    if (context.getName() === 'Operations') {
        if (skipOperations) {
            return false;
        }
        return true;
    }
    if (context.getName() === 'S4Items') {
        if (skip4Items) {
            return false;
        }
        return true;
    }
}
