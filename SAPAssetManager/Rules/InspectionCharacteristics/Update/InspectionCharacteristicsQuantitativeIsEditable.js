import inspCharLib from './InspectionCharacteristics';

export default function InspectionCharacteristicsQuantitativeIsEditable(context) {
    let binding = context.binding;
    if (inspCharLib.isCalculatedAndQuantitative(binding)) {
        return false;
    }
    if (binding.AfterAcceptance === 'X' || binding.AfterRejection === 'X') {
        return false;
    }
    return true;
}
