import pageToolbar from './DetailsPageToolbarClass';

export default function ToolbarItemType(context) {
    const buttonName = context.getName();

    let toolbarItems = pageToolbar.getInstance().getToolbarItems(context);
    let buttonData = toolbarItems.find(item => item.name === buttonName);
    if (buttonData) {
        return buttonData.TransitionType === 'P' ? 'Button' : 'Normal';
    }

    return 'Normal';
}
