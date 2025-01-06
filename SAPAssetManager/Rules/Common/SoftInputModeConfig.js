
export default function SoftInputModeConfig(context) {
    if (context.nativescript.platformModule.isAndroid) {
        if (context._page && context._page._context) {
            // eslint-disable-next-line no-undef
            context._page._context.getWindow().setSoftInputMode(android.view.WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
        }
    }
}
