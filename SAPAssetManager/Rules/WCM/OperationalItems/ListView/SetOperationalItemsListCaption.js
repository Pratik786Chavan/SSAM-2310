import CommonLibrary from '../../../Common/Library/CommonLibrary';
import OperationalItemsCount from '../OperationalItemsCount';
import { OpItemMobileStatusPreFilters } from './OperationalItemsListViewQueryOptions';

/** @param {IPageProxy} context pageproxy of one of the tabpages in OperationalItemsListViewPage */
export default function SetOperationalItemsListCaption(context) {
    const toExpand = 'WCMDocumentHeaders,WCMDocumentHeaders/WCMDocumentPartners,WCMOpGroup_Nav,PMMobileStatus,MyFunctionalLocations';
    const pageName = CommonLibrary.getPageName(context);

    const preFilter = OpItemMobileStatusPreFilters[pageName].map(s => `PMMobileStatus/MobileStatus eq '${s}'`).join(' or ');
    const totalCountTerm = preFilter ? `$expand=${toExpand}&$filter=(${preFilter})` : '';

    const sectionedTable = context.getPageProxy().getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    const prePlusTableFilter = [preFilter, CommonLibrary.GetSectionedTableFilterTerm(sectionedTable)]
        .filter(term => !!term)
        .map(term => `(${term})`)
        .join(' and ');

    const countTerm = prePlusTableFilter ? `$expand=${toExpand}&$filter=(${prePlusTableFilter})` : '';

    const operationalItemsListPage = context.evaluateTargetPathForAPI('#Page:OperationalItemsListViewPage');  // need to get it this way, because the context is just the pageproxy of the current tab
    Promise.all([
        OperationalItemsCount(context, countTerm),
        OperationalItemsCount(context, totalCountTerm)])
        .then(([count, totalCount]) =>
            operationalItemsListPage.setCaption(count === totalCount ? context.localizeText('operational_items_x', [count]) : context.localizeText('operational_items_x_x', [count, totalCount])));
}
