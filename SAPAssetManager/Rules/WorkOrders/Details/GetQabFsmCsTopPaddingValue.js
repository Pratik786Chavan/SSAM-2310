import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsFSMCSSectionVisible from '../../ServiceOrders/IsFSMCSSectionVisible';
import RejectReasonIsVisible from '../../Supervisor/Reject/RejectReasonIsVisible';
import IsTimelineControlVisible from '../../TimelineControl/IsTimelineControlVisible';
/**
* Getting top padding value for QAB sections
* @param {IClientAPI} clientAPI
*/
export default function GetQabFsmCsTopPaddingValue(sectionProxy) {
    let visibilityProps = CommonLibrary.getStateVariable(sectionProxy, 'WODetailsFsmCsVisibilityProps');
    if (!visibilityProps) {
        visibilityProps = getVisibilityPropsOverviewFSM(sectionProxy);
        CommonLibrary.setStateVariable(sectionProxy, 'WODetailsFsmCsVisibilityProps', visibilityProps);
    }
    const name = sectionProxy.getName();
    if (name) {
        const visibleSections = pageItems.filter(item => visibilityProps[item]);
        // this case is used only when QAB is visible
        if (visibilityProps.QuickActionBarExtensionSection) {
            return !(visibleSections.indexOf(name) === 1);
        }
    }
    return true;
}

const pageItems = [
    'QuickActionBarExtensionSection',
    'ProgressTrackerExtensionSection',
    'RejectionReason',
    'UserSystemStatuses',
];

function getVisibilityPropsOverviewFSM(sectionProxy) {
    return {
        'QuickActionBarExtensionSection': IsFSMCSSectionVisible(sectionProxy),
        'ProgressTrackerExtensionSection': IsTimelineControlVisible(sectionProxy),
        'RejectionReason': RejectReasonIsVisible(sectionProxy),
        'UserSystemStatuses': true,
    };
}
