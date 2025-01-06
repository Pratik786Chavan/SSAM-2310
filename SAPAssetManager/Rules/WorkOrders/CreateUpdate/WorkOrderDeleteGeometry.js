
import GeometryDelete from '../../Geometries/GeometryDelete';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';

export default function WorkOrderDeleteGeometry(context) {
    return context.executeAction('/SAPAssetManager/Actions/DiscardLocationWarningMessage.action').then( result => {
        if (result.data === true) {
            return GeometryDelete(context, 'Geometry_Nav', 'Geometries').then(() => {
                return GeometryDelete(context, 'WOGeometries', 'MyWorkOrderGeometries').then(() => {
                    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessageNoClosePage.action').then(()=>{
                        clearLocationFields(context);
                        return Promise.resolve();
                    });
                }).catch(() => {
                    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntityFailureMessage.action');
                });
            }).catch(() => {
                // check if location was added in current screen - from parent object, current location or map button
                let geometry = ApplicationSettings.getString(context, 'Geometry');
                if (!ValidationLibrary.evalIsEmpty(geometry)) {
                    // clear the geometry cache
                    clearLocationFields(context);
                    return Promise.resolve();
                } else {
                    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntityFailureMessage.action');
                }
            });
        }
        return Promise.resolve();
    });
}

function clearLocationFields(context) {
    ApplicationSettings.setString(context, 'Geometry', '');
    context.getSection('LocationButtonsSection').redraw();
    let control = context.getControl('LocationEditTitle');
    control.setValue('');
    control.getPageProxy().currentPage.editModeInfo = {};
    control.redraw();
}
