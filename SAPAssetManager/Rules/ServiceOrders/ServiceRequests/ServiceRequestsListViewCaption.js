
export default function ServiceResuestsListViewCaption(clientAPI, query = '') {
    /** @type {IPageProxy} */
    const pageProxy = clientAPI.getPageProxy ? clientAPI.getPageProxy() : clientAPI;
    return Promise.all([
        clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceRequests', ''),
        clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceRequests', query),
    ]).then(([totalCount, count]) => pageProxy.setCaption(count === totalCount ? clientAPI.localizeText('service_request_x', [totalCount]) : clientAPI.localizeText('service_request_x_x', [count, totalCount])));
}
