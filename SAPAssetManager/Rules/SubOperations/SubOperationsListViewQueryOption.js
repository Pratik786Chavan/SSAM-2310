import CommonLibrary from '../Common/Library/CommonLibrary';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import WorkOrderSubOperationListViewCaption from '../WorkOrders/SubOperations/CreateUpdate/WorkOrderSubOperationListViewCaption';

export default function SubOperationsListViewQueryOption(context) {
	const currentPageName = CommonLibrary.getPageName(context);
	if (currentPageName === 'SubOperationsListViewPage') {
		WorkOrderSubOperationListViewCaption(context.getPageProxy());
	}

	let query = '$expand=SubOpMobileStatus_Nav,SubOperationLongText,WorkOrderOperation,WorkOrderOperation/OperationMobileStatus_Nav,WorkOrderOperation/WOHeader,WorkOrderOperation/WOHeader/OrderMobileStatus_Nav,WorkOrderOperation/WOHeader/UserTimeEntry_Nav,WorkOrderOperation/UserTimeEntry_Nav&$orderby=OrderId,OperationNo,SubOperationNo';

	if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
		let insertMeterExpands = function(queryOptions) {
			let expands = 'WorkOrderOperation/WOHeader/OrderISULinks,WorkOrderOperation/WOHeader/DisconnectActivity_Nav,';
			if (queryOptions.indexOf('$expand=') >= 0) {
				let expandIndex = queryOptions.indexOf('$expand=');
				let beforeExpand = queryOptions.substring(0, expandIndex);
				let afterExpand = queryOptions.substring(expandIndex + 8);
				return beforeExpand + '$expand=' + expands + afterExpand;
			} else {
				return queryOptions + expands;
			}
		};

		let searchString = context.searchString;
		let clockedInString = context.localizeText('clocked_in').substring('Clocked In');
		let lowercaseClockedInString = context.localizeText('clocked_in_lowercase').substring('clocked in');

		if ((searchString !== '') && (searchString === clockedInString) || (searchString === lowercaseClockedInString)) {
			let queryBuilder = context.dataQueryBuilder();
			return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserTimeEntries', ['PreferenceGroup','OrderId','OperationNo','WOHeader_Nav/ObjectKey','WOOperation_Nav/ObjectKey'], '$orderby=PreferenceValue desc&$top=1&$expand=WOHeader_Nav,WOOperation_Nav').then(function(results) {
				if (results && results.length > 0) {
					let row = results.getItem(0);
					if (row.PreferenceGroup === 'CLOCK_IN') {
						queryBuilder.expand('UserTimeEntry_Nav');
						queryBuilder.filter(`OrderId eq '${row.OrderId}'`);
						return queryBuilder;
					}
					return queryBuilder('');
				}
				return queryBuilder('');
			}).catch(() => {
				return queryBuilder(''); //Read failure so return a blank string
			});
		} else {
			return insertMeterExpands(query);
		}
	} else {
		return query;
	}
}
