import common from '../Library/CommonLibrary';
import isRTL from '../IsRTL';

export default class DetailsPageToolbarClass {
    constructor() {
        this._instance = null;
        this._toolbarItems = {};
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    static resetToolbarItems(context) {
       delete this._instance._toolbarItems[common.getPageName(context)];
       if (Object.keys(this._instance._toolbarItems).length === 0) {
            this._instance = null;
        }
    }

    getToolbarItems(context) {
        return this._toolbarItems[common.getPageName(context)] || [];
    }

    generatePossibleToolbarItems(context, items, itemNamePrefix = common.getPageName(context)) {
        if (!common.isDefined(items)) {
            this._toolbarItems[itemNamePrefix] = [];
            return Promise.resolve();
        }

        if (items.length > 3) {
            items.sort((a, b) => {
                let titleA = a.Title.toLowerCase();
                let titleB = b.Title.toLowerCase();

                if (titleA < titleB) {
                    return -1;
                }
                if (titleA > titleB) {
                    return 1;
                }
                return 0;
            });
        }

        let orderedItems = this._reorderItems(context, items);
        if (orderedItems.length && orderedItems.length <= 3 && orderedItems.some(item => item.TransitionType)) { 
            let primaryItem, negativeItem, tertiaryItem, secondaryItem;
            let noTransitionItems = [];
            orderedItems.forEach(item => {
                switch (item.TransitionType) {
                    case 'P' :
                        primaryItem = item;
                        break;
                    case 'T': 
                        tertiaryItem = item;
                        break;
                    case 'S': 
                        secondaryItem = item;
                        break;
                    case 'N': 
                        negativeItem = item;
                        break;
                    default: 
                        noTransitionItems.push(item);
                        break;
                }
            });

            let _items = [undefined, undefined, undefined];
            const primaryIndex = isRTL(context) ? 0 : 2;
            const negativeIndex = isRTL(context) ? 2 : 0;
            const middleIndex = 1;

            if (primaryItem) {
                primaryItem.name = itemNamePrefix + 'TbI' + primaryIndex;
                _items[primaryIndex] = primaryItem;
            }

            if (negativeItem) {
                negativeItem.name = itemNamePrefix + 'TbI' + negativeIndex; 
                _items[negativeIndex] = negativeItem;
            }

            if (tertiaryItem) {
                if (primaryItem) {
                    if (secondaryItem) { 
                        tertiaryItem.name = itemNamePrefix + 'TbI' + negativeIndex; 
                        _items[negativeIndex] = tertiaryItem;
                    } else {
                        tertiaryItem.name = itemNamePrefix + 'TbI' + middleIndex; 
                        _items[middleIndex] = tertiaryItem;
                    }
                } else {
                    tertiaryItem.name = itemNamePrefix + 'TbI' + primaryIndex; 
                    _items[primaryIndex] = tertiaryItem; 
                }
            } 

            if (secondaryItem) {
                if (primaryItem) {
                    secondaryItem.name = itemNamePrefix + 'TbI' + middleIndex; 
                    _items[middleIndex] = secondaryItem;
                } else if (tertiaryItem && !negativeItem) {
                    secondaryItem.name = itemNamePrefix + 'TbI' + negativeIndex; 
                    _items[negativeIndex] = secondaryItem;
                } else if (tertiaryItem && negativeItem) {
                    secondaryItem.name = itemNamePrefix + 'TbI' + middleIndex; 
                    _items[middleIndex] = secondaryItem;
                } else {
                    secondaryItem.name = itemNamePrefix + 'TbI' + primaryIndex; 
                    _items[primaryIndex] = secondaryItem;
                }
            }

            if (noTransitionItems.length) {
                noTransitionItems.forEach(item => {
                    let emptyPlaceIndex = _items.findIndex(namedItem => {
                        return !namedItem;
                    });

                    if (emptyPlaceIndex !== -1 ) {
                        item.name = itemNamePrefix + 'TbI' + emptyPlaceIndex; 
                        _items[emptyPlaceIndex] = item;
                    }
                });
            }

            this._toolbarItems[itemNamePrefix] = orderedItems;
            return Promise.resolve();
        }

        //remove once every backend system uses TransitionType in EAMOverallStatusSeqs
        switch (orderedItems.length) {
            case 1:
                orderedItems[0].name = itemNamePrefix + 'TbI1';
                break;
            case 2:
                orderedItems[0].name = itemNamePrefix + 'TbI0';
                orderedItems[1].name = itemNamePrefix + 'TbI2';
                break;
            case 3:
                orderedItems[0].name = itemNamePrefix + 'TbI0';
                orderedItems[1].name = itemNamePrefix + 'TbI1';
                orderedItems[2].name = itemNamePrefix + 'TbI2';
                break;
            default:
                break;
        }

        this._toolbarItems[itemNamePrefix] = orderedItems;
        return Promise.resolve();
    }

    getToolbarItemVisibility(context, itemName) {
        const pageName = common.getPageName(context);
        if (this._toolbarItems[pageName].length > 3) {
            return this.isCenterButton(itemName); // only show center button for 3+ actions
        } else {
            return this._toolbarItems[pageName].some(item => item.name === itemName);
        }
    }

    getToolbarItemCaption(context, itemName) {
        const pageName = common.getPageName(context);
        if (this._toolbarItems[pageName].length > 3) {
            return this.isCenterButton(itemName) ? context.localizeText('action') : '';
        } else {
            let itemFound = this._toolbarItems[pageName].find(item => item.name === itemName);

            if (common.isDefined(itemFound) && common.isDefined(itemFound.Title)) {
                return itemFound.Title;
            } else {
                return '';
            }
        }
    }

    getToolbarItemOnPressAction(context, itemName) {
        const pageName = common.getPageName(context);
        if (this._toolbarItems[pageName].length > 3) {
            return this.isCenterButton(itemName) ? {
                'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusTransitionPopover.action',
                'Properties': {
                    'PopoverItems' : this._toolbarItems[pageName],
                },
            } : '';
        } else {
            let itemFound = this._toolbarItems[pageName].find(item => item.name === itemName);

            if (common.isDefined(itemFound) && common.isDefined(itemFound.OnPress)) {
                return itemFound.OnPress;
            } else {
                return '';
            }
        }
    }

    isCenterButton(itemName) {
        return itemName.includes('TbI1');
    }

    _reorderItems(context, items) {
        let orderedItems = items || [];

        //Primary action should always be on the right
        //UX: It's easiest for the user to click on the right side action
        if (2 <= orderedItems.length <= 3) {
            const ACCEPTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());
            const STARTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
            const COMPLETE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
            const APPROVE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ApproveParameterName.global').getValue());
            const PrimaryActions = [ACCEPTED, APPROVE, COMPLETE, STARTED];

            let onRight = [];
            orderedItems = orderedItems.filter(item => {
                if (item.Status && PrimaryActions.includes(item.Status)) {
                    onRight.push(item);
                    return false;
                }

                return true;
            });

            orderedItems = orderedItems.concat(onRight);
        }

        return orderedItems;
    }
}
