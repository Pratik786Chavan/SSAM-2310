/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function SearchStockOnline(context) {
    context.showActivityIndicator(context.localizeText('loading'));
    const fcContainer = context.getControl('FormCellContainer0');
    const [Plant, StorageLocation, MaterialID, MaterialDescription] = ['PlantListPicker', 'StorageLocationListPicker', 'MatrialId', 'MatrialDescription']
        .map(n => fcContainer.getControl(n).getValue());
    const StockOnLine = { Plant, StorageLocation, MaterialID, MaterialDescription };
    const listPageProxy = context.evaluateTargetPathForAPI('#Page:StockListViewPage');
    listPageProxy.getClientData().StockOnLineSearch = true;
    listPageProxy.getClientData().StockOnLine = StockOnLine;
    const stocksListOfflineSection = listPageProxy.getControls()[0].getSections()[0];
    const stocksListOnlineSection = listPageProxy.getControls()[0].getSections()[1];
    return context.executeAction('/SAPAssetManager/Actions/OData/CreateOnlineOData.action')
        .then(() => stocksListOfflineSection.setVisible(false))
        .then(() => stocksListOnlineSection.setVisible(true))
        .then(() => {
            context.dismissActivityIndicator();
            listPageProxy.setActionBarItemVisible('FilterButton', false);
            listPageProxy.setActionBarItemVisible('search_online', false);
            listPageProxy.setActionBarItemVisible('search_offline', true);
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        })
        .catch(() => {
            // Could not init online service
            //Logger.error(`Failed to initialize Online OData Service: ${err}`);
            context.dismissActivityIndicator();
            listPageProxy.getClientData().StockOnLineSearch = false;
            return Promise.resolve(true);
        });
}
