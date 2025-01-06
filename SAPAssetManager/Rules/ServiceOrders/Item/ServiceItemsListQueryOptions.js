import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetListItemCaption from './GetListItemCaption';

/**
* Query options for the list view of Service items
* Build query based on predefined filters or filter query
* reloads list of fast filters when changed
* @param {{binding: import('./GetListItemCaption').ServiceItemsListViewPageClientData} & ISectionedTableProxy} clientAPI
*/

export default function ServiceItemsListQueryOptions(clientAPI) {
    /** @type {DataQueryBuilder} */

    const [totalCountDqb, countDqb, toReturnDqb] = [...Array(3)].map(() => clientAPI.dataQueryBuilder());
    [totalCountDqb, countDqb, toReturnDqb].forEach(d => d
        .expand('ItemCategory_Nav,ServiceType_Nav,Product_Nav,MobileStatus_Nav,AccountingInd_Nav,TransHistories_Nav/S4ServiceContract_Nav,ServiceProfile_Nav,Document/Document')
        .orderBy('ObjectID,ItemNo'));

    const searchString = clientAPI.searchString;
    if (searchString) {
        //Standard order filters (required when using a dataQueryBuilder)
        const search = ['ItemDesc', 'ItemCategory_Nav/Description', 'ObjectID']
            .map(f => `substringof('${searchString}', tolower(${f}))`)
            .join(' or ');
        [countDqb, toReturnDqb].forEach(d => d.filter(`(${search})`));
    }
    let extraFilter = '';
    if (CommonLibrary.isDefined(clientAPI.binding) && CommonLibrary.isDefined(clientAPI.binding.filter)) {
        extraFilter = clientAPI.binding.filter.slice('$filter='.length);
        if (extraFilter.trim()) {
            [totalCountDqb, countDqb, toReturnDqb].forEach(d => d.filter(extraFilter.trim()));
        }
    }

    if (clientAPI.binding && clientAPI.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        [totalCountDqb, countDqb, toReturnDqb].forEach(d => d.filter(`(ObjectID eq '${clientAPI.binding.ObjectID}')`));
    }

    const sectionedTableFilterTerm = CommonLibrary.GetSectionedTableFilterTerm(clientAPI.getPageProxy().getControl('SectionedTable'));
    if (sectionedTableFilterTerm) {
        countDqb.filter(sectionedTableFilterTerm);
    }
    return Promise.all([totalCountDqb, countDqb].map(d => d.build()))
        .then(([totalCountQuery, countQuery]) => {
            GetListItemCaption(clientAPI, countQuery, totalCountQuery);
            return toReturnDqb;
        });
}
