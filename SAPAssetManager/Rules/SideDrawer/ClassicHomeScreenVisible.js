import libPersona from '../Persona/PersonaLibrary';
import EnableMaintenanceTechnician from './EnableMaintenanceTechnician';

/**
* Checks if classic MT home screen is visible
* @param {IClientAPI} clientAPI
*/
export default function ClassicHomeScreenVisible(context) {
    return EnableMaintenanceTechnician(context) && !libPersona.isNewHomeScreenEnabled(context);
}
