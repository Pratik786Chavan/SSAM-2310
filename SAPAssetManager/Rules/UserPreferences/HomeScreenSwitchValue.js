import libPersona from '../Persona/PersonaLibrary';

/**
* Gets user preference for new home screen layout switch
* @param {IClientAPI} clientAPI
*/
export default function HomeScreenSwitchValue(context) {
    return libPersona.isNewHomeScreenEnabled(context) ? '0' : '1';
}
