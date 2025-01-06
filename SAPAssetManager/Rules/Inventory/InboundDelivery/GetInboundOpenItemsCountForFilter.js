import GetInboundDeliveryOpenCaption from '../../Inventory/InboundDelivery/GetInboundDeliveryOpenCaption';

/**
* This function gives the count of the IBD open items...
* @param {IClientAPI} context
*/
export default function GetInboundOpenItemsCountForFilter(context) {
  return [context.createFilterCriteria(
    context.filterTypeEnum.Filter, 
    'IBD', 
    [GetInboundDeliveryOpenCaption(context)],
    ['PickedQuantity ne Quantity'], 
    true)];
}

