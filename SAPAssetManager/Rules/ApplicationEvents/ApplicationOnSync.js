import isSyncInProgress from '../Sync/IsSyncInProgress';
import errorLibrary from '../Common/Library/ErrorLibrary';

export default function ApplicationOnSync(clientAPI) {
    // TODO: remove the workaround when MDK provides a solution (MDKBUG-1604)
    let pageProxy = clientAPI.getPageProxy();
    if (pageProxy && pageProxy.getGlobalSideDrawerControlProxy) {
        let sideDrawer = pageProxy.getGlobalSideDrawerControlProxy();
        if (sideDrawer) {
            // prevents a navigation history from being reset on the next navigation
            sideDrawer._control.blankItemSelected = false;
        }
    }
                    
    if (!isSyncInProgress(clientAPI)) {
        errorLibrary.clearError(clientAPI);
        return clientAPI.executeAction('/SAPAssetManager/Actions/SyncInitializeProgressBannerMessage.action');
    } else {
        return clientAPI.executeAction('/SAPAssetManager/Actions/SyncInProgress.action');
    }
}
