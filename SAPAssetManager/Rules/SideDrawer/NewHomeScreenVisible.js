import libPersona from '../Persona/PersonaLibrary';
import EnableMaintenanceTechnician from './EnableMaintenanceTechnician';

/**
* Checks if new MT home screen is visible
* @param {IClientAPI} clientAPI
*/
export default function NewHomeScreenVisible(context) {
    return EnableMaintenanceTechnician(context) && libPersona.isNewHomeScreenEnabled(context);
}
