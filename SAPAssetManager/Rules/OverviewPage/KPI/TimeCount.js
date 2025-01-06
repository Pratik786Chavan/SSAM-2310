import TimeCaptureTypeHelper from '../TimeCaptureSection/TimeCaptureTypeHelper';
import TimeSheetTodayHoursForCrew from '../../Crew/TimeSheets/CrewTimeSheetsTodaysHours';
import TimeSheetTodayHours from '../../TimeSheets/TimeSheetsTodaysHours';
import ODataDate from '../../Common/Date/ODataDate';
import ConfirmationTotalDuration from '../../Confirmations/ConfirmationTotalDuration';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import ConvertDoubleToHourString from '../../Confirmations/ConvertDoubleToHourString';

export default function TimeCount(context) {
    const defaultPlaceholder = context.localizeText('kpi_time_hours_minutes', ['0', '00']);
    return TimeCaptureTypeHelper(context, ConfirmationTodayHours.bind(null, context, defaultPlaceholder), TimeSheetsTodayHours, defaultPlaceholder);
}

export function ConfirmationTodayHours(context, defaultPlaceholder) {
    try {
        let odataDate = new ODataDate();
        let date = new Date(odataDate.toDBDateString());
        return ConfirmationTotalDuration(context, date).then(results => {
            return FormatResult(context, results);
        });
    } catch {
        return defaultPlaceholder;
    }
}

export function TimeSheetsTodayHours(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        return TimeSheetTodayHoursForCrew(context).then(results => {
            return FormatResult(context, results);
        });
    } else {
        return TimeSheetTodayHours(context, false).then(results => {
            return FormatResult(context, ConvertDoubleToHourString(results));
        });
    } 
}

/**
 * Localize the returned time string for KPI display
 * Format of result should be 0:00 (hours : minutes)
 * If bad format, default to 0
 * @param {*} context 
 * @param {*} result 
 * @returns 
 */
export function FormatResult(context, result) {
    let values = result.split(':');

    if (values.length < 2) {
        values = [];
        values.push('0','00');
    }

    if (values[0] === 'NaN' && values[1] === 'NaN') {
        values = [];
        values.push('0','00');
    }

    return context.localizeText('kpi_time_hours_minutes', [values[0], values[1]]);
}
