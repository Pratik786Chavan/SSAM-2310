import PhysicalInventoryItemsNotCountedCaption from '../../Inventory/PhysicalInventory/PhysicalInventoryItemsNotCountedCaption';
/**
* This function sets the default filter
* @param {IClientAPI} context
*/
export default function GetPreselectedFilter(context) {
  return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'PINotCounted', [PhysicalInventoryItemsNotCountedCaption(context)],["EntryQuantity eq 0 and ZeroCount ne 'X'"], true)];
}

