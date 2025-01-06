import SetOperationalItemsListCaption from './SetOperationalItemsListCaption';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { OpItemsSubPageFastFilters } from './ConstructOperationalItemsListViewTabs';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import FilterLibrary from '../../../Filter/FilterLibrary';
import { OpItemMobileStatusCodes } from '../libWCMDocumentItem';
import { GetSearchStringFilterTerm } from '../../Common/ListPageQueryOptionsHelper';
import { DQBAndFilterSafe } from '../../Common/DataQueryBuilderUtils';

/** @param {ISectionedTableProxy} context */
export default function OperationalItemsListViewQueryOptions(context) {
    const pageName = CommonLibrary.getPageName(context);
    const toExpand = 'WCMDocumentHeaders,WCMDocumentHeaders/WCMDocumentPartners,WCMDocumentHeaders/WCMDocumentPartners/Employee_Nav,WCMOpGroup_Nav,PMMobileStatus,MyFunctionalLocations';
    const retDQB = context.dataQueryBuilder().expand(toExpand);

    if (Object.keys(OpItemsSubPageFastFilters).includes(pageName)) {  // we are on the OperationalItems List page
        if (!ValidationLibrary.evalIsEmpty(OpItemMobileStatusPreFilters[pageName])) {
            const preFilter = OpItemMobileStatusPreFilters[pageName].map(s => `PMMobileStatus/MobileStatus eq '${s}'`);
            retDQB.filter().or(...preFilter);
        }
        if (context.getPageProxy().getClientData().tabLoaded) {
            SetOperationalItemsListCaption(context.getPageProxy());
        }

        FilterLibrary.setFilterActionItemText(context, context.evaluateTargetPath('#Page:OperationalItemsListViewPage'), context);

        const stringSearchFilterTerm = GetSearchStringFilterTerm(context, context.searchString.toLowerCase(), ['ShortText', 'Tag', 'MyFunctionalLocations/FuncLocId', 'Equipment']);
        DQBAndFilterSafe(retDQB, stringSearchFilterTerm);
    }

    if (pageName === 'WCMOverviewPage' || pageName === 'SafetyCertificateDetailsPage') {
        retDQB.top(4);
    }

    if (pageName === 'SafetyCertificateDetailsPage' || (pageName === 'OperationalItemsListViewPage' && context.binding)) {
        retDQB.orderBy('Sequence');
    }

    return retDQB;
}

export const OpItemMobileStatusPreFilters = Object.freeze({
    all_items: [],
    tagging: [OpItemMobileStatusCodes.InitialTaggingStatus, OpItemMobileStatusCodes.Tag, OpItemMobileStatusCodes.TagPrinted],
    untagging: [OpItemMobileStatusCodes.Untag, OpItemMobileStatusCodes.Tagged],
});
