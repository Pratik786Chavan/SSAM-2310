import ValidationLibrary from '../../Common/Library/ValidationLibrary';

/**
 * @param {IListPickerFormCellProxy} context
 * @param {string} selectedMovementType
 * @typedef {{ DisplayValue: string, ReturnValue: string }} ListPickerElement
 * @returns {Promise<ListPickerElement[]>}
*/
export default function SpecialStockListPickerItems(context, selectedMovementType = '') {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MovementTypeSpecialStocks', [], `${selectedMovementType ? `$filter=MovementType eq '${selectedMovementType}'` : ''}`)
        .then((/**@type {ObservableArray<MovementTypeSpecialStock>} */ specialStocks) => ValidationLibrary.evalIsEmpty(specialStocks) ? [] : [...new Set(specialStocks.map(item => item.SpecialStock))])
        .then((/**@type {string[]} */ specialStocks) => Promise.all([specialStocks, context.read('/SAPAssetManager/Services/AssetManager.service', 'SpecialStockTexts', [], `$filter=${specialStocks.map(i => `SpecialStock eq '${i}'`).join(' or ')}`)]))
        .then((/**@type {[string[], ObservableArray<SpecialStockText>]} */[specialStocks, texts]) => {
            const textMap = new Map(texts.map((i) => [i.SpecialStock, i.Description]));
            return specialStocks.map(s => ({
                ReturnValue: s,
                DisplayValue: `${s} - ${textMap.get(s) || ''}`,
            }));
        });
}
