import notification from '../../../../SAPAssetManager/Rules/Notifications/NotificationLibrary'
import updateGroupPickers from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/UpdateGroupPickers';
import userFeaturesLib from '../../../../SAPAssetManager/Rules/UserFeatures/UserFeaturesLibrary';
import prioritySelector from '../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdatePrioritySelector';
import EMPButtonIsVisible from '../../../../SAPAssetManager/Rules/Notifications/EMP/EMPButtonIsVisible';
import ResetValidationOnInput from '../../../../SAPAssetManager/Rules/Common/Validation/ResetValidationOnInput';
import CommonLibrary from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function NotificationCreateUpdateTypeOnValueChange(context) {

    //Set Breakdown Indicator to always true for Notification Type M2
    var onCreate = CommonLibrary.IsOnCreate(context);

    //This code should trigger for local notification (create and Edit)
    if (context.getValue().length > 0 && (onCreate || context.binding['@sap.isLocal'])) {

        let breakDownSwitch = context.getPageProxy().evaluateTargetPath('#Control:BreakdownSwitch');
        let startSwitch = context.getPageProxy().evaluateTargetPath('#Control:BreakdownStartSwitch');
        let startDate = context.getPageProxy().evaluateTargetPath('#Control:MalfunctionStartDatePicker');
        let startTime = context.getPageProxy().evaluateTargetPath('#Control:MalfunctionStartTimePicker');
        let endSwitch = context.getPageProxy().evaluateTargetPath('#Control:BreakdownEndSwitch');
        let endDate = context.getPageProxy().evaluateTargetPath('#Control:MalfunctionEndDatePicker');
        let endTime = context.getPageProxy().evaluateTargetPath('#Control:MalfunctionEndTimePicker');

        //Activate the breakdowm switch relevant field if Notification Type is M2
        if (context.getValue()[0].ReturnValue === "M2") {
            breakDownSwitch.setVisible(true);
            breakDownSwitch.setValue(true);
            breakDownSwitch.setEditable(false);
            startDate.setVisible(true);
            startTime.setVisible(true);
            startSwitch.setVisible(true);

            endDate.setVisible(true);
            endTime.setVisible(true);
            endSwitch.setVisible(true);

            ////Disable the breakdowm switch relevant field if Notification Type changed from M2 to others
        } else {

            breakDownSwitch.setValue(false);
            breakDownSwitch.setVisible(true);
            breakDownSwitch.setEditable(true);

            startSwitch.setValue(false);
            startSwitch.setVisible(false);

            startDate.setValue(false);
            startDate.setVisible(false);

            startTime.setValue(false);
            startTime.setVisible(false);
          
            
            endSwitch.setValue(false);
            endSwitch.setVisible(false);

            endDate.setValue(false);
            endDate.setVisible(false);

            endTime.setValue(false);
            endTime.setVisible(false);
        }

    }

    ResetValidationOnInput(context);
    return EMPButtonIsVisible(context).then(() => {
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
            return prioritySelector(context).then(() => updateGroupPickers(context.getPageProxy())).finally(() => {
                return notification.setFailureAndDetectionGroupQuery(context);
            });
        } else {
            return notification.NotificationCreateUpdatePrioritySelector(context).then(() => updateGroupPickers(context.getPageProxy())).finally(() => {
                return notification.setFailureAndDetectionGroupQuery(context);
            });
        }
    });
}
