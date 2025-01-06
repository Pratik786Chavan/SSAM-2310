import IsMetadataParsingFeatureEnabled from './IsMetadataParsingFeatureEnabled';
import HasRefreshThresholdPassed from './HasRefreshThresholdPassed';
import CommonLibrary from '../Common/Library/CommonLibrary';
import FetchAndSaveMetadata from './FetchAndSaveMetadata';

/**
 * During an Initial Sync, always fetch the metadata if the parsing feature is enabled
 * During a Delta Sync, refresh the metadata only if the threshold has passed
 * @param {ClientAPI} context
 * @returns {Promise}
 */
export default function FetchAndSaveMetadataDuringSync(context) {

    if (IsMetadataParsingFeatureEnabled(context)) {
        if (CommonLibrary.isInitialSync(context) || HasRefreshThresholdPassed(context)) {
            return FetchAndSaveMetadata(context);
        }
    }

    return Promise.resolve();
}
