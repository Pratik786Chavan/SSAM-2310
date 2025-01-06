import CommonLibrary from '../../Common/Library/CommonLibrary';
import TechnicalObjectCreateUpdateValidation from '../../Common/Validation/TechnicalObjectCreateUpdateValidation';
import DocumentLibrary from '../../Documents/DocumentLibrary';
import ValidateActualWorkValue from '../../Expense/CreateUpdate/ValidateActualWorkValue';

export default function ServiceItemValidationRule(context) {
    let valPromises = [];

    // check attachment count, run the validation rule if there is an attachment
    if (DocumentLibrary.attachmentSectionHasData(context)) {
        valPromises.push(DocumentLibrary.createValidationRule(context));
    }

    valPromises.push(
        TechnicalObjectCreateUpdateValidation(context).then(() => {
            const amountControl = CommonLibrary.getControlProxy(context, 'AmountProperty');
            return ValidateActualWorkValue(context, amountControl, 15);
        }),
    );

    return Promise.all(valPromises).then((results) => {
        const pass = results.reduce((total, value) => {
            return total && value;
        });
        if (!pass) {
            throw false;
        }
        return true;
    }).catch(() => {
        return false;
    });
}
