import ApplicationSettings from '../Common/Library/ApplicationSettings';
import CommonLibrary from '../Common/Library/CommonLibrary';

/**
 * Save the metadata to Application Settings and save the refresh time
 * @param {ClientAPI} context
 */
export default function SaveMetadata(context, jsonString) {
    if (jsonString) {
        ApplicationSettings.setString(context, '$metadata', jsonString);
        CommonLibrary.setStateVariable(context, 'lastMetadataRefreshTime', (new Date()).toISOString());
    }
}
