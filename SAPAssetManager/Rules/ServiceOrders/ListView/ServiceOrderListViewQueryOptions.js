import CommonLibrary from '../../Common/Library/CommonLibrary';
import ServiceOrderListViewCaption from './ServiceOrderListViewCaption';

/**
 * @typedef ServiceOrdersListViewPageBinding
 * @prop {string} filter
 * @prop {boolean} displayShortFastFilterItemList
 */

/** @param {{binding: ?import('./ServiceOrderListViewQueryOptions').ServiceOrdersListViewPageBinding} & ISectionedTableProxy} context */
export default function ServiceOrderListViewQueryOptions(context) {
    /** @type {DataQueryBuilder} */const [totalCountDqb, countDqb, toReturnDqb] = [...Array(3)].map(() => context.dataQueryBuilder());
    [totalCountDqb, countDqb, toReturnDqb].forEach(d => d
        .expand('Priority_Nav,MobileStatus_Nav,Document/Document,ServiceItems_Nav')
        .orderBy('ObjectID,Description,DueBy'));

    const searchString = context.searchString;
    if (searchString) {
        //Standard order filters (required when using a dataQueryBuilder)
        const search = ['Description', 'Priority_Nav/Description', 'ObjectID']
            .map(f => `substringof('${searchString}', tolower(${f}))`)
            .join(' or ');
        [countDqb, toReturnDqb].forEach(d => d.filter(`(${search})`));
    }
    let extraFilter = '';
    if (CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding.filter)) {
        extraFilter = context.binding.filter.slice('$filter='.length).trim();
        if (extraFilter) {
            [totalCountDqb, countDqb, toReturnDqb].forEach(d => d.filter(extraFilter.trim()));
        }
    }

    const sectionedTableFilterTerm = CommonLibrary.GetSectionedTableFilterTerm(context);
    if (sectionedTableFilterTerm) {
        countDqb.filter(sectionedTableFilterTerm);
    }
    return Promise.all([totalCountDqb, countDqb].map(d => d.build()))
        .then(([totalCountQuery, countQuery]) => {
            ServiceOrderListViewCaption(context, countQuery, totalCountQuery);
            return toReturnDqb;
        });
}
