import libPersona from '../../Persona/PersonaLibrary';

export default function UpdateOverviewMap(context) {
    const overviewPageName = libPersona.getPersonaOverviewStateVariablePage(context);
    let pageProxy = context.evaluateTargetPathForAPI('#Page:' + overviewPageName);
    let sectionedTable = pageProxy.getControls()[0];
    let mapSection = sectionedTable.getSections()[0];
    let mapViewExtension = mapSection.getExtensions()[0];
    mapViewExtension.update();
}
