import AssignedToLibrary from '../../Common/AssignedToLibrary';

export default function OperationalItemstFilterOnLoaded(context) {
    const filters = context.getPageProxy().getFilter().getFilters();
    if (!filters) {
        return;
    }

    const partnersNav = context.getPageProxy().binding.PartnersNavPropName;
    AssignedToLibrary.CollectAssignedToSelectedItemsFromFilterCriteria(context, filters, partnersNav);
}
