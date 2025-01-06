import measuringPointsEntity from './MeasuringPointsListViewEntitySet';
import measuringPointsQueryOption from './MeasuringPointsListViewQueryOption';
import excludeSelectExpandOptions from '../ExcludeSelectExpandOptions';

export default function MeasuringPointsCaptions(context) {
    let query = measuringPointsQueryOption(context);
    query = excludeSelectExpandOptions(query);
    return context.count('/SAPAssetManager/Services/AssetManager.service', measuringPointsEntity(context), query).then(count => {
        let params = [count];
        return context.localizeText('measuring_points_x', params);
    });
}
