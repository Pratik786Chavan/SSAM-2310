import CommonLibrary from '../Common/Library/CommonLibrary';
import IsServiceReportEnabled from './IsServiceReportEnabled';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';

export default function IsPDFAllowedForOperation(clientAPI) {
    return IsServiceReportEnabled(clientAPI) && CommonLibrary.getWorkOrderAssnTypeLevel(clientAPI) === 'Operation' && !libWO.isWorkOrderInCreatedState(clientAPI);
}
