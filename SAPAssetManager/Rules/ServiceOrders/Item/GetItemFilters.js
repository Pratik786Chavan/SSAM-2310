import { S4ServiceItemFastFilters } from '../../FastFilters/S4FSMFastFilters/S4ServiceItemFastFilters';
import GetItemTypePickerItems from './Filter/GetItemTypePickerItems';

/**
 * @typedef ServiceItemListPageClientData
 * @prop {S4ServiceItemFastFilters} ServiceItemFastFilters
 */
export default function GetItemFilters(context) {
    return GetItemTypePickerItems(context)
        .then(pickerItems => {
            const serviceItemFastFilters = new S4ServiceItemFastFilters(context, pickerItems);

            context.getPageProxy().getClientData().ServiceItemFastFilters = serviceItemFastFilters;
            return serviceItemFastFilters.getFastFilterItemsForListPage(context);
        });
}
