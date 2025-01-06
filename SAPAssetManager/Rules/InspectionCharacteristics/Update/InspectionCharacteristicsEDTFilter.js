import filterLibrary from './InspectionCharacteristicsEDTFilterLibrary';
import InspectionCharacteristicsUpdateWithNoValidationEDT from './InspectionCharacteristicsUpdateWithNoValidationEDT';

export default async function InspectionCharacteristicsEDTFilter(context) {
    
    let filetrData = filterLibrary.getUserData(context).FilterData;
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Equipments = filetrData.Equipments;
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FuncLocs = filetrData.FunctionalLocations;
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Operations = filetrData.Operations;
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FilterApplied = filetrData.FilterApplied;
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Count = 0;
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FilteredCount = 0;
    
    let filter = await context.executeAction('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsFDCFilterNav.action').then(async filterResult => {
        return filterResult.data.filter.match(/\$filter=(.*)/)[1];
    }); 
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().filter = filter;

    await InspectionCharacteristicsUpdateWithNoValidationEDT(context);
    if (filter === '') {
        filterLibrary.resetFilter(context);
    } else {
        filterLibrary.filterSections(context,filter);
    }
}
