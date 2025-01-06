import libPersona from '../Persona/PersonaLibrary';

/**
* Sets user preference to use new home screen layout as default after intial sync/app update/persona switch
* @param {IClientAPI} clientAPI
*/
export default function SetUpDefaultHomeScreen(context) {
    libPersona.setUpUserDefaultHomeScreen(context);
}
