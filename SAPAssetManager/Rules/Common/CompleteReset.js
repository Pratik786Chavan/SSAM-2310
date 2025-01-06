import libCom from './Library/CommonLibrary';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import locationLib from '../LocationTracking/LocationTrackingLibrary';
import ApplicationSettings from './Library/ApplicationSettings';
import errorLib from './Library/ErrorLibrary';
import { getMapControlInOverViewPage } from '../UserPersonas/OverviewUserPersona';

export default function CompleteReset(clientAPI, setInitialSync = true) {
    // Clear cache settings in map before reset
    const mapControl = getMapControlInOverViewPage(clientAPI);
    if (libCom.isDefined(mapControl)) {
        const mapExtension = mapControl.getExtensions()[0];
        if (libCom.isDefined(mapExtension)) {
            mapExtension.clearUserDefaults();
        }
    }

    // Changing the flag back to false to execute Update action again on subsequent reset
    userFeaturesLib.diableAllFeatureFlags(clientAPI);
    ApplicationSettings.setBoolean(clientAPI, 'didSetUserGeneralInfos', false);
    ApplicationSettings.setBoolean(clientAPI, 'initialSync', setInitialSync);
    //Reset the backend version that was cache
    ApplicationSettings.remove(clientAPI,'BackendVersion');

    // Disable service and rsset user switch for location tracking feature
    locationLib.disableService(clientAPI);
    locationLib.setUserSwitch(clientAPI, '');

    // Clear error messages
    errorLib.clearError(clientAPI);
}
