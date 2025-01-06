import libCom from '../Common/Library/CommonLibrary';
import LocationTrackingToggle from './LocationTrackingToggle';
import personaLib from '../Persona/PersonaLibrary';
import libVal from '../Common/Library/ValidationLibrary';

export default function CheckForChangesBeforeCancel(context) {
    let persona = personaLib.getActivePersona(context);
    let isOn = libCom.getStateVariable(context, 'LocationTrackingSwitch');
    const length = libCom.getStateVariable(context, 'UserPersonas').length;

    libCom.removeStateVariable(context, 'LocationTrackingSwitch');

    if (libVal.evalIsEmpty(persona) || length === 0) { //No personas
        return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
    }

    if (context.evaluateTargetPath('#Control:SwitchPersonaLstPkr/#SelectedValue') !== persona ||
        context.evaluateTargetPath('#Control:LocationTrackingSwitch').getValue() !== isOn) {
        return LocationTrackingToggle(context, persona, isOn).then(function() {
            return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
}
