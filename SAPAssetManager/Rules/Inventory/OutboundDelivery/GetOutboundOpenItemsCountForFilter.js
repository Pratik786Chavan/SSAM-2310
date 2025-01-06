import GetOutboundDeliveryOpenCaption from '../../Inventory/OutboundDelivery/GetOutboundDeliveryOpenCaption';
/**
* This function gives the count of the IBD open items...
* @param {IClientAPI} context
*/
export default function GetOutboundOpenItemsCountForFilter(context) {
  return [context.createFilterCriteria(
    context.filterTypeEnum.Filter, 
    'OBD', 
    [GetOutboundDeliveryOpenCaption(context)],
    ['PickedQuantity ne Quantity'], 
    true)];
}
