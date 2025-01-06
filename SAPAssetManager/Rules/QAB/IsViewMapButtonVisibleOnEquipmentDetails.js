import IsFieldServiceTechnicianDisabled from '../SideDrawer/IsFieldServiceTechnicianDisabled';
import IsViewMapButtonVisible from './IsViewMapButtonVisible';

export default function IsViewMapButtonVisibleOnEquipmentDetails(context) {
    return IsFieldServiceTechnicianDisabled(context) && IsViewMapButtonVisible(context);
}
