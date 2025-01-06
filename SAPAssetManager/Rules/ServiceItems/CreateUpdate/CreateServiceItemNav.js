import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function CreateServiceItemNav(context) {
    CommonLibrary.setOnCreateUpdateFlag(context, 'CREATE');
    S4ServiceLibrary.setServiceItemBasicMode(context);
    return context.executeAction('/SAPAssetManager/Actions/ServiceItems/ServiceItemCreateChangeset.action');
}
