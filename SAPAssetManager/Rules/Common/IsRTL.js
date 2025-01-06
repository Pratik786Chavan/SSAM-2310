
export default function IsRTL(context) {
    let language = context.getLanguage();
    switch (language) {
        case 'ar':
        case 'he':
            return true;
        default:
            return false;
    }
}
