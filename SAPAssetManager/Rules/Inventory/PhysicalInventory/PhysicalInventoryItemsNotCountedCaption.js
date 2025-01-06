import libCom from '../../Common/Library/CommonLibrary';
/**
* This function gives the count of the physical inventory not counted items...
* @param {IClientAPI} context
*/
export default function PhysicalInventoryItemsNotCountedCaption(context) {
    let pageName = libCom.getPageName(context);
    let baseQuery = libCom.getStateVariable(context,'INVENTORY_BASE_QUERY', pageName);
    let baseQueryNotCounted = baseQuery + " and (EntryQuantity eq 0 and ZeroCount ne 'X')";    
    return libCom.getEntitySetCount(context, 'PhysicalInventoryDocItems', baseQueryNotCounted).then(count => {
        return context.localizeText('pi_uncounted_x',[count]); 
    });   
}
