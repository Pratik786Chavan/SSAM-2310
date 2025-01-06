import CommonLibrary from '../Common/Library/CommonLibrary';
import IsServiceReportEnabled from './IsServiceReportEnabled';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';

export default function IsPDFAllowedForOrder(clientAPI) {
    return IsServiceReportEnabled(clientAPI) && CommonLibrary.getWorkOrderAssnTypeLevel(clientAPI) === 'Header' && !libWO.isWorkOrderInCreatedState(clientAPI);
}
