import libPersona from '../Persona/PersonaLibrary';
import libVal from '../Common/Library/ValidationLibrary';

export default function GetActivePersona(context) {
    const activePersona = libPersona.getActivePersona(context);
    const defaultPersona = context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/MTPersonaName.global').getValue();
    return libVal.evalIsEmpty(activePersona) ? defaultPersona : activePersona;
}
