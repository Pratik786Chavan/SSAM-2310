import IsAndroid from '../Common/IsAndroid';
import OnDateChanged from '../Common/OnDateChanged';
import libPersona from '../Persona/PersonaLibrary';

export default function OverviewOnPageReturning(context) {
    if (libPersona.isMaintenanceTechnician(context)) {
        // Refresh the map view
        let sectionedTable = context.getControls()[0];
        let mapSection = sectionedTable.getSection('MapExtensionSection');

        if (mapSection) {
            let mapViewExtension = mapSection.getExtensions()[0];
            if (IsAndroid(context)) {
                mapSection.redraw(true);
            } else {
                mapViewExtension.update();
            }
        }

        // Refresh the High Prority Work Orders
        sectionedTable.getSection('HighPriorityOrdersSection').redraw();

        // Check to see if this date has changed
        let lastDateChange = context.getClientData().lastDateChange;
        let now = new Date();

        if (lastDateChange.getDate() !== now.getDate() && now > lastDateChange) {
            OnDateChanged(context);
        }
    }
}
