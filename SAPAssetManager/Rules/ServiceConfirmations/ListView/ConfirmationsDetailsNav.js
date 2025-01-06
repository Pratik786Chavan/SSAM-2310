import DetailsPageToolbarClass from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

export default function ConfirmationsDetailsNav(context) {
    return generateToolbarItems(context.getPageProxy()).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/Details/ConfirmationsDetailsNav.action');
    });
}

function generateToolbarItems(pageProxy) {
    if (MobileStatusLibrary.isServiceOrderStatusChangeable(pageProxy)) {
        let transitionType = '';

        let binding = pageProxy.getActionBinding() || {};
        if (binding.MobileStatus_Nav && binding.MobileStatus_Nav.OverallStatusCfg_Nav && binding.MobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav) {
            let statuses = binding.MobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
            transitionType = statuses.length ? statuses[0].TransitionType : '';
        }

        let items = [{
            'Title': pageProxy.localizeText('complete_confirmation'),
            'TransitionType': transitionType, 
            'OnPress': '/SAPAssetManager/Rules/Confirmations/Details/CompleteConfirmation.js',
        }];
       
        return DetailsPageToolbarClass.getInstance().generatePossibleToolbarItems(pageProxy, items, 'ConfirmationsDetailsScreenPage').then(() => {
            return Promise.resolve();
        });
    } else {
        return Promise.resolve();
    }
}
