import MDKVersionInfo from '../UserProfile/MDKVersionInfo';
import Logger from '../Log/Logger';
import ApplicationSettings from '../Common/Library/ApplicationSettings';

/**
* Updates App Information for cloud reporting metrics.
* Checks if App Info has changed or does not exist.
* Updates App Info if nonexistent or changed, then
* Does a fake entity update on UserGeneralInfos
* so a record is generated with updated app info in
* the header.
* @param {IClientAPI} context
*/
export default async function UpdateAppInformation(context) {

    const appName = context.localizeText('app_display_name');
    const appVersion = context.getVersionInfo()['Application Version'];
    const backendVersion = await readBackendVersion(context);

    const mdkVersion = MDKVersionInfo(context);
    const platform = (function() {
        if (context.nativescript.platformModule.isIOS) {
            return 'ios';
        } else if (context.nativescript.platformModule.isAndroid) {
            return 'android';
        } else {
            return 'unknown';
        }
    })();
    return `name=${appName};version=${appVersion};backend-version=${backendVersion};mdk-version=${mdkVersion};platform=${platform}`;
}

function readBackendVersion(context) {
    if (context.isDemoMode()) {
        return Promise.resolve('');
    }

    let version = ApplicationSettings.getString(context, 'BackendVersion');
    if (version) {
        return Promise.resolve(version);
    }

    return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action')
        .then(() => {
            let query = '$filter=SystemSettingName eq \'S4CORE\' or SystemSettingName eq \'S4MERP\' or SystemSettingName eq \'SMERP\'';
            return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'UserSystemInfos', [], query).then((results) => {
                if (results.length) {
                    let config = results.find(item => item.SystemSettingName === 'S4CORE');

                    if (!config) {
                        config = results.find(item => item.SystemSettingName === 'S4MERP');
                    }
                    if (!config) {
                        config = results.find(item => item.SystemSettingName === 'SMERP');
                    }
           
                    if (config) {
                        version = config.SystemSettingName + ' ' + config.SystemSettingValue;
                        ApplicationSettings.setString(context, 'BackendVersion', version);
                        return version;
                    }
                }

                return '';
            });
        })
        .catch((error) => {
            Logger.error('readBackendVersion', error);
            return '';
        });
}
