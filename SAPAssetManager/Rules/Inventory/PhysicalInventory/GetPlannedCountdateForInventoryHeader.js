import ODataDate from '../../Common/Date/ODataDate';
import libVal from '../../Common/Library/ValidationLibrary';
/**
* This function gives the Physical inventory planned count date...
* @param {IClientAPI} context
*/
export default function GetPlannedCountdateForInventoryHeader(context) { 
    var statusValue = context.binding.PlanCountdate;
    if (!libVal.evalIsEmpty(statusValue)) {
        let oDataDate = new ODataDate(statusValue).toLocalDateString();       
        var dateText = context.formatDate(oDataDate);
        return dateText; 
    }
    return '';
}
