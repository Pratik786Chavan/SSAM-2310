
/**
* Check for unsaved changes before closing or canceling a page
* @param {IClientAPI} context
*/
export default function InspectionCharacteristicsEDTCheckForChangesBeforeClose(context) {
    const confirmCloseAction = '/SAPAssetManager/Actions/Page/ConfirmClosePage.action';
    let sections = context.getPageProxy().getControls()[0].getSections();
    for (let section of sections) {
        if (section.getExtensions() && section.getExtensions()[0] && section.getExtensions()[0].constructor && section.getExtensions()[0].constructor.name === 'EditableDataTableViewExtension') {
            let extension = section.getExtensions()[0];
            let values = extension.getUpdatedValues();
            if (values && values.length > 0) {
                return context.executeAction(confirmCloseAction);
            }
        }
    }
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
}
