import inspCharLib from './InspectionCharacteristics';
import libVal from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IContext} context
*/
export default function InspectionCharacteristicsQuantitativeAndQualitativeEDTControls(context) {
    let binding = context.binding;
    let isMandatory = false;
    let IsReadOnly = false;
    if (binding.CharCategory && binding.CharCategory === 'X') {
        isMandatory = true;
    }
    if (inspCharLib.isQuantitative(binding)) {
        if (inspCharLib.isCalculatedAndQuantitative(binding) || binding.AfterAcceptance === 'X' || binding.AfterRejection === 'X') {
            IsReadOnly = true;
        }
        if (String(binding.ResultValue) === '0' && !binding['@sap.isLocal']) {
            return {
                'Type': 'Number',
                'Name': 'Quantitive',
                'IsMandatory': isMandatory,
                'IsReadOnly': IsReadOnly,
                'OnValueChange': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQuantitativeOnValueChangeEDT.js',
                'Property': 'ResultValue',
                'Parameters': {},
            };
        }
        return {
            'Type': 'Number',
            'Name': 'Quantitive',
            'IsMandatory': isMandatory,
            'IsReadOnly': IsReadOnly,
            'OnValueChange': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQuantitativeOnValueChangeEDT.js',
            'Property': 'ResultValue',
            'Parameters': {
                'Value': binding.ResultValue,
            },
        };

    } else if (inspCharLib.isCalculatedAndQuantitative(binding)) {
        if (String(binding.ResultValue) === '0' && !binding['@sap.isLocal']) {
            return {
                Type: 'Text',
                'Name': 'Calculate',
                IsMandatory: false,
                IsReadOnly: true,
                Property: 'ResultValue',
                Parameters: {
                    'Value': binding.Formula1,
                },
            };
        }
        return {
            Type: 'Text',
            'Name': 'Calculate',
            IsMandatory: false,
            IsReadOnly: true,
            Property: 'ResultValue',
            Parameters: {
                'Value': binding.ResultValue.toString(),
            },
        };
    } else if (inspCharLib.isQualitative(binding)) {
        let listPickerValue = '';
        let listPickerDisplayValue = '';
        if (!libVal.evalIsEmpty(binding.InspectionCode_Nav) && !libVal.evalIsEmpty(binding.InspectionCode_Nav.CodeDesc)) {
        //if (!libVal.evalIsEmpty(binding.SelectedSetPlant) && !libVal.evalIsEmpty(binding.SelectedSet) && !libVal.evalIsEmpty(binding.Catalog) && !libVal.evalIsEmpty(binding.CodeGroup) && !libVal.evalIsEmpty(binding.Code)) {
            listPickerValue = `InspectionCodes(Plant='${binding.SelectedSetPlant}',SelectedSet='${binding.SelectedSet}',Catalog='${binding.Catalog}',CodeGroup='${binding.CodeGroup}',Code='${binding.Code}')`;
            listPickerDisplayValue = binding.InspectionCode_Nav.CodeDesc;
            isMandatory = true;
        }
        return {
            'Type': 'ListPicker',
            'Name': 'Qualitative',
            'IsMandatory': isMandatory,
            'IsReadOnly': IsReadOnly,
            'OnValueChange': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeOnChangeEDT.js',
            'Property': 'Code',
            'Parameters': {
                'Search': {
                    'Enabled': true,
                    'Delay': 500,
                    'MinimumCharacterThreshold': 3,
                    'Placeholder': context.localizeText('search'),
                    'BarcodeScanner': true,
                },
                'ItemsPerPage': 21,
                'CachedItemsToLoad': 2,
                'Caption': context.localizeText('value'),
                'DisplayValue': listPickerDisplayValue,
                'Value': listPickerValue,
                'PickerItems': {
                    'DisplayValue': '{CodeDesc}',
                    'ReturnValue': '{@odata.readLink}',
                    'Target': {
                        'EntitySet': 'InspectionCodes',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': '$orderby=Code asc&$filter=(SelectedSet eq \'' + binding.SelectedSet + '\' and Plant eq \'' + binding.SelectedSetPlant + '\' and Catalog eq \'' + binding.Catalog + '\')',
                    },
                },
            },
         };
    } else {
        return {
            Type: 'Text',
            'Name': 'PlaceHolder',
            IsMandatory: false,
            IsReadOnly: false,
            OnValueChange: '',
            Property: 'Status',
            Parameters: {
                Value: 'Test',
            },
        };
    }
}
