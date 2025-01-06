import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { GetSearchStringFilterTerm, ListPageQueryOptionsHelper } from '../../Common/ListPageQueryOptionsHelper';
import libFilter from '../../../Filter/FilterLibrary';


export default function WorkApprovalsListViewQueryOption(context) {
    const page = context.evaluateTargetPathForAPI('#Page:WorkApprovalsListViewPage');
    const toExpand = ['WCMSystemStatuses', 'WCMApprovalApplications'];
    const sectionedTableFilterTerm = CommonLibrary.GetSectionedTableFilterTerm(context);
    const navigationRelatedFilterTerms = [GetRelatedSafetyCertificateFilterTerm(context.binding)];
    const extraFilters = [GetSearchStringFilterTerm(context, context.searchString.toLowerCase(), ['WCMApproval', 'ShortText'])];

    libFilter.setFilterActionItemText(context, context.evaluateTargetPath('#Page:WorkApprovalsListViewPage'), context);

    return ListPageQueryOptionsHelper(context, page, toExpand, sectionedTableFilterTerm, navigationRelatedFilterTerms, extraFilters, 'WCMApprovals', 'work_approvals_x', 'work_approvals_x_x');
}

function GetRelatedSafetyCertificateFilterTerm(binding) { // if navigated from work permit details page
    return binding && binding['@odata.type'] === '#sap_mobile.WCMApplication' ? `WCMApprovalApplications/any(i:i/WCMApplication eq '${binding.WCMApplication}')` : '';
}
