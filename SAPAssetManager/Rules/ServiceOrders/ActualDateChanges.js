import libCom from '../Common/Library/CommonLibrary';
import FSMOverviewOnPageReturning from '../OverviewPage/FSMOverviewOnPageReturning';

/**
* Changing ActualDate state variable when function is afected from datepicker
* @param {IClientAPI} context
*/
export default function ActualDateChanges(context) {
    let sectionedTable = context.getPageProxy().getControls()[0];
    let dateControlSection = sectionedTable.getSection('DatePickerSection');
    if (dateControlSection) {
        let dateControl = dateControlSection.getControl('ActualDate');
        if (dateControl) {
            let date = dateControl._clientAPIProps().newControlValue;
            if (date) {
                let newDate =  new Date(new Date(date).setHours(0,0,0,0));
                libCom.setStateVariable(context, 'ActualDate', newDate);
                return libCom.createOverviewRow(context, newDate).then(() => {
                    context.currentPage.redraw();

                    // Refresh the map view
                    FSMOverviewOnPageReturning(context.getPageProxy());
                    return Promise.resolve();
                });
            }
        }
    }
}
