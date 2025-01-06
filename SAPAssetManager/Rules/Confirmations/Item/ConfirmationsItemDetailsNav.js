import DetailsPageToolbarClass from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';

export default function ConfirmationsItemDetailsNav(context) {
    return generateToolbarItems(context.getPageProxy()).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/Item/ConfirmationsItemDetailsNav.action');
    });
}

function generateToolbarItems(pageProxy) {
    let transitionType = '';

    let binding = pageProxy.getActionBinding() || {};
    if (binding.MobileStatus_Nav && binding.MobileStatus_Nav.OverallStatusCfg_Nav && binding.MobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav) {
        let statuses = binding.MobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
        transitionType = statuses.length ? statuses[0].TransitionType : '';
    }

    let items = [{
        'Title': pageProxy.localizeText('complete_confirmation_item'),
        'TransitionType': transitionType, 
        'OnPress': '/SAPAssetManager/Rules/Confirmations/Item/CompleteConfirmationItem.js',
    }];
    
    return DetailsPageToolbarClass.getInstance().generatePossibleToolbarItems(pageProxy, items, 'ConfirmationsItemDetailsPage').then(() => {
        return Promise.resolve();
    });
}
