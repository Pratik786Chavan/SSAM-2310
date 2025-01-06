import libCommon from '../../Common/Library/CommonLibrary';
import DocumentFieldsAddRequired from '../../Documents/Create/DocumentFieldsAddRequired';

export default function EquipmentRequiredFields(context) {
    let onCreate = libCommon.IsOnCreate(context);

    let requiredFields = [
        'DescriptionNote',
        'MaintenacePlantLstPkr',
    ];

    if (onCreate) {
        requiredFields.push('CreateFromLstPkr');
    }

    DocumentFieldsAddRequired(context, requiredFields);

    const template = libCommon.getControlValue(libCommon.getControlProxy(context, 'CreateFromLstPkr'));
    if (template === 'PREVIOUSLY_CREATED') {
        requiredFields.push('ReferenceLstPkr');
    } else if (template === 'TEMPLATE') {
        requiredFields.push('CategoryLstPkr');
        requiredFields.push('TemplateLstPkr');
    }

    return requiredFields;
}
