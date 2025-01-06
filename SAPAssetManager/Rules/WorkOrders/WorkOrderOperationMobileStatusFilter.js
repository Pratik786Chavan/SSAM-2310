import libSuper from '../Supervisor/SupervisorLibrary';

export default function WorkOrderOperationMobileStatusFilter(context) {

    if (libSuper.isSupervisorFeatureEnabled(context)) {
        return { name: 'OperationMobileStatus_Nav/MobileStatus', 
                values: [{ReturnValue: 'RECEIVED', DisplayValue: context.localizeText('received'), Name: context.localizeText('received')},
                {ReturnValue: 'STARTED', DisplayValue: context.localizeText('started'), Name: context.localizeText('started')},
                {ReturnValue: 'HOLD', DisplayValue: context.localizeText('hold'), Name: context.localizeText('hold')},
                {ReturnValue: 'TRANSFER', DisplayValue: context.localizeText('transfer'), Name: context.localizeText('transfer')},
                {ReturnValue: 'COMPLETED', DisplayValue: context.localizeText('completed'), Name: context.localizeText('completed')},
                {ReturnValue: 'TRAVEL', DisplayValue: context.localizeText('enroute'), Name: context.localizeText('enroute')},
                {ReturnValue: 'ONSITE', DisplayValue: context.localizeText('onsite'), Name: context.localizeText('onsite')},
                {ReturnValue: 'REVIEW', DisplayValue: context.localizeText('REVIEW'), Name: context.localizeText('REVIEW')},
                {ReturnValue: 'REJECTED', DisplayValue: context.localizeText('REJECTED'), Name: context.localizeText('REJECTED')},
                {ReturnValue: 'APPROVE', DisplayValue: context.localizeText('APPROVE'), Name: context.localizeText('APPROVE')},
                {ReturnValue: 'DISAPPROVE', DisplayValue: context.localizeText('DISAPPROVE'), Name: context.localizeText('DISAPPROVE')}],
                };
    }
    return { name: 'OperationMobileStatus_Nav/MobileStatus', 
            values: [{ReturnValue: 'RECEIVED', DisplayValue: context.localizeText('received'), Name: context.localizeText('received')},
            {ReturnValue: 'STARTED', DisplayValue: context.localizeText('started'), Name: context.localizeText('started')},
            {ReturnValue: 'HOLD', DisplayValue: context.localizeText('hold'), Name: context.localizeText('hold')},
            {ReturnValue: 'TRANSFER', DisplayValue: context.localizeText('transfer'), Name: context.localizeText('transfer')},
            {ReturnValue: 'COMPLETED', DisplayValue: context.localizeText('completed'), Name: context.localizeText('completed')},
            {ReturnValue: 'TRAVEL', DisplayValue: context.localizeText('enroute'), Name: context.localizeText('enroute')},
            {ReturnValue: 'ONSITE', DisplayValue: context.localizeText('onsite'), Name: context.localizeText('onsite')},
            {ReturnValue: 'REJECTED', DisplayValue: context.localizeText('REJECTED'), Name: context.localizeText('REJECTED')}],
            };
}
