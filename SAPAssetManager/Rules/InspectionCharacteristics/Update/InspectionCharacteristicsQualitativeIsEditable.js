/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function InspectionCharacteristicsQualitativeIsEditable(context) {
    let binding = context.binding;
    if (binding.RequiredChar === 'X' || binding.OptionalChar === 'X') {
        return true;
    }
    return false;
}
