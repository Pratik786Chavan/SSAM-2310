import pageToolbar from './DetailsPageToolbarClass';
import isRTL from '../IsRTL';

export default function IsRightSpaceVisible(context) {
    let toolbarItems = pageToolbar.getInstance().getToolbarItems(context);
    if (toolbarItems.length > 3) return true;

    let negativeButton = toolbarItems.find(item => item.TransitionType === 'N');
    if (negativeButton) return isRTL(context);

    return false;
}
