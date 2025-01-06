import { WorkOrderLibrary as libWo } from '../../WorkOrders/WorkOrderLibrary';

/**
* Getting default value for sold-to party if it's required
* @param {IClientAPI} context
*/
export default function SoldToPartyLstPkrCaption(context) {
    return libWo.isServiceOrder(context).then(isSrvOrd => {
        try {
            if (isSrvOrd) {
                return libWo.getSoldToPartyCaption(context, context.binding.OrderType);
            }
            throw 'err';
        } catch (err) {
            return context.localizeText('sold_to_party');
        }
    });
}
