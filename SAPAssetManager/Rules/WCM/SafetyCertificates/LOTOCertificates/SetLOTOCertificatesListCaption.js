import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { LOTOCertificatePreFilters } from '../LOTOCertificatesListViewQueryOption';
import SafetyCertificatesLibrary from '../SafetyCertificatesLibrary';

/** @param {IPageProxy} context pageproxy of one of the tabpages in LOTOCertificatesListViewPage */
export default function SetLOTOCertificatesListCaption(context) {
    const toExpand = 'WCMApplicationDocuments,WCMDocumentPartners';
    const pageName = CommonLibrary.getPageName(context);

    const preFilter = SafetyCertificatesLibrary.createQueryStringFromCriterias(LOTOCertificatePreFilters[pageName]);
    const totalCountTerm = preFilter ? `$expand=${toExpand}&$filter=(${preFilter})` : '';

    const sectionedTable = context.getPageProxy().getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    const prePlusTableFilter = [preFilter, CommonLibrary.GetSectionedTableFilterTerm(sectionedTable)]
        .filter(term => !!term)
        .map(term => `(${term})`)
        .join(' and ');

    const countTerm = prePlusTableFilter ? `$expand=${toExpand}&$filter=(${prePlusTableFilter})` : '';

    const operationalItemsListPage = context.evaluateTargetPathForAPI('#Page:LOTOCertificatesListViewPage');  // need to get it this way, because the context is just the pageproxy of the current tab
    Promise.all([
        CommonLibrary.getEntitySetCount(context, 'WCMDocumentHeaders', countTerm),
        CommonLibrary.getEntitySetCount(context, 'WCMDocumentHeaders', totalCountTerm),
    ]).then(([count, totalCount]) =>
        operationalItemsListPage.setCaption(count === totalCount ? context.localizeText('isolation_certificates_x', [count]) : context.localizeText('isolation_certificates_x_x', [count, totalCount])));
}
