export default function FindPropertiesByAttribute(jsonString, entity, attribute) {
    if (jsonString && entity && attribute) {
        let jsonObj = JSON.parse(jsonString);
        let entityTypeArray = jsonObj['edmx:Edmx']['edmx:DataServices'].Schema.EntityType;
        let entityObj = entityTypeArray.find(entityType => entityType._attributes.Name === entity);
        let entityProperties = entityObj.Property;
        return entityProperties.filter(entityProperty => entityProperty._attributes[attribute] === 'true');
    } else {
        return [];
    }

}
