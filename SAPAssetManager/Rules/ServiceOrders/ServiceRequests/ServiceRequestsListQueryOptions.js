import CommonLibrary from '../../Common/Library/CommonLibrary';
import ServiceResuestsListViewCaption from './ServiceRequestsListViewCaption';

export default function ServiceRequestsListQueryOptions(context) {
    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('Priority_Nav,MobileStatus_Nav,RefObj_Nav,RefObj_Nav/MyFunctionalLocation_Nav,RefObj_Nav/MyEquipment_Nav,Document/Document');
    queryBuilder.orderBy('ObjectID,Description,DueBy');

    let searchString = context.searchString;
    if (searchString) {
        let filters = [];
        //Standard order filters (required when using a dataQueryBuilder)
        filters.push(`substringof('${searchString}', tolower(ObjectID))`);
        filters.push(`substringof('${searchString}', tolower(Priority_Nav/Description))`);
        filters.push(`substringof('${searchString}', tolower(Description))`);
        queryBuilder.filter('(' + filters.join(' or ') + ')');
    }

    const captionQueryBuilder = context.dataQueryBuilder(queryBuilder);
    const sectionedTableFilterTerm = CommonLibrary.GetSectionedTableFilterTerm(context.getPageProxy().getControl('SectionedTable'));
    if (sectionedTableFilterTerm) {
        captionQueryBuilder.filter(sectionedTableFilterTerm);
    }
    return captionQueryBuilder.build().then(query => {
        ServiceResuestsListViewCaption(context, query);
        return queryBuilder;
    });
}
