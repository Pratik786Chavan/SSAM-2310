export default function ServiceOrderSalesOrg(clientAPI, serviceOrderId) {
    const binding = clientAPI.binding;
    let soId = serviceOrderId;
    if (!soId && binding) {
        soId = binding.ObjectID;
    }
    if (soId) {
        const query = `$filter=ObjectID eq '${soId}'&$select=SalesOrg`;
        return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceOrders', [], query).then(res => {
            return (res.length > 0 && res.getItem(0).SalesOrg) || '';
        });
    }
    return Promise.resolve('');
}
