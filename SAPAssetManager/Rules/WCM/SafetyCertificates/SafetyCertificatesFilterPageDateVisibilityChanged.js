import DatePickerVisibleSwitchChanged from '../Common/DatePickerVisibleSwitchChanged';

export default function SafetyCertificatesFilterPageDateVisibilityChanged(context) {
    const isVisibleSliderName = context.getName();
    DatePickerVisibleSwitchChanged(context, isVisibleSliderName);
}
