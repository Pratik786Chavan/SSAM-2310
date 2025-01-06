import CommonLibrary from '../../Common/Library/CommonLibrary';
import { TIME_FILTERS } from '../FastFilters';
import FastFiltersWithStatuses, { STATUS_FAST_FILTERS, STATUS_FILTER_GROUP } from '../FastFiltersWithStatuses';
import { isAssignment1or2 } from '../../ServiceOrders/ListView/ServiceOrderFastFiltersItems';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';


export class S4ServiceOrderFastFilters extends FastFiltersWithStatuses {

    /** @param {{binding: S4ServiceOrder} & IClientAPI} context */
    constructor(context) {
        const config = {
            statusPropertyPath: 'MobileStatus_Nav/MobileStatus',
            dueDatePropertyPath: 'DueBy',
        };
        const filterPageName = 'ServiceOrderFilterPage';
        const listPageName = 'ServiceOrdersListViewPage';
        super(context, filterPageName, listPageName, config);
        this.userName = CommonLibrary.getSapUserName(context);
    }

    /** @param {{binding: import('../../ServiceOrders/ListView/ServiceOrderListViewQueryOptions').ServiceOrdersListViewPageBinding} & IPageProxy} context */
    getFastFilters(context) {
        /** @type {import('../FastFilters').fastFilterItem[]} */
        const items = [
            {
                name: STATUS_FAST_FILTERS.STATUS_STARTED,
                value: this._getStartedFilterItemReturnValue(),
                group: STATUS_FILTER_GROUP,
                visible: this.isStatusFilterVisible(context),
            },
            {
                name: STATUS_FAST_FILTERS.STATUS_COMPLETED,
                value: this._getCompletedFilterItemReturnValue(),
                group: STATUS_FILTER_GROUP,
                visible: this.isStatusFilterVisible(context),
            },
        ];
        if (ValidationLibrary.evalIsEmpty(context.binding) || ValidationLibrary.evalIsEmpty(context.binding.displayShortFastFilterItemList) || !context.binding.displayShortFastFilterItemList) {
            items.push(
                {
                    name: TIME_FILTERS.DUE_DATE_TODAY,
                    value: this._getDueDateFilterItemReturnValue(),
                    visible: this.isDueDateFilterVisible(context),
                });
        }
        return items;
    }

    isStatusFilterVisible(context) {
        return isAssignment1or2(context);
    }

    isDueDateFilterVisible(context) {
        return isAssignment1or2(context);
    }
}
