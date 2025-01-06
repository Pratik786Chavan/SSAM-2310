import ApplicationSettings from '../Common/Library/ApplicationSettings';
export default class {
    /*
    * check if measuring point is a classical view
    */
    static isMeasuringPointListView(context) {
        let value = this.getMeasuringPointView(context);
        if (value === 1) {
            return true;
        }
        return false;
    }

    /*
    * check if inspection characteristics is a classical view
    */
    static isInspectionCharacteristicsListView(context) {
        let value = this.getInspectionCharacteristicsView(context);
        if (value === 1) {
            return true;
        }
        return false;
    }

    /*
    * set measuring point view
    */
    static setMeasuringPointView(context, value) {
        ApplicationSettings.remove(context, 'MeasuringPointView');
        ApplicationSettings.setNumber(context, 'MeasuringPointView', value);
    }

    /*
    * set inspection characteristics view
    */
    static setInspectionCharacteristicsView(context, value) {
        ApplicationSettings.remove(context, 'InspectionCharacteristicView');
        ApplicationSettings.setNumber(context, 'InspectionCharacteristicView', value);
    }

     /*
    * get measuring point view
    */
     static getMeasuringPointView(context) {
        return ApplicationSettings.getNumber(context, 'MeasuringPointView', 0);
    }

    /*
    * get inspection characteristics view
    */
    static getInspectionCharacteristicsView(context) {
        return ApplicationSettings.getNumber(context, 'InspectionCharacteristicView', 0);
    }

}
