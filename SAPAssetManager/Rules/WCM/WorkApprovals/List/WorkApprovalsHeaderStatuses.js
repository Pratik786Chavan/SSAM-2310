export default function WorkApprovalsHeaderStatuses(context) {
    // by default all statuses from quick filters
    const actualSystemStatuses = [
        context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Created.global').getValue(),
        context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Prepared.global').getValue(),
        context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/WorkPermitPrinted.global').getValue(),
    ];

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMApprovals', ['ActualSystemStatus'], `$filter=${actualSystemStatuses.map(status => `ActualSystemStatus ne '${status}'`).join(' and ')}`)
    .then(approvals=>{
        approvals.forEach(approval => {
            if (actualSystemStatuses.indexOf(approval.ActualSystemStatus) === -1) {
                actualSystemStatuses.push(approval.ActualSystemStatus);
            }
        });


        return actualSystemStatuses;
    })
    .then(result=>{ 
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'SystemStatuses', [], `$filter=${result.map(status=>`SystemStatus eq '${status}'`).join(' or ')}&$select=StatusText,SystemStatus`).then(systemStatuses=>Array.from(systemStatuses,k=>
            ({
                ReturnValue: k.SystemStatus,
                DisplayValue: k.StatusText,
            }),
        ));
    });
}
