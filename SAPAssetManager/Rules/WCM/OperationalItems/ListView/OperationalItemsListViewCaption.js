import OperationalItemsCount from '../OperationalItemsCount';
import libCommon from '../../../Common/Library/CommonLibrary';
import { OpItemMobileStatusPreFilters } from './OperationalItemsListViewQueryOptions';

export default function OperationalItemsListViewCaption(context) {
    const preselectedTabIndex = libCommon.getStateVariable(context, 'operationalItemsListPreselectedTabIndex');
    let queryOptions = '';

    if (preselectedTabIndex) {
        const tabName = preselectedTabIndex === 1 ? 'tagging' : 'untagging';
        queryOptions = `$filter=${OpItemMobileStatusPreFilters[tabName].map(s => `PMMobileStatus/MobileStatus eq '${s}'`).join(' or ')}`;
    }

    return OperationalItemsCount(context, queryOptions).then(count => {
        return context.localizeText('operational_items_x', [count]);
    });
}
