import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';
import {FDCFilterable} from '../../FDC/DynamicPageGenerator';
import inspCharLib from './InspectionCharacteristics';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default async function InspectionCharacteristicsOnLoaded(context) {
    let filterable = new FDCFilterable(context);
	context.getClientData().Filterable = filterable;
    const sectionBindings = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings;
    for (let index = 0; index < sectionBindings.length; index++) {
        context.getControls()[0].sections[0]._context.binding = sectionBindings[index];
    }
    for (const bindingItem of sectionBindings) {
        if (bindingItem.RequiredChar === 'X') {
            await inspCharLib.enableDependentCharacteristics(context, bindingItem, sectionBindings);
        }
    }
    context.getControls()[0].redraw();
    try {
        if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive) {
            context.setActionBarItemVisible(0, false);
            context.setActionBarItemVisible(1, false);
        } else if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
            context.setActionBarItemVisible(0, false);
            context.setActionBarItemVisible(1, false);
        }
    } catch (err) {
        Logger.error('ErrorArchieve', err.message);
    }

    libCom.saveInitialValues(context);
}
