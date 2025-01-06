import FormInstanceListQueryOptions from './FormInstanceListQueryOptions';
import libCom from '../../Common/Library/CommonLibrary';
/**
 * 
 * @param {IClientAPI} clientAPI 
 * @returns {Promise<number>}
 */
export default function FormInstanceCount(clientAPI, checkMandatory = false) {
    const pageProxy = clientAPI.getPageProxy();
    const queryOptions = FormInstanceListQueryOptions(pageProxy, true, checkMandatory);
    const binding = pageProxy.binding || clientAPI.binding || clientAPI.getActionBinding() || libCom.getBindingObject(clientAPI); //Handle alternate bindings
    
    return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/DynamicFormLinkage_Nav`, queryOptions);
}
