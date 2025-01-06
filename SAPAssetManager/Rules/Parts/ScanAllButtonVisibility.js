import libCommon from '../Common/Library/CommonLibrary';
import libPart from './PartLibrary';
import libVal from '../Common/Library/ValidationLibrary';

export default function ScanAllButtonVisibility(context) {
    if (libCommon.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.Parts.Issue') !== 'N') {
        let bindingObject = context.binding;
        if (libCommon.isEntityLocal(bindingObject)) {
            return false;
        }

        let queryOption = '$filter=OrderId eq ' + '\'' + context.binding.OrderId + '\'' + ' and WithdrawnQuantity ne RequirementQuantity';
        let count = 0;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderComponents', [], queryOption).then(async (result) => {
            if (!libVal.evalIsEmpty(result)) {
                for (let x = 0; x < result.length; x++) {
                    let requirementQuantity = result.getItem(x).RequirementQuantity;
                    let withdrawnQuantity = result.getItem(x).WithdrawnQuantity;
                    await libPart.getLocalQuantityIssued(context, result.getItem(x)).then(local => {
                        count =+ requirementQuantity - (withdrawnQuantity + local);
                    });
                    if (count > 0) break;
                }
            }
            return !!count;
        });
    }
    return false;
}
