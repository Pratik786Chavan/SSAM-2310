import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function MeasuringPointDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Measurements/MeasuringPointDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'MeasuringPointDetailsKeyValueSection');
}
