import DatePickerVisibleSwitchChanged from './DatePickerVisibleSwitchChanged';

export default function FilterPageDateVisibilityChanged(context, listPageName) {
    const name = context.getName();
    const isVisible = DatePickerVisibleSwitchChanged(context, name);

    let clientData = context.evaluateTargetPath(`#Page:${listPageName}/#ClientData`);
    clientData[name] = isVisible;
}
