import common from '../../Common/Library/CommonLibrary';

/**
 * Gets the document date for each inventory header object type
 */
 
export default function GetPostingDateForInventoryHeader(clientAPI) {
    var binding = clientAPI.getBindingObject();
    var statusValue;

    if (binding['@odata.readLink'] && binding['@odata.readLink'].includes('MaterialDocuments')) {
        statusValue = binding.PostingDate;
    } 
    
    if (statusValue) {
        var date = common.dateStringToUTCDatetime(statusValue);
        var dateText = common.getFormattedDate(date, clientAPI);
        return dateText;
    }

    return '';
}
