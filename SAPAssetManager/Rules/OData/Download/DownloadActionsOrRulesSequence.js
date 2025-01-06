import allSyncronizationGroups from '../DefiningRequests/AllSyncronizationGroups';
import libCom from '../../Common/Library/CommonLibrary';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import ApplicationOnUserSwitch from '../../ApplicationEvents/ApplicationOnUserSwitch';

export default function DownloadActionsOrRulesSequence(context) {
    let initializeAction = '/SAPAssetManager/Actions/OData/InitializeOfflineOData.action';
    let errorAction = '/SAPAssetManager/Actions/OData/InitializeOfflineODataFailureMessage.action';
    let initialSync = libCom.isInitialSync(context);
    let userSwitchDeltaCompleted =  ApplicationSettings.getBoolean(context, 'didUserSwitchDeltaCompleted', null);
    libCom.setApplicationLaunch(context, false);
    if ( userSwitchDeltaCompleted !== null && !userSwitchDeltaCompleted) { // dont do any download if user switch delta is in progress
        return ApplicationOnUserSwitch(context);
    }
    if (!initialSync) {
        return [
        {
            'Rule': '/SAPAssetManager/Rules/Persona/LoadPersonaOverviewAllowSkip.js',
            'Caption': '',
        },
        {
            'Rule': '/SAPAssetManager/Rules/Inventory/Common/GetIMPersonaEntityLinks.js',
            'Caption': '',
        },
        {
            'Action': initializeAction,
            'Properties': {
                'DefiningRequests': allSyncronizationGroups(context),
                'OnFailure': errorAction,
            },
            'Caption': context.localizeText('application_initialization'),
        },
        {
            'Rule': '/SAPAssetManager/Rules/Common/InitializeGlobalStates.js',
            'Caption': context.localizeText('Initializing_globals'),
        },
        {
            'Rule': '/SAPAssetManager/Rules/EPD/FetchEPDVisualizations.js',
            'Caption': 'Fetching visualizations',
        },
        {
            'Action': '/SAPAssetManager/Actions/ApplicationStartupMessage.action',
            'Caption': '',
        },
        ];
    }

    return [
        {
            'Rule': '/SAPAssetManager/Rules/Persona/GetUserPersonas.js',
            'Caption': context.localizeText('initializing_personas'),
        },
        {
            'Rule': '/SAPAssetManager/Rules/UserPreferences/SetUpDefaultHomeScreen.js',
            'Caption': '',
        },
        {
            'Rule': '/SAPAssetManager/Rules/Persona/ReloadPersonaOverview.js',
            'Caption': '',
        },
        {
            'Rule': '/SAPAssetManager/Rules/Inventory/Common/GetIMPersonaEntityLinks.js',
            'Caption': '',
        },
        {
            'Rule': '/SAPAssetManager/Rules/Forms/SDF/InitialTransmit.js',
            'Caption': '',
        },
        {
            'Action': initializeAction,
            'Properties': {
                'DefiningRequests': allSyncronizationGroups(context),
                'OnFailure': errorAction,
            },
            'Caption': context.localizeText('application_initialization'),
        },
        {
            'Rule': '/SAPAssetManager/Rules/Documents/DownloadHTMLTemplate.js',
            'Caption': context.localizeText('downloading_html_template'),
        },
        {
            'Rule': '/SAPAssetManager/Rules/UserFeatures/ReadingOnlineUserFeatures.js',
            'Caption': '',
        },
        {
            'Rule': '/SAPAssetManager/Rules/Common/InitializeGlobalStates.js',
            'Caption': context.localizeText('Initializing_globals'),
        },
        {
            'Rule': '/SAPAssetManager/Rules/OverviewPage/OverviewOnPageReload.js',
            'Caption': '',
        },
        {
            'Rule': '/SAPAssetManager/Rules/EPD/FetchEPDVisualizations.js',
            'Caption': 'Fetching visualizations',
        },
        {
            'Rule': '/SAPAssetManager/Rules/LCNC/FetchAndSaveMetadataDuringSync.js',
            'Caption': context.localizeText('fetching_metadata'),
        },
        {
            'Rule': '/SAPAssetManager/Rules/Persona/UpdatePersonaOverview.js',
            'Caption': '',
        },
        {
            'Action': '/SAPAssetManager/Actions/ApplicationStartupMessage.action',
            'Caption': '',
        },
        {
            'Rule': '/SAPAssetManager/Rules/UserPreferences/ShowNewHomeScreenInfoMessage.js',
            'Caption': '',
        },
    ];
}
