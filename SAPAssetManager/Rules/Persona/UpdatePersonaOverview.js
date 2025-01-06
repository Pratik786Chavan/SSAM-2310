import CommonLibrary from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import IsGISEnabled from '../Maps/IsGISEnabled';
import IsS4GISEnabled from '../Maps/IsS4GISEnabled';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import IsServiceItemKPIVisible from '../ServiceOrders/IsServiceItemKPIVisible';
import { getModalArray } from './ReloadPersonaOverview';

export default function UpdatePersonaOverview(context) {
    return Promise.all(getModalArray(context)).then(() => {
        setTimeout(() => {
            try {
                let pageProxy = context.currentPage.context.clientAPI;
                let pageName = CommonLibrary.getPageName(pageProxy);
                
                switch (pageName) {
                    case 'OverviewPageNew': {
                        let sectionedTable = pageProxy.getControls()[0];
                        let timeSection = sectionedTable.getSection('TimeCaptureSection');
                        let kpiSection = sectionedTable.getSections()[0];
                        let myWorkSection = sectionedTable.getSection('ObjectCardTest');

                        kpiSection.redraw(true);
                        timeSection.redraw(true);
                        myWorkSection.redraw(true);
                        reloadMap(context, sectionedTable, 'MapExtensionSection', IsGISEnabled);
    
                        Logger.info('ReloadMTPersonaOverview');
                        break;
                    }
                    case 'OverviewPage': {
                        let sectionedTable = pageProxy.getControls()[0];
                        reloadMap(context, sectionedTable, 'MapExtensionSection', IsGISEnabled);
                        break;
                    }
                    case 'WCMOverviewPage': {
                        let sectionedTable = pageProxy.getControls()[0];
                        reloadMap(context, sectionedTable, 'WCMMapExtensionSection', IsGISEnabled);
                        break;
                    }
                    case 'FieldServiceOverview': {
                        let sectionedTable = pageProxy.getControls()[0];

                        let kpiSectionName = IsServiceItemKPIVisible(context) ? 'KPIHeader' : 'KPIHeaderForWO';
                        let kpiSection = sectionedTable.getSection(kpiSectionName);
                        kpiSection.redraw(true);
                        Logger.info('ReloadFSMersonaOverview');

                        let isS4 = IsS4ServiceIntegrationEnabled(context);
                        let mapSectionName = isS4 ? 'S4MapExtensionSection' : 'MapExtensionSection';
                        let sectionVisibiltyFn = isS4 ? IsS4GISEnabled : IsGISEnabled;
                        reloadMap(context, sectionedTable, mapSectionName, sectionVisibiltyFn);
                        break;
                    }
                    default:
                        break;
                }
            } catch (error) {
                Logger.error('UpdatePersonaOverview', error);
            }
        }, 500);
        return Promise.resolve();
    }).catch(() => {
        return Promise.resolve();
    });
}

function reloadMap(context, sectionedTable, sectionName, sectionVisibiltyFn) {
    let mapSection = sectionedTable.getSection(sectionName);
    mapSection.setVisible(false).then(() => {
        let isMapVisible = sectionVisibiltyFn(context);

        if (isMapVisible) {
            mapSection.setVisible(true);
            Logger.info('ReloadMap');
        }
    });
}
