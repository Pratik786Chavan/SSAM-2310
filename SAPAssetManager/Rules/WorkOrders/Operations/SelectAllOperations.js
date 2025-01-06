import IsAndroid from '../../Common/IsAndroid';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import OperationsEntitySet from './OperationsEntitySet';
import WorkOrderOperationListViewCaption from './WorkOrderOperationListViewCaption';
import WorkOrderOperationsListViewQueryOption from './WorkOrderOperationsListViewQueryOption';

export default async function SelectAllOperations(context) {
    libCommon.setStateVariable(context, 'selectAllActive', true, 'WorkOrderOperationsListViewPage');
    libCommon.setStateVariable(context, 'removedOperations', []);
    const pageProxy = context.getPageProxy();
    const table = pageProxy.getControls()[0].getSections()[0];
    table.selectAllItems();

    pageProxy.showActivityIndicator();
    //manually add all items to the array
    let selectedOperations = await addAllRecords(context);
    libCommon.setStateVariable(context, 'selectedOperations', selectedOperations);
    pageProxy.dismissActivityIndicator();

    if (IsAndroid(context)) {
        pageProxy.getToolbar().redraw();
    } else {
        let confirmButton = pageProxy.getToolbar().getToolbarControls()[1];
        confirmButton.redraw();
    }

    pageProxy.setActionBarItemVisible('SelectAll', false);
    pageProxy.setActionBarItemVisible('DeselectAll', true);

    return WorkOrderOperationListViewCaption(context).then(caption => {
        return pageProxy.setCaption(caption);
    });
}

async function addAllRecords(context) {
    let queryOptions = await getTableFilters(context);
    let selectedOperations = [];
    if (queryOptions) {
        const totalRecords = await context.count('/SAPAssetManager/Services/AssetManager.service', OperationsEntitySet(context), queryOptions);
        const batchSize = 50;
        let recordsAlreadyRead = selectedOperations.length;

        while (recordsAlreadyRead < totalRecords) {
            const recordsToRead = Math.min(batchSize, totalRecords - recordsAlreadyRead); //Read max 50 at a time instead of all at once for performance reasons
            const recordsReadByBatch = await context.read('/SAPAssetManager/Services/AssetManager.service', OperationsEntitySet(context), [], `${queryOptions}&$skip=${recordsAlreadyRead}&$top=${recordsToRead}`);

            //convert the array to be a collection of SelectedItem objects to mimic what the getSelectedItems() API does
            for (let i=0; i < recordsReadByBatch.length; i++) {
                let currentRecord = recordsReadByBatch.getItem(i);
                selectedOperations.push({
                    binding: currentRecord,
                });
            }

            recordsAlreadyRead += recordsReadByBatch.length;
            if (recordsReadByBatch.length < batchSize) { // All rows are read
                return selectedOperations;
            }
        }
    }

    return selectedOperations;
}

async function getTableFilters(context) {
    const sectionedTable = context.getPageProxy().getControls()[0];

    let filterQuery = '';
    let expandQuery = '';
    let tableQueryOptions = WorkOrderOperationsListViewQueryOption(sectionedTable);
    let quickFilters = CommonLibrary.getQueryOptionFromFilter(context);

    if (tableQueryOptions && tableQueryOptions.hasFilter) {
        const filter = await tableQueryOptions.filterOption.build();
        filterQuery = '$filter=' + filter;
    }

    if (tableQueryOptions && tableQueryOptions.hasExpand) {
        const expand = await tableQueryOptions.expandOption.join(',');
        expandQuery = '$expand=' + expand;
    }

    if (quickFilters) {
        if (filterQuery) {
            filterQuery += ' and ' + quickFilters.substring(8);
        } else {
            filterQuery = quickFilters;
        }
    }

    return `${filterQuery}${expandQuery.length ? `&${expandQuery}` : ''}`;
}
