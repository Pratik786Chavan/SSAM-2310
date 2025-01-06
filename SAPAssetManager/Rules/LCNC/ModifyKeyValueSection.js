import IsMetadataParsingFeatureEnabled from './IsMetadataParsingFeatureEnabled';
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import FindPropertiesByAttribute from './FindPropertiesByAttribute';

/*
    Find all properties that have been "extended" and visible on the detail screen in the config panel and add them in the key value section
    If a key value section doesn't exist, then a generic one will be created
*/
export default async function ModifyKeyValueSection(clientAPI, page, sectionName) {

    if (IsMetadataParsingFeatureEnabled(clientAPI) && page) {
        let jsonString = ApplicationSettings.getString(clientAPI, '$metadata');

        if (jsonString) {
            let binding = clientAPI.getActionBinding();

            //Find all the properties that have been extended for this entityset
            let extendedProperties = FindPropertiesByAttribute(jsonString, binding['@odata.type'].substring('#sap_mobile.'.length), 'sap:is_extension_field');

            if (extendedProperties && extendedProperties.length > 0) {
                //re-read the current binding object in order to get all properties
                let bindingObject = await clientAPI.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], '').then(resultArray => {
                    return resultArray.getItem(0);
                });

                let sections = page.Controls[0].Sections;
                let keyValueSection;

                if (sectionName) {
                    keyValueSection = sections.find(section => section._Name === sectionName);
                } else { //create a key value section
                    keyValueSection = {
                        '_Type': 'Section.Type.KeyValue',
                        '_Name': 'ExtendedPropertiesKeyValueSection',
                        'Header': {
                            'Caption': '$(L,extended_properties)',
                        },
                        'KeyAndValues': [],
                    };
                    sections.push(keyValueSection);
                }

                let keyValues = keyValueSection.KeyAndValues;

                extendedProperties.forEach(metadataObject => {
                    let attributesObject = metadataObject._attributes;
                    let isVisible = attributesObject['sap:visible_detail'] === 'true';
                    if (isVisible) {
                        // We're adding a new property
                        // Check custom label first then sap label. If both don't exist then fall back to the property name
                        let label = attributesObject['sap:custom_label'] || attributesObject['sap:label'] || attributesObject.Name;

                        let value = bindingObject[attributesObject.Name];

                        keyValues.push({
                            'KeyName': label,
                            'Value': value,
                        });

                    }

                });
            }

        }
    }

    return page;
}
