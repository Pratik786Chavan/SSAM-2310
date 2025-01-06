import pageToolbar from './DetailsPageToolbarClass';
import isRTL from '../IsRTL';

export default function IsMiddleSpaceVisible(context) {
    let toolbarItems = pageToolbar.getInstance().getToolbarItems(context);
    let negativeButton = toolbarItems.find(item => item.TransitionType === 'N');
    
    if (negativeButton) return !isRTL(context);

    if (toolbarItems.length === 2) return true;

    return false;
}
