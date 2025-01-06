import libCommon from '../../Common/Library/CommonLibrary';
import enableMaintenanceTechnician from '../../SideDrawer/EnableMaintenanceTechnician';
import enableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';
// Module-level variable to store the cached value
let cachedValueOperation = null;
export default function IsOperationLevelAssigmentType(context) {
     if (enableMaintenanceTechnician(context) || (enableFieldServiceTechnician(context) && !IsS4ServiceIntegrationEnabled(context))) {
          let currentValue = libCommon.getWorkOrderAssnTypeLevel(context);
          cachedValueOperation = libCommon.updateCacheAndRedraw(context, cachedValueOperation, currentValue);
          return (currentValue === 'Operation');
     }
     return false;
}
