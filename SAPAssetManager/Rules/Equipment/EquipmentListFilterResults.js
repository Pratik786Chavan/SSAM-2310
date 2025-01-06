import EquipmentFastFilters from '../FastFilters/MultiPersonaFilters/EquipmentFastFilters';  // eslint-disable-line no-unused-vars

export default function EquipmentListFilterResults(context) {
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    const [sortFilter, statusFilter] = ['SortFilter', 'StatusFilter'].map(n => fcContainer.getControl(n).getValue());
    const wcFilter = fcContainer.getControl('WorkCenterFilter').getFilterValue();

    const filterResults = [sortFilter, statusFilter];

    /** @type {{EquipmentFastFiltersClass: EquipmentFastFilters}} */
    const clientData = context.evaluateTargetPath('#Page:EquipmentListViewPage/#ClientData');
    const fastFilterCriterias = clientData.EquipmentFastFiltersClass.getFastFilterValuesFromFilterPage(context, wcFilter);

    return [...filterResults, ...fastFilterCriterias].filter(c => !!c);
}
