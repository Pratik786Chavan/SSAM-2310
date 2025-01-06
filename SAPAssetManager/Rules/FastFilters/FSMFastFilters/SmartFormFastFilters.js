import PersonaLibrary from '../../Persona/PersonaLibrary';
import { STATUS_FAST_FILTERS, STATUS_FILTER_GROUP } from '../FastFiltersWithStatuses';
import FastFiltersWithStatuses from '../FastFiltersWithStatuses';
import CommonLibrary from '../../Common/Library/CommonLibrary';

const ASSIGNMENT_TYPE_1 = '1';
const ASSIGNMENT_TYPE_2 = '2';
const ASSIGNMENT_TYPE_6 = '6';
const ASSIGNMENT_TYPE_8 = '8';

const MANDATORY_FILTER_GROUP = 'mandatory';

const SMARTFORM_FAST_FILTERS = {
    'OPTIONAL': 'FILTER_OPTIONAL',
    'MANDATORY': 'FILTER_MANDATORY',
};

export default class SmartFormFastFilters extends FastFiltersWithStatuses {

    constructor(context) {
        const config = {
            statusProperty: 'Closed',
            mandatoryPropery: 'Mandatory',
        };
        const filterPageName = 'FSMFilterPage';
        const listPageName = 'FSMSmartFormsInstancesListViewPage';
        super(context, filterPageName, listPageName, config);

        this.setNewFilterCaption(SMARTFORM_FAST_FILTERS.OPTIONAL, context.localizeText('optional'));
        this.setNewFilterCaption(SMARTFORM_FAST_FILTERS.MANDATORY, context.localizeText('mandatory'));
    }

    getFastFilters(context) {
        return [
            { name: STATUS_FAST_FILTERS.STATUS_OPEN, value: this._getOpenFilterItemReturnValue(), property: this.config.statusProperty, group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
            { name: STATUS_FAST_FILTERS.STATUS_COMPLETED, value: this._getCompletedFilterItemReturnValue(), property: this.config.statusProperty, group: STATUS_FILTER_GROUP, visible: this.isStatusFilterVisible(context) },
            { name: SMARTFORM_FAST_FILTERS.OPTIONAL, value: this._getOptionalFilterItemReturnValue(), property: this.config.mandatoryPropery, group: MANDATORY_FILTER_GROUP, visible: this.isMandatoryFilterVisible(context) },
            { name: SMARTFORM_FAST_FILTERS.MANDATORY, value: this._getMandatoryFilterItemReturnValue(), property: this.config.mandatoryPropery, group: MANDATORY_FILTER_GROUP, visible: this.isMandatoryFilterVisible(context) },
        ];
    }

    isStatusFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = false;

        if (PersonaLibrary.isFieldServiceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_6
                || woAssignmentType === ASSIGNMENT_TYPE_2 || woAssignmentType === ASSIGNMENT_TYPE_8;
        }

        return isFilterVisible;
    }

    isMandatoryFilterVisible(context) {
        let woAssignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
        let isFilterVisible = false;

        if (PersonaLibrary.isFieldServiceTechnician(context)) {
            isFilterVisible = woAssignmentType === ASSIGNMENT_TYPE_1 || woAssignmentType === ASSIGNMENT_TYPE_6
                || woAssignmentType === ASSIGNMENT_TYPE_2 || woAssignmentType === ASSIGNMENT_TYPE_8;
        }

        return isFilterVisible;
    }

    _getOptionalFilterItemReturnValue() {
        return 'false';
    }

    _getMandatoryFilterItemReturnValue() {
        return 'true';
    }

    _getCompletedFilterItemReturnValue() {
        return 'true';
    }

    _getOpenFilterItemReturnValue() {
        return 'false';
    }
}
