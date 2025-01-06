import { getMaterialListPickerConfig } from './MaterialListPickerEntitySet';

export default function MaterialListPickerQueryOptions(context) {
    let data = context.binding;
    return getMaterialListPickerConfig(data).queryOptions;
}
