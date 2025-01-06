import equipmentRead from './GetEquipmentLocationInformation';
import { FSM_MAP_DEFAULT_QUERY } from '../Maps/FSMMapQueryOptions';
import libVal from './Library/ValidationLibrary';
import libPersona from '../Persona/PersonaLibrary';
import Logger from '../Log/Logger';

export default function GetGeometryInformation(context, geometryPrefix) {

    var binding = context.binding;
    if (!binding || !binding['@odata.readLink']) {
        return Promise.resolve(null);
    }

    let links = '/Geometry';
    if (geometryPrefix === 'WOGeometries') {
        links = '/Geometry,OrderMobileStatus_Nav,MarkedJob';
    } else if (geometryPrefix === 'NotifGeometries') {
        links = '/Geometry,NotifMobileStatus_Nav';
    } else if (geometryPrefix === 'WOPartners') {
        links = '/Address_Nav/AddressGeocode_Nav/Geometry_Nav,Address/AddressGeocode_Nav/Geometry_Nav,Equipment/Address/AddressGeocode_Nav/Geometry_Nav,WOGeometries/Geometry,OrderMobileStatus_Nav,MarkedJob';
    } else if (geometryPrefix === 'FuncLocGeometries') {
        links = '/Geometry';
    } else if (geometryPrefix === 'EquipGeometries') {
        links = '/Geometry';
    }

    if (geometryPrefix === 'WOGeometries' && libPersona.isFieldServiceTechnician(context)) {
         return readWorkOrderForFSM(context, binding);
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], '$expand=' + geometryPrefix + links).then(function(woResults) {
        let busObj = woResults.getItem(0);
        if (busObj[geometryPrefix].length > 0) {
            return busObj;
        }  else if (binding['@odata.type'] !== '#sap_mobile.MyFunctionalLocation') {
            return flocRead(context);
        } else {
            return null;
        }
    }).catch(() => {
        return null;
    });
}

function readWorkOrderForFSM(context, binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `${FSM_MAP_DEFAULT_QUERY} and OrderId eq '${binding.OrderId}'`)
        .then((result) => {
            return libVal.evalIsEmpty(result) ? null : result.getItem(0);
        })
        .catch((error) => {
            Logger.error('readWorkOrderForFSM error', error);
            return null;
        });
}

// "Private" functions - defined separately due to error checking mechanisms
function flocRead(context) {
    let binding = context.getBindingObject();
    if (binding.address) {
        return binding.address;
    }
    if (binding.WOGeometries) {
        if (binding.WOGeometries.length!==0) {
            return binding;
        }
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/FunctionalLocation', [], '$expand=FuncLocGeometries/Geometry').then(function(flocResult) {
        let item = flocResult.getItem(0);
        if (item && item.FuncLocGeometries && item.FuncLocGeometries.length > 0 && item.FuncLocGeometries[0].Geometry) {
            return item;
        } else if (binding['@odata.type'] !== '#sap_mobile.MyEquipment') {
            return equipmentRead(context);
        } else {
            return null;
        }
    });
}
