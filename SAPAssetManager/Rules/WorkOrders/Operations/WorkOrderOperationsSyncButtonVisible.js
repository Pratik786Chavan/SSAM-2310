import Logger from '../../Log/Logger';

export default function WorkOrderOperationsSyncButtonVisible(context) {
  try {
    if (context.getPageProxy().getControl('SectionedTable') && context.getPageProxy().getControl('SectionedTable').getSections()[0].getSelectionMode() === 'Multiple') {
      return false;
    }
    return true;
  } catch (error) {
    Logger.error(error);
    return true;
  }
}
