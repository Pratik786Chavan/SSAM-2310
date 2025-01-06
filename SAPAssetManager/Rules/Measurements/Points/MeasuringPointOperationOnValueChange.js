/**
* Change the client data on value change after finding the object number for the operation
* @param {IClientAPI} clientAPI
*/
export default function MeasuringPointOperationOnValueChange(clientAPI) {
    let pageProxy = clientAPI.getPageProxy();
    let selectedOperation = clientAPI.binding.pageBinding.Operations.find(operation => operation.OperationNo === clientAPI.getValue()[0].ReturnValue); // find the operation that is selected from the list of operations
    if (selectedOperation) {
        pageProxy.getClientData().MeasuringPointData[clientAPI.binding.Point].Operation = selectedOperation.ObjectNumber;
    }
}
