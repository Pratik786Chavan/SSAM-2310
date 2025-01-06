import filterOnLoaded from './FilterOnLoaded';

export default function FLOCFilterOnLoaded(context) {
    filterOnLoaded(context); //Run the default filter on loaded
    let clientData = context.evaluateTargetPath('#Page:FunctionalLocationListViewPage/#ClientData');
    if (clientData.FunctionalLocationFastFiltersClass) {
        clientData.FunctionalLocationFastFiltersClass.resetClientData(context);
        clientData.FunctionalLocationFastFiltersClass.setFastFilterValuesToFilterPage(context);
    }
}
