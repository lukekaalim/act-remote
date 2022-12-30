package com.lukekaalim.kotlinbridge

import com.lukekaalim.kotlinbridge.Services.Console
import com.lukekaalim.kotlinbridge.Services.Renderer
import com.lukekaalim.kotlinbridge.Services.Timeout
import com.whl.quickjs.wrapper.JSObject
import com.whl.quickjs.wrapper.QuickJSContext

class BasicPlatform: Platform {
    val renderer = Renderer();
    val console = Console();
    val timeout = Timeout();

    override fun createPlatformObject(context: QuickJSContext): JSObject {
        val obj = context.createNewJSObject();
        obj.setProperty("renderer", renderer.createServiceObject(context));
        obj.setProperty("console", console.createServiceObject(context));
        obj.setProperty("timeout", timeout.createServiceObject(context));
        return obj;
    }
}