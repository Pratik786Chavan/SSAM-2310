export default function ApprovalsQueryOptions(type) {
    const baseQueryOptions = '$expand=WCMApprovalProcessSegments,WCMApprovalProcessLongtexts&$orderby=Counter';
    let filter;

    switch (type) {
        case 'received':
            filter = "WCMApprovalProcessSegments/any(seg: seg/SegmentInactive eq '')";
            break;
        case 'pending':
            filter = "WCMApprovalProcessSegments/all(seg: seg/SegmentInactive ne '')"; // there isn't any active processSegment (==approve)
            break;
        default:
            filter = '';
    }

    return `${baseQueryOptions}${filter ? '&$filter=' + filter : ''}`;
}
