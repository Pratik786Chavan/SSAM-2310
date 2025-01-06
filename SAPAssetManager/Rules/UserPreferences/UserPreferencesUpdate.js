import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import LoadPersonaOverview from '../Persona/LoadPersonaOverview';
import libPersona from '../Persona/PersonaLibrary';
import PersonalizationPreferences from './PersonalizationPreferences';

export default function UserPreferencesUpdate(context) {
    try {
        const dict = libCom.getControlDictionaryFromPage(context);
        if (dict && dict.HomeScreenSeg && dict.ReadingsScreenSeg && dict.CheckListScreenSeg) {
            PersonalizationPreferences.setMeasuringPointView(context, libCom.getControlValue(dict.ReadingsScreenSeg));
            PersonalizationPreferences.setInspectionCharacteristicsView(context, libCom.getControlValue(dict.CheckListScreenSeg));
            const segmentedControlValue = libCom.getControlValue(dict.HomeScreenSeg);
            const homeScreenSwitchValue = libPersona.getNewHomeScreenSwitchValueFromControl(segmentedControlValue);
            const isNewLayoutEnabled = libPersona.isNewHomeScreenEnabled(context);
            if (isNewLayoutEnabled !== homeScreenSwitchValue) {
                libPersona.setUserHomeScreenPreference(context, homeScreenSwitchValue);
                return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action').then(() => {
                    let activityIndicatorId = context.showActivityIndicator(context.localizeText('switching_home_screen_layout'));
                    return LoadPersonaOverview(context).then(() => {
                        context.dismissActivityIndicator(activityIndicatorId);
                        // Reload the sectioned table on the persona overview
                        let sectionedTable = getSectionedTableOnOverviewPage(context);
                        
                        if (libCom.isDefined(sectionedTable)) {
                            sectionedTable.redraw();
                        }
                    });
                });
            }
            return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
        }
    } catch (error) {
        Logger.debug('USER PREFERENCES', error);
        return undefined;
    }   
}

function getSectionedTableOnOverviewPage(context) {
    let overviewPageName = libPersona.getPersonaOverviewStateVariablePage(context);
    let overviewPage = context.evaluateTargetPathForAPI('#Page:' + overviewPageName);
    if (overviewPage && overviewPage.getControls().length > 0) {
        return overviewPage.getControls()[0];
    } else {
        return undefined;
    }
}
