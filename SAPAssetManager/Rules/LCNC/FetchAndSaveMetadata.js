import FetchMetadata from './FetchMetadata';
import SaveMetadata from './SaveMetadata';

/**
 * Fetch the metadata from the destination and save it to Application Settings
 * @param {ClientAPI} context
 * @return {Promise}
 */
export default function FetchAndSaveMetadata(context) {
    return FetchMetadata(context).then(jsonString => {
        return SaveMetadata(context, jsonString);
    });
}
