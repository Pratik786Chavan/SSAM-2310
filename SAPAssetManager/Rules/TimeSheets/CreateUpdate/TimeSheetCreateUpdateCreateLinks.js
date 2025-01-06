import libCom from '../../Common/Library/CommonLibrary';

export default function TimeSheetCreateUpdateCreateLinks(pageProxy, actionBinding) {
    let binding = pageProxy.getBindingObject();

    // change the binding if these are bulk confirmations
    let isBulkConfirmation;
    if (actionBinding) {
        isBulkConfirmation = true;
        binding = actionBinding;
    }

    let woReadLink = isBulkConfirmation ? binding.WOHeader['@odata.readLink'] :
        libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:RecOrderLstPkr/#Value'));
    let opReadLink = isBulkConfirmation ? binding.OperationReadlink :
        libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:OperationLstPkr/#Value'));
    var subOpReadLink = isBulkConfirmation ? binding.SubOperationReadLink :
        libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:SubOperationLstPkr/#Value'));

    var links = [];

    if (woReadLink && opReadLink) {
        links = [
            {
                'Property': 'MyWOHeader',
                'Target':
                {
                    'EntitySet': 'MyWorkOrderHeaders',
                    'ReadLink': woReadLink,
                },
            },
            {
                'Property': 'MyWOOperation',
                'Target':
                {
                    'EntitySet': 'MyWorkOrderOperations',
                    'ReadLink': opReadLink,
                },
            }];
    
        if (subOpReadLink) {
            links.push({
                'Property': 'MyWOSubOperation',
                'Target':
                {
                    'EntitySet': 'MyWorkOrderSubOperations',
                    'ReadLink': subOpReadLink,
                },
            });
        }
    }

    //Add Employee link
    let myPerNum = libCom.getPersonnelNumber();
    if (!myPerNum) { //if personnel number doesn't exist then time is being added for the logged in user so use that personnel number
        myPerNum = libCom.getPersonnelNumber(pageProxy);
    }
    if (myPerNum) {
        links.push({
            'Property': 'Employee',
            'Target':
            {
                'EntitySet': 'Employees',
                'QueryOptions': `$filter=PersonnelNumber eq '${myPerNum}'`,
            },
        });
    }

    return links;
}
