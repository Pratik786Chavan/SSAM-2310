import FastFiltersHelper from './FastFiltersHelper';
import CommonLibrary from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import FastFilters from './FastFilters';

export const STATUS_FILTER_GROUP = 'status';

export const STATUS_FAST_FILTERS = {
    'STATUS_STARTED': 'FILTER_STATUS_STARTED',
    'STATUS_COMPLETED': 'FILTER_STATUS_COMPLETED',
    'STATUS_IN_PROCESS': 'FILTER_STATUS_IN_PROCESS',
    'STATUS_OPEN': 'FILTER_STATUS_OPEN',
    'STATUS_MT_OPEN': 'FILTER_STATUS_MT_OPEN',
    'STATUS_CONFIRMED': 'FILTER_STATUS_CONFIRMED',
    'STATUS_UNCONFIRMED': 'FILTER_STATUS_UNCONFIRMED',
};

// extends FastFilters by statuses filtering
export default class FastFiltersWithStatuses extends FastFilters {

    constructor(context, filterPageName, listPageName, config = {}) {
        super(context, filterPageName, listPageName, config);

        this.HOLD = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
        this.STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        this.COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_STARTED, context.localizeText('kpi_in_progress'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_COMPLETED, context.localizeText('completed'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_IN_PROCESS, context.localizeText('in_process'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_OPEN, context.localizeText('open'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_MT_OPEN, context.localizeText('open'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_CONFIRMED, context.localizeText('confirmed_filter'));
        this.setNewFilterCaption(STATUS_FAST_FILTERS.STATUS_UNCONFIRMED, context.localizeText('unconfirmed_filter'));
    }

    resetClientData(context) {
        super.resetClientData(context);
        let clientData = this.getClientData(context);

        //STATUS_IN_PROCESS
        clientData.inProcessStatusFilter = false;

        //STATUS_OPEN
        clientData.openStatusFilter = false;
    }

    // extends FastFilters method
    // sets up values from status fast filters
    setFastFilterValuesToFilterPage(context) {
        let fastFilters = FastFiltersHelper.getAppliedFastFiltersFromContext(context);
        let selectedStatuses = [];
        let clientData = this.getClientData(context);

        fastFilters.forEach(filter => {
            filter.filterItems.forEach(filterValue => {
                switch (filterValue) {
                    case this._getStartedFilterItemReturnValue(): {
                        if (this.isStatusFilterVisible(context)) {
                            selectedStatuses.push(this.STARTED, this.HOLD);
                        }
                        break;
                    }
                    case this._getCompletedFilterItemReturnValue(): {
                        if (this.isStatusFilterVisible(context)) {
                            selectedStatuses.push(this.COMPLETED);
                        }
                        break;
                    }
                    case this._getOpenFilterItemReturnValue(): {
                        if (this.isStatusFilterVisible(context)) {
                            clientData.openStatusFilter = true;
                        }
                        break;
                    }
                    case this._getOpenMTFilterItemReturnValue(): {
                        if (this.isStatusFilterVisible(context)) {
                            clientData.openMTStatusFilter = true;
                        }
                        break;
                    }
                    case this._getInProcessFilterItemReturnValue(): {
                        if (this.isStatusFilterVisible(context)) {
                            clientData.inProcessStatusFilter = true;
                        }
                        break;
                    }
                    default:
                        break;
                }
            });
        });

        this._setStatusesFastFilterValuesToFilterPage(context, selectedStatuses);

        super.setFastFilterValuesToFilterPage(context);
    }

    // extends FastFilters method
    // handles values for status fast filters from the filter page
    getFastFilterValuesFromFilterPage(context, mobileStatusesResult = []) {
        let filterResults = super.getFastFilterValuesFromFilterPage(context);
        let clientData = this.getClientData(context);

        if (this.isStatusFilterVisible(context)) {
            if (mobileStatusesResult.length) {
                if (mobileStatusesResult.includes(this.STARTED) && mobileStatusesResult.includes(this.HOLD)) {
                    let startedStatusIndex = mobileStatusesResult.indexOf(this.STARTED);
                    mobileStatusesResult.splice(startedStatusIndex, 1);
                    let holdStatusIndex = mobileStatusesResult.indexOf(this.HOLD);
                    mobileStatusesResult.splice(holdStatusIndex, 1);
                    filterResults.push(FastFiltersHelper.getFastFilterCriteria(context, this.getFilterCaption(STATUS_FAST_FILTERS.STATUS_STARTED), [this._getStartedFilterItemReturnValue()]));
                }
                if (mobileStatusesResult.includes(this.COMPLETED)) {
                    let completedStatusIndex = mobileStatusesResult.indexOf(this.COMPLETED);
                    mobileStatusesResult.splice(completedStatusIndex, 1);
                    filterResults.push(FastFiltersHelper.getFastFilterCriteria(context, this.getFilterCaption(STATUS_FAST_FILTERS.STATUS_COMPLETED), [this._getCompletedFilterItemReturnValue()]));
                }
            }

            if (clientData.inProcessStatusFilter) {
                filterResults.push(FastFiltersHelper.getFastFilterCriteria(context, this.getFilterCaption(STATUS_FAST_FILTERS.STATUS_IN_PROCESS), [this._getInProcessFilterItemReturnValue()]));
                clientData.inProcessStatusFilter = false;
            }

            if (clientData.openStatusFilter) {
                filterResults.push(FastFiltersHelper.getFastFilterCriteria(context, this.getFilterCaption(STATUS_FAST_FILTERS.STATUS_OPEN), [this._getOpenFilterItemReturnValue()]));
                clientData.openStatusFilter = false;
            }
        }

        return filterResults;
    }

    _setStatusesFastFilterValuesToFilterPage(context, fastFilterSelectedStatuses) {
        if (!fastFilterSelectedStatuses.length) {
            return;
        }
        let mobileStatusControl = context.evaluateTargetPath(`#Page:${this.filterPageName}/#Control:MobileStatusFilter`);
        if (mobileStatusControl.type === 'Control.Type.FormCell.ListPicker') {
            this._setStatusesFastFilterValuesToFilterPageListPicker(mobileStatusControl, fastFilterSelectedStatuses);
        } else {
            this._setStatusesFastFilterValuesToFilterPageFormCell(mobileStatusControl, fastFilterSelectedStatuses);
        }
    }

    _setStatusesFastFilterValuesToFilterPageListPicker(mobileStatusControl, fastFilterSelectedStatuses) {
        const statuses = mobileStatusControl.getValue().map(f => f.ReturnValue) || [];
        mobileStatusControl.setValue(statuses.concat(fastFilterSelectedStatuses.filter(status => !statuses.includes(status))));
    }

    _setStatusesFastFilterValuesToFilterPageFormCell(mobileStatusControl, fastFilterSelectedStatuses) {
        const statuses = mobileStatusControl.getValue().filterItems || [];
        mobileStatusControl.observable().updateSelectedValues(statuses.concat(fastFilterSelectedStatuses.filter(status => !statuses.includes(status))));
    }

    isStatusFilterVisible() {
        Logger.info('FastFilters', 'isStatusFilterVisible is not implemented');
        return false;
    }

    isConfirmedStatusFilterVisible() {
        Logger.info('FastFilters', 'isConfirmedStatusFilterVisible is not implemented');
        return false;
    }

    _getStartedFilterItemReturnValue() {
        return `${this.config.statusPropertyPath} eq '${this.STARTED}' or ${this.config.statusPropertyPath} eq '${this.HOLD}'`;
    }

    _getOpenMTFilterItemReturnValue() {
        return `(${this.config.statusPropertyPath} ne '${this.STARTED}' and ${this.config.statusPropertyPath} ne '${this.HOLD}' and ${this.config.statusPropertyPath} ne '${this.COMPLETED}')`;
    }

    _getCompletedFilterItemReturnValue() {
        return `${this.config.statusPropertyPath} eq '${this.COMPLETED}'`;
    }

    _getInProcessFilterItemReturnValue() {
        Logger.info('FastFilters', '_getInProcessFilterItemReturnValue is not implemented');
        return 'false';
    }

    _getOpenFilterItemReturnValue() {
        Logger.info('FastFilters', '_getOpenFilterItemReturnValue is not implemented');
        return 'false';
    }

    _getConfirmedFilterItemReturnValue() {
        let query = this.config.confirmedFilterQuery;
        return query ? query : 'false';
    }

    _getUnconfirmedFilterItemReturnValue() {
        let query = this.config.confirmedFilterQuery;
        return query ? 'not (' + query + ')' : 'true';
    }
}
