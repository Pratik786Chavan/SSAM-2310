import libCom from '../../Common/Library/CommonLibrary';
import libForms from './FSMSmartFormsLibrary';

/**
 * Display the smart forms caption count on the list, supporting main list and operations/service items list plus mdk filters
 * @param {*} context 
 * @returns 
 */
export default function FSMFormsInstanceListViewCaption(context) {

    let mdkFilter = libCom.getQueryOptionFromFilter(context);
    let totalQueryOption, queryOption;
    var params = [];

    if (libCom.isDefined(context.binding)) {
        totalQueryOption = libForms.getOperationFSMFormsQueryOptions(context, false);
    } else {
        totalQueryOption = libForms.getFSMFormsQueryOptions(context, false);
    }
    if (libCom.isDefined(context.binding)) {
        queryOption = libForms.getOperationFSMFormsQueryOptions(context, false);
    } else {
        queryOption = libForms.getFSMFormsQueryOptions(context, false);
    }
    if (mdkFilter) { //Combine mdk filter with standard smart form query options
        queryOption = queryOption.replace('$filter=', '');
        queryOption = mdkFilter + ' and ' + queryOption;
    }

    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'FSMFormInstances', totalQueryOption);
    let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'FSMFormInstances', queryOption);

    return Promise.all([totalCountPromise, countPromise]).then(function(counts) {
        let totalCount = counts[0];
        let count = counts[1];
        params.push(count);
        params.push(totalCount);
        if (count === totalCount) {
            return context.setCaption(context.localizeText('smart_forms_x', [totalCount]));
        }
        return context.setCaption(context.localizeText('smart_forms_x_x', params));
    });
}
