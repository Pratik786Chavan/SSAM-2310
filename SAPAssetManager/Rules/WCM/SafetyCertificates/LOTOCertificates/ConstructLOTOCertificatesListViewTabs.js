import REUSABLE_FAST_FILTERS from '../../Common/ReusableFastFilters';
import libAssignedTo from '../../Common/AssignedToLibrary';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

const FastFilterFragments = Object.freeze({
    VeryHigh: REUSABLE_FAST_FILTERS.VERY_HIGH_PRIORITY,
    InitialStatus: {
        '_Name': 'InitialStatus',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'ActualSystemStatus',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/Common/SystemStatusTexts/InitialStatusText.js',
        'ReturnValue': '/SAPAssetManager/Globals/SystemStatuses/InitialStatus.global',
    },
    TagPrinted: REUSABLE_FAST_FILTERS.TAG_PRINTED,
    Untag: REUSABLE_FAST_FILTERS.UNTAG,
    Tag: {
        '_Name': 'Tag',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'ActualSystemStatus',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/Common/SystemStatusTexts/TagStatusText.js',
        'ReturnValue': '/SAPAssetManager/Globals/SystemStatuses/Tag.global',
    },
    Tagged: {
        '_Name': 'Tagged',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'ActualSystemStatus',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/Common/SystemStatusTexts/TaggedStatusText.js',
        'ReturnValue': '/SAPAssetManager/Globals/SystemStatuses/Tagged.global',
    },
    Approved: REUSABLE_FAST_FILTERS.APPROVED,
    AssignedToMe: REUSABLE_FAST_FILTERS.ASSIGNED_TO_ME,
});

// map the tab captions to the quickfilters
export const IsolationCertificatesSubPageFastFilters = Object.freeze({
    all_items: [FastFilterFragments.VeryHigh, FastFilterFragments.TagPrinted, FastFilterFragments.Untag, FastFilterFragments.Approved],
    tagging: [FastFilterFragments.VeryHigh, FastFilterFragments.InitialStatus, FastFilterFragments.Tag, FastFilterFragments.TagPrinted, FastFilterFragments.Approved],
    untagging: [FastFilterFragments.VeryHigh, FastFilterFragments.Tagged, FastFilterFragments.Untag, FastFilterFragments.Approved],
});

const IsolationCertificatesSubPageObjectCellDescriptions = Object.freeze({
    all_items: '/SAPAssetManager/Rules/WCM/SafetyCertificates/LOTOCertificates/OperationalItemsAll.js',
    tagging: '/SAPAssetManager/Rules/WCM/SafetyCertificates/LOTOCertificates/OperationalItemsTaggedAll.js',
    untagging: '/SAPAssetManager/Rules/WCM/SafetyCertificates/LOTOCertificates/OperationalItemsUntaggedAll.js',
});

/** @param {IPageProxy} context  */
export default function ConstructLOTOCertificatesListViewTabs(context) {
    return Object.entries(IsolationCertificatesSubPageFastFilters).map(([caption, fastfilters]) => {
        const isPartnerEnabled = libAssignedTo.IsAssignedToVisibleByAssignmentsCertificate(CommonLibrary.getWCMDocumentAssignmentTypes(context));
        const filters = (isPartnerEnabled ? [
            {
                ...FastFilterFragments.AssignedToMe,
                ReturnValue: libAssignedTo.GetAssignedToMeReturnValue('WCMDocumentPartners'),
            },
        ] : []).concat(...fastfilters);

        return {
            '_Name': `${caption}`,
            'Caption': context.localizeText(caption),
            'PageMetadata': GetTab(filters, caption, IsolationCertificatesSubPageObjectCellDescriptions[caption]),
            'OnPress': '/SAPAssetManager/Rules/WCM/SafetyCertificates/LOTOCertificates/TabPageOnPressed.js',
            '_Type': 'Control.Type.TabItem',
        };
    });
}

function GetTab(fastfilters, caption, objcellDescription) {
    return {
        'Caption': caption,
        'OnLoaded': '/SAPAssetManager/Rules/WCM/SafetyCertificates/LOTOCertificates/TabPageOnLoaded.js',
        'Controls': [
            {
                'Sections': [
                    {
                        'Search': {
                            'Enabled': true,
                            'Delay': 500,
                            'MinimumCharacterThreshold': 3,
                            'Placeholder': '$(L,search)',
                            'BarcodeScanner': true,
                        },
                        'Header': {
                            'UseTopPadding': false,
                        },
                        'ObjectCell': {
                            'AccessoryType': 'disclosureIndicator',
                            'Title': '{ShortText}',
                            'Icons': '/SAPAssetManager/Rules/WCM/SafetyCertificates/SafetyCertificatesIcons.js',
                            'OnPress': '/SAPAssetManager/Rules/WCM/SafetyCertificates/Details/CertificateDetailsNav.js',
                            'PreserveIconStackSpacing': true,
                            'Subhead': '{WCMDocument}',
                            'Footnote': '/SAPAssetManager/Rules/WCM/Common/EquipmentOrFunclocDescriptionOrEmpty.js',
                            'StatusText': '/SAPAssetManager/Rules/WCM/Common/PriorityStatusText.js',
                            'SubstatusText': '/SAPAssetManager/Rules/WCM/Common/SystemStatusText.js',
                            'Description': objcellDescription,
                            'Styles':
                            {
                                'StatusText': '/SAPAssetManager/Rules/Priority/WCMPriorityStatusStyle.js',
                            },
                            '_Type': 'Control.Type.ObjectCell',
                        },
                        'Target': {
                            'EntitySet': '/SAPAssetManager/Rules/WCM/SafetyCertificates/RelatedSafetyCertificates.js',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': '/SAPAssetManager/Rules/WCM/SafetyCertificates/LOTOCertificatesListViewQueryOption.js',
                        },
                        'EmptySection': {
                            'Caption': '$(L,wcm_no_certificates)',
                            'HidesFooter': true,
                        },
                        'Visible': true,
                        '_Name': 'SafetyCertificates',
                        '_Type': 'Section.Type.ObjectTable',
                    },
                ],
                'FilterFeedbackBar': {
                    '_Type': 'Control.Type.FilterFeedbackBar',
                    '_Name': 'FilterFeedback',
                    'ShowAllFilters': true,
                    'FastFilters': fastfilters,
                },
                'Filters': '/SAPAssetManager/Rules/WCM/SafetyCertificates/WCMDocumentHeaderDefaultSort.js',
                '_Type': 'Control.Type.SectionedTable',
                '_Name': 'SectionedTable',
            },
        ],
        '_Type': 'Page',
        '_Name': caption,
    };
}
