import FilterLibrary from '../../Filter/FilterLibrary';

/** @param {IPageProxy} context  */
export default function SegmentedFilterButtonCaption(context) {
    const selectedTabName = context.getControls()[0].getSelectedTabItemName();
    if (!selectedTabName) {
        return FilterLibrary.getFilterButtonText(context, 0);
    }
    const tabPageContext = context.evaluateTargetPathForAPI(`#Page:${selectedTabName}`);
    const sectionedTable = tabPageContext.getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    const filterCount = FilterLibrary.getFilterCountFromCriterias(sectionedTable && sectionedTable.filters || []);
    return FilterLibrary.getFilterButtonText(context, filterCount);
}
