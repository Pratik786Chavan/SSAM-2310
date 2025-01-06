import libPersona from './PersonaLibrary';
import Logger from '../Log/Logger';

/**
 * 
 * @param {*} context 
 * @param {*} allowSkip - Should the navigate be skipped if the existing page matches the new page name? 
 * @returns 
 */
export default function LoadPersonaOverview(context, allowSkip = false) {
    if (libPersona.isMaintenanceTechnician(context)) {
        return setPersonaMenuItem(context, libPersona.isNewHomeScreenEnabled(context) ? 'OverviewMTNew' : 'OverviewMT', allowSkip);
    } else if (libPersona.isInventoryClerk(context)) {
        return setPersonaMenuItem(context, 'OverviewIC', allowSkip);
    } else if (libPersona.isFieldServiceTechnician(context)) {
        return setPersonaMenuItem(context, 'OverviewST', allowSkip);
    } else if (libPersona.isWCMOperator(context)) {
        return setPersonaMenuItem(context, 'OverviewWCM', allowSkip);
    } else {
        Logger.error('Persona', 'Invalid persona: ' + libPersona.getActivePersona(context) + ', cannot load persona based overview page');
    }
}

/**
 * 
 * @param {*} context 
 * @param {*} itemName 
 * @param {*} allowSkip 
 * @returns 
 */
function setPersonaMenuItem(context, itemName, allowSkip) {
    let sleepTime = 750;
    let navigate = true;

    Logger.info('Start redraw for ' + itemName);
    return context.getGlobalSideDrawerControlProxy().redraw().then(() => {
        return sleep(sleepTime).then(() => {
            if (allowSkip && context.getGlobalSideDrawerControlProxy().getSelectedMenuItemName() === itemName) {
                navigate = false;
            }
            if (navigate) {
                context.getGlobalSideDrawerControlProxy().setSelectedMenuItemByName(itemName);
            }
            return sleep(sleepTime).then(() => {
                Logger.info('Done redraw for ' + itemName);
                return Promise.resolve();
            });
        });
    });
}

function sleep(ms) {
    return (new Promise((resolve) => {
        Logger.info('Sleeping for ' + ms);
        setTimeout(function() {
            Logger.info('Done sleeping for ' + ms);
            resolve();
        }, ms);
    }));
}
