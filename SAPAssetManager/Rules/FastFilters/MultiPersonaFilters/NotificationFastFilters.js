import FastFilters from '../FastFilters';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { FAST_FILTERS } from '../FastFilters';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import FastFiltersHelper from '../FastFiltersHelper';
import { EMERGENCY_FILTER_GROUP } from '../FastFilters';

const NOTIFICATION_FAST_FILTERS = {
    'MINOR': 'FILTER_MINOR',
    'CREATED_BY_ME': 'FILTER_CREATED_BY_ME',
};

export default class NotificationFastFilters extends FastFilters {

    constructor(context) {
        const config = {
            'modifiedFilterQuery': '',
        };
        const filterPageName = 'NotificationFilterPage';
        const listPageName = 'NotificationsListViewPage';
        super(context, filterPageName, listPageName, config);

        this.setNewFilterCaption(NOTIFICATION_FAST_FILTERS.CREATED_BY_ME, context.localizeText('my_notifications_filter'));
        this.setNewFilterCaption(NOTIFICATION_FAST_FILTERS.MINOR, context.localizeText('minor_work_filter'));
    }

    getFastFilters(context) {
        return [
            { name: NOTIFICATION_FAST_FILTERS.CREATED_BY_ME, value: this._getCreatedByMeFilterItemReturnValue(context), visible: this.isCreatedByMeFilterVisible(context) },
            { name: NOTIFICATION_FAST_FILTERS.MINOR, value: this._getMinorFilterItemReturnValue(), group: EMERGENCY_FILTER_GROUP, visible: this.isMinorFilterVisible(context) },
            { name: FAST_FILTERS.EMERGENCY, value: this._getEmergencyFilterItemReturnValue(), group: EMERGENCY_FILTER_GROUP, visible: this.isEmergencyFilterVisible(context) },
            { name: FAST_FILTERS.MODIFIED, value: this._getPendingFilterItemReturnValue(), visible: this.isModifiedFilterVisible(context) },
        ];
    }

    resetClientData(context) {
        super.resetClientData(context);
        let clientData = this.getClientData(context);

        //CREATED_BY_ME
        clientData.CreatedByMe = false;
    }

    // sets values from the fast filter to the modal filter page
    setFastFilterValuesToFilterPage(context) {
        let fastFilters = FastFiltersHelper.getAppliedFastFiltersFromContext(context);

        fastFilters.forEach(filter => {
            filter.filterItems.forEach(filterValue => {
                switch (filterValue) {
                    case this._getCreatedByMeFilterItemReturnValue(context): {
                        if (this.isCreatedByMeFilterVisible(context)) {
                            let clientData = this.getClientData(context);
                            clientData.CreatedByMe = true;
                        }
                        break;
                    }
                    default:
                        break;
                }
            });
        });

        super.setFastFilterValuesToFilterPage(context);
    }

    // sets values from the modal filter page to the fast filter
    getFastFilterValuesFromFilterPage(context) {
        let filterResults = super.getFastFilterValuesFromFilterPage(context);
        let clientData = this.getClientData(context);

        if (this.isCreatedByMeFilterVisible(context) && clientData.CreatedByMe) {
            filterResults.push(FastFiltersHelper.getFastFilterCriteria(context, this.getFilterCaption(NOTIFICATION_FAST_FILTERS.CREATED_BY_ME), [this._getCreatedByMeFilterItemReturnValue(context)]));
            clientData.CreatedByMe = false;
        }

        return filterResults;
    }

    isCreatedByMeFilterVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isFieldServiceTechnician(context);
    }

    isMinorFilterVisible(context) {
        let isValidPersona = PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isFieldServiceTechnician(context);
        return IsPhaseModelEnabled(context) && isValidPersona;
    }

    isEmergencyFilterVisible(context) {
        let isValidPersona = PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isFieldServiceTechnician(context);
        return IsPhaseModelEnabled(context) && isValidPersona;
    }

    isModifiedFilterVisible(context) {
        return PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isFieldServiceTechnician(context);
    }

    _getCreatedByMeFilterItemReturnValue(context) {
        const userName = CommonLibrary.getSapUserName(context);
        const started = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue();
        return `ReportedBy eq '${userName}' or NotifMobileStatus_Nav/MobileStatus eq '${started}'`;
    }

    _getMinorFilterItemReturnValue() {
        return 'sap.entityexists(NotificationProcessingContext_Nav) and NotifProcessingContext eq \'02\'';
    }

    _getEmergencyFilterItemReturnValue() {
        return 'sap.entityexists(NotificationProcessingContext_Nav) and NotifProcessingContext eq \'01\'';
    }

    _getPendingFilterItemReturnValue() {
        return this.config.modifiedFilterQuery ? this.config.modifiedFilterQuery + ' or sap.hasPendingChanges()' : 'sap.hasPendingChanges()';
    }
}
