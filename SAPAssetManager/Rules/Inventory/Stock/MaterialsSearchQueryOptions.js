import CommonLibrary from '../../Common/Library/CommonLibrary';
import EnableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function MaterialsSearchQueryOptions(context) {
    const expand = '$expand=Material/MaterialPlants,MaterialPlant/MaterialBatch_Nav';
    const orderBy = '$orderby=Plant asc,StorageLocation asc';
    const filterTerms = [];

    const sectionedTable = context.getPageProxy().getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    const tableFilter = CommonLibrary.GetSectionedTableFilterTerm(sectionedTable);
    if (tableFilter) {
        filterTerms.push(tableFilter);
    }
    if (EnableFieldServiceTechnician(context)) {
        filterTerms.push(`Plant eq '${CommonLibrary.getUserDefaultPlant()}' and StorageLocation eq '${CommonLibrary.getUserDefaultStorageLocation()}'`);
    }
    const searchString = context.searchString;
    if (searchString) {
        filterTerms.push(GetMaterialsSearchByStringFilterTerm(searchString));
    }

    const filterQuery = filterTerms.length ? `$filter=${filterTerms.join(' and ')}` : '';
    return [expand, filterQuery, orderBy].filter(i => !!i).join('&');
}

function GetMaterialsSearchByStringFilterTerm(searchString) {
    const lowerCaseSearchString = searchString.toLowerCase();
    return `(${['Plant', 'StorageLocation', 'Material/Description', 'StorageBin', 'MaterialNum']
        .map(p => `substringof('${lowerCaseSearchString}', tolower(${p}))`).join(' or ')})`;
}
