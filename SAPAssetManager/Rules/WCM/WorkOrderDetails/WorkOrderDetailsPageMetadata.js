import Logger from '../../Log/Logger';
import MeasuringPointFDCIsVisible from '../../Measurements/Points/MeasuringPointFDCIsVisible';
import UserSystemStatusesVisible from './UserSystemStatusesVisible';

export default function WorkOrderDetailsPageMetadata(clientAPI) {
    return addKPIViewInPageHeader(clientAPI).then((page) => {
        return UserSystemStatusesVisible(clientAPI, page);
    });
}

function addKPIViewInPageHeader(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/WorkOrderDetails.page');

    return MeasuringPointFDCIsVisible(clientAPI, clientAPI.getActionBinding())
        .then(visible => {
            if (visible) {
                let sections = page.Controls[0].Sections;
                let pageHeader = sections[0].ObjectHeader;

                if (pageHeader && !pageHeader.KPIView) {
                    pageHeader.KPIView = {
                        'Label': '/SAPAssetManager/Rules/Analytics/KPIPointDesc.js',
                        'LeftMetric': '/SAPAssetManager/Rules/Measurements/Points/MeasuringPointReadingsTakenKPI.js',
                    };
                }
            }

            return Promise.resolve(page);
        })
        .catch(error => {
            Logger.error('addKPIViewInPageHeader', error);
            return Promise.resolve(page);
        });
}
