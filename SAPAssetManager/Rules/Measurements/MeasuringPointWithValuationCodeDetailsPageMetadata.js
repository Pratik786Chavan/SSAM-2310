import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function MeasuringPointWithValuationCodeDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Measurements/MeasuringPointWithValuationCodeDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'MainKeyValueSection');
}
