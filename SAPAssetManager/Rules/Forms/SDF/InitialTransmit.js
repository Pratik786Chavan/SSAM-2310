import updateOnlineXSUAATokenEntity from './updateOnlineXSUAATokenEntity';
import Logger from '../../Log/Logger';
import personaLib from '../../Persona/PersonaLibrary';

export default function InitialTransmit(context) {
    // online check for feature flag
    return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action').then(function() {
        return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'UserFeatures', [], '').then(function(features) {
            if (features.length > 0) {
                //globals havent been loaded at this point, so hard coding the feature name
                const sdfFeature = 'CA_DYNAMIC_FORMS';
                const currentPersona = personaLib.getActivePersona(context);

                const featureExists = features.some((userFeature) => {
                    const persona = userFeature.UserPersona;
                    const feature = userFeature.UserFeature;

                    return currentPersona === persona && sdfFeature === feature;
                });
                
                if (featureExists) {
                    updateOnlineXSUAATokenEntity(context, '').then((success) => {
                        if (!success) {
                            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySync.global').getValue(),`Failure to update xsuaa token: ${success}`);
                        }
                    });
                }
            } else {
                Logger.error('UserFeatures','No user features enabled on the backend');
            }
        }).catch(() => {
            Logger.error('UserFeatures','Reading UserFeatures from online service failed');
        });
    }).catch(() => {
        Logger.error('UserFeatures','Connecting to online service failed');
    });

}
