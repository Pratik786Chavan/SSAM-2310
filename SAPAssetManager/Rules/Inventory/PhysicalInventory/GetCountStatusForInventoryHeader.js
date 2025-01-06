import Logger from '../../Log/Logger';
/**
* This function gives the Physical inventory count status...
* @param {IClientAPI} context
*/
export default function GetCountStatusForInventoryHeader(context) {
    let binding = context.binding;
    let target = binding['@odata.readLink'];

    let countEntity = target + '/PhysicalInventoryDocItem_Nav';
    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', countEntity, '');
    let countedPromise = context.count('/SAPAssetManager/Services/AssetManager.service', countEntity,"$filter=EntryQuantity gt 0 or ZeroCount eq 'X'");

    return Promise.all([totalCountPromise, countedPromise]).then(([totalCount, count])=> {       
        if (count === totalCount) {
          return context.localizeText('pi_counted');
        } else if (count > 0) {
          return context.localizeText('pi_partially_counted');
        } else if (count === 0) {
           return context.localizeText('pi_uncounted');
        }
        return '';
    }).catch((error) => {
      Logger.error('Physical Inventory',  error);
      return '';
  });
}
