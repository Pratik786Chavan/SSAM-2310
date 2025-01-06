import IsAndroid from '../../Common/IsAndroid';
import libCommon from '../../Common/Library/CommonLibrary';
import { redrawSelectionList } from './OperationsListViewChangeMode';
import WorkOrderOperationListViewCaption from './WorkOrderOperationListViewCaption';

export default function WorkOrderOperationsOnSelectionModeChanged(context) {
  let pageProxy = context.getPageProxy();
  let tableSection = pageProxy.getControls()[0].getSections()[0];

  let item = tableSection.getSelectionChangedItem();
  let selectedOperations = libCommon.getStateVariable(context, 'selectedOperations') || [];
  let removedOperations = libCommon.getStateVariable(context, 'removedOperations') || [];
  const isSelectAll = libCommon.getStateVariable(context, 'selectAllActive', 'WorkOrderOperationsListViewPage');
  let binding = item.binding || {};
  const isLocal = libCommon.isCurrentReadLinkLocal(binding['@odata.readLink']);
  const COMPLETE = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
  const STARTED = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
  const HOLD = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());

  if (item.selected) {
    const persNum = libCommon.getPersonnelNumber();
    const mobileStatus = binding.OperationMobileStatus_Nav ? binding.OperationMobileStatus_Nav.MobileStatus : '';
    const createUserGUID = binding.OperationMobileStatus_Nav ? binding.OperationMobileStatus_Nav.CreateUserGUID : '';
    const isPersNumSuitable = binding.PersonNum === persNum || binding.PersonNum === '00000000' || binding.PersonNum === '' || binding.PersonNum === null;
    const workedByMe = (mobileStatus === STARTED || mobileStatus === HOLD) && createUserGUID === libCommon.getUserGuid(context);
    if (binding && 
      (isPersNumSuitable || isLocal || workedByMe) && 
      (mobileStatus !== COMPLETE) && 
      ((binding.Confirmations && binding.Confirmations.length) ? !binding.Confirmations.every(el => el.FinalConfirmation === 'X') : true)) {
        selectedOperations.push(item);
        if (isSelectAll) {
          removedOperations = removedOperations.filter(operation => {
            if (operation.binding) {
              return operation.binding['@odata.readLink'] !== item.binding['@odata.readLink'];
            }
            return false;
          });
        }
    }
  } else if (item.binding) {
    selectedOperations = selectedOperations.filter(operation => {
      if (operation.binding) {
        return operation.binding['@odata.readLink'] !== item.binding['@odata.readLink'];
      }
      return false;
    });
    if (isSelectAll) {
      removedOperations.push(item);
    }
  }

  libCommon.setStateVariable(context, 'selectedOperations', selectedOperations);
  if (isSelectAll) {
    libCommon.setStateVariable(context, 'removedOperations', removedOperations);
  }

  let firstOpen = libCommon.getStateVariable(context, 'firstOpenMultiSelectMode');
  if (firstOpen) { 
    return redrawSelectionList(context).then(() => {
      if (item.binding && item.binding['@odata.id'] && tableSection._context.element) {
        let selectedItemIndex = tableSection._context.element.binding.findIndex(row => {
          return row['@odata.id'] === item.binding['@odata.id'];
        });

        if (selectedItemIndex !== -1) {
          tableSection._context.element.updateSectionSelectedRows({'selectedRows': [selectedItemIndex]});
        }
      }
    });
  } else {
    const isAnySelected = !!selectedOperations.length;
    pageProxy.setActionBarItemVisible('DeselectAll', isAnySelected);
    pageProxy.setActionBarItemVisible('SelectAll', !isAnySelected);

    if (IsAndroid(context)) {
      pageProxy.getToolbar().redraw();
    } else {
      let confirmButton = pageProxy.getToolbar().getToolbarControls()[1];
      confirmButton.redraw();
    }

    return WorkOrderOperationListViewCaption(context).then(caption => {
      return pageProxy.setCaption(caption);
    });
  }
}
