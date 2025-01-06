import libCommon from '../../Common/Library/CommonLibrary';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function WorkOrderDueDate(context) {
    if (libCommon.isDefined(context.binding.WOHeader) && libCommon.isDefined(context.binding.WOHeader.DueDate)) {
        let odataDate = new OffsetODataDate(context, context.binding.WOHeader.DueDate);
        return context.formatDate(odataDate.date());
    } else if (libCommon.isDefined(context.binding.WorkOrderOperation) && libCommon.isDefined(context.binding.WorkOrderOperation.WOHeader)  && libCommon.isDefined(context.binding.WorkOrderOperation.WOHeader.DueDate)) {
        let odataDate = new OffsetODataDate(context, context.binding.WorkOrderOperation.WOHeader.DueDate);
        return context.formatDate(odataDate.date());
    } else {
        return context.localizeText('no_due_date');
	}
}
