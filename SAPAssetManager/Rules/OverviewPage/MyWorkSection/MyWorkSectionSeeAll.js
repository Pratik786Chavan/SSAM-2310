import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import libComm from '../../Common/Library/CommonLibrary';
import WorkOrdersListViewNav from '../../WorkOrders/WorkOrdersListViewNav';
import OperationsListViewWithResetFiltersNav from '../../WorkOrders/Operations/OperationsListViewWithResetFiltersNav';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import OperationsListViewNav from '../../WorkOrders/SubOperations/SubOperationsListViewNav';

export default function MyWorkSectionSeeAll(context) {
    //My Operation list view nav
    if (IsOperationLevelAssigmentType(context)) {
        libComm.setStateVariable(context, 'MyOperationListView', true);
        return OperationsListViewWithResetFiltersNav(context);
    } else if (IsSubOperationLevelAssigmentType(context)) {
        //SupOpertaion list view nav
        libComm.setStateVariable(context, 'MySubOperationListView', true);
        return OperationsListViewNav(context);
    } else {
        //My Work Order list view nav
        libComm.setStateVariable(context, 'MyWorkOrderListView', true);
        return WorkOrdersListViewNav(context);
    }
}
