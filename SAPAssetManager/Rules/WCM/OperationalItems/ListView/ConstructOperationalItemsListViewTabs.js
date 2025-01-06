import CommonLibrary from '../../../Common/Library/CommonLibrary';
import AssignedToLibrary from '../../Common/AssignedToLibrary';
import REUSABLE_FAST_FILTERS from '../../Common/ReusableFastFilters';

const FastFilterFragments = Object.freeze({
    Electrical: {
        '_Name': 'ElectricalOpGroup',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'OpGroup',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/OperationalItems/ListView/ElectricalOpGroupText.js',
        'ReturnValue': '/SAPAssetManager/Globals/WCM/OperationalGroups/Electrical.global',
    },
    Mechanical: {
        '_Name': 'MechanicalOpGroup',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'OpGroup',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/OperationalItems/ListView/MechanicalOpGroupText.js',
        'ReturnValue': '/SAPAssetManager/Globals/WCM/OperationalGroups/Mechanical.global',
    },
    InitialStatus: {
        '_Name': 'InitialStatus',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'PMMobileStatus/MobileStatus',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/Common/MobileStatusTexts/MobileStatusInitialStatusText.js',
        'ReturnValue': '/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/InitialStatusParameterName.global',
    },
    TagPrinted: {
        '_Name': 'TagPrinted',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'PMMobileStatus/MobileStatus',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/Common/MobileStatusTexts/MobileStatusTagPrintedText.js',
        'ReturnValue': '/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TagPrintedParameterName.global',
    },
    Untag: {
        '_Name': 'Untag',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'PMMobileStatus/MobileStatus',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/Common/MobileStatusTexts/MobileStatusUntagText.js',
        'ReturnValue': '/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/UntagParameterName.global',
    },
    Tag: {
        '_Name': 'Tag',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'PMMobileStatus/MobileStatus',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/Common/MobileStatusTexts/MobileStatusTagText.js',
        'ReturnValue': '/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TagParameterName.global',
    },
    Tagged: {
        '_Name': 'Tagged',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'PMMobileStatus/MobileStatus',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/Common/MobileStatusTexts/MobileStatusTaggedText.js',
        'ReturnValue': '/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TaggedParameterName.global',
    },
});


// map the tab captions to the quickfilters
export const OpItemsSubPageFastFilters = Object.freeze({
    all_items: [FastFilterFragments.Electrical, FastFilterFragments.Mechanical, FastFilterFragments.TagPrinted, FastFilterFragments.Untag],
    tagging: [FastFilterFragments.Electrical, FastFilterFragments.Mechanical, FastFilterFragments.InitialStatus, FastFilterFragments.Tag, FastFilterFragments.TagPrinted],
    untagging: [FastFilterFragments.Electrical, FastFilterFragments.Mechanical, FastFilterFragments.Untag, FastFilterFragments.Tagged],
});



/** @param {IPageProxy} context */
export default function ConstructOperationalItemsListViewTabs(context) {
    const assignments = CommonLibrary.getWCMDocumentAssignmentTypes(context);
    const isSelectionVariantSelected = AssignedToLibrary.IsAssignedToVisibleByAssignmentsSVOperationalItem(assignments);
    const isPartnerSelected = AssignedToLibrary.IsAssignedToVisibleByAssignmentsPartnerOperationalItem(assignments);
    let filters = [];
    if (isSelectionVariantSelected) {
        filters = [
            {
                ...REUSABLE_FAST_FILTERS.ASSIGNED_TO_ME,
                ReturnValue: OperationalItemSelVarAssignedToMeFilterTerm(),
            },
        ];
    } else if (isPartnerSelected) {
        filters = [
            {
                ...REUSABLE_FAST_FILTERS.ASSIGNED_TO_ME,
                ReturnValue: OperationalItemPartnerAssignedToMeFilterTerm(),
            },
        ];
    }
    return Object.entries(OpItemsSubPageFastFilters).map(([caption, fastfilters]) => {
        return {
            '_Name': `${caption}`,
            'Caption': context.localizeText(caption),
            'PageMetadata': GetTab([...filters, ...fastfilters], caption),
            'OnPress': '/SAPAssetManager/Rules/WCM/OperationalItems/ListView/TabPageOnPressed.js',
            '_Type': 'Control.Type.TabItem',
        };
    });
}

export function OperationalItemPartnerAssignedToMeFilterTerm() {
    return AssignedToLibrary.GetAssignedToMeReturnValue('WCMDocumentHeaders/WCMDocumentPartners');
}

export function OperationalItemSelVarAssignedToMeFilterTerm() {
    return "IsSelVar ne ''";
}

function GetTab(fastFilters, pageName) {  // fragments don't work here (only in page files)
    return {
        'Caption': pageName,
        'OnLoaded': '/SAPAssetManager/Rules/WCM/OperationalItems/ListView/TabPageOnLoaded.js',
        'Controls': [
            {
                'Sections': [
                    {
                        'EmptySection': {
                            'Caption': '$(L,no_operational_items_available)',
                        },
                        'Header': {
                            'UseTopPadding': false,
                        },
                        'ObjectCell': {
                            '_Type': 'Control.Type.ObjectCell',
                            'PreserveIconStackSpacing': true,
                            'AccessoryType': 'disclosureIndicator',
                            'Title': '/SAPAssetManager/Rules/WCM/OperationalItems/OperationaItemSequenceDescriptionObjectId.js',
                            'Subhead': '/SAPAssetManager/Rules/WCM/OperationalItems/ListView/OperationalItemsTagNumber.js',
                            'Footnote': '/SAPAssetManager/Rules/WCM/OperationalItems/ListView/OperationalItemsFootnote.js',
                            'StatusText': '/SAPAssetManager/Rules/WCM/OperationalItems/OperationalItemsStatus.js',
                            'Icons': '/SAPAssetManager/Rules/WCM/OperationalItems/ListView/OperationalItemsIcons.js',
                            'Description': '/SAPAssetManager/Rules/WCM/OperationalItems/ListView/OperationalTaggingUntaggingSequence.js',
                            'OnPress': '/SAPAssetManager/Rules/WCM/OperationalItems/Details/OperationalItemDetailsNav.js',
                        },
                        'Search': {
                            'Enabled': true,
                            'Delay': 500,
                            'MinimumCharacterThreshold': 3,
                            'Placeholder': '$(L,search)',
                            'BarcodeScanner': true,
                        },
                        'Target': {
                            'EntitySet': '/SAPAssetManager/Rules/WCM/OperationalItems/ListView/OperationalItemsListViewEntitySet.js',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': '/SAPAssetManager/Rules/WCM/OperationalItems/ListView/OperationalItemsListViewQueryOptions.js',
                        },
                        '_Name': `${pageName}_ObjectTable`,
                        '_Type': 'Section.Type.ObjectTable',
                    },
                ],
                'FilterFeedbackBar': {
                    '_Type': 'Control.Type.FilterFeedbackBar',
                    '_Name': 'FilterFeedback',
                    'ShowAllFilters': true,
                    'FastFilters': fastFilters,
                },
                'Filters': '/SAPAssetManager/Rules/WCM/OperationalItems/ListView/OperationalItemsTabPreFilters.js',
                '_Name': 'SectionedTable',
                '_Type': 'Control.Type.SectionedTable',
            },
        ],
        '_Name': pageName,
        '_Type': 'Page',
    };
}
