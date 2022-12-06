package com.example.act_native_demo

import com.whl.quickjs.wrapper.JSModule

class QuickJSResourceLoader : JSModule.Loader {
    override fun getModuleScript(moduleName: String?): String {
        return "export const hello = \"World\""
    }
}