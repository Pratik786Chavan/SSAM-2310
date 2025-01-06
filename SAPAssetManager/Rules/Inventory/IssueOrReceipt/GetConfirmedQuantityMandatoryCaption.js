import libCom from '../../Common/Library/CommonLibrary';

/**
 * 'Confirmed Quantity *' with mandatory indicator implementation
 * @param {ClientAPI} context MDK Context
 * @returns {String} formated string with mandatory sign
 */
export default function GetConfirmedQuantityMandatoryCaption(context) {
    return libCom.formatCaptionWithRequiredSign(context, 'po_item_detail_confirmed', true);
}
