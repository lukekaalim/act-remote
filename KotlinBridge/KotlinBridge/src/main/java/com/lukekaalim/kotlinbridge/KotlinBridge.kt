package com.lukekaalim.kotlinbridge

import android.content.res.AssetManager
import android.widget.FrameLayout
import com.whl.quickjs.android.QuickJSLoader
import com.whl.quickjs.wrapper.JSFunction
import com.whl.quickjs.wrapper.QuickJSContext
import java.nio.charset.StandardCharsets

public final class KotlinBridge(bundlePath: String, assets: AssetManager) {
    init {
        QuickJSLoader.init();
    }
    private val context: QuickJSContext = QuickJSContext.create();
    private var main: JSFunction;
    init {
        val stream = assets.open(bundlePath)
        val bytes = stream.use { it.readBytes() }
        val text = String(bytes, StandardCharsets.UTF_8)
        context.globalObject.setProperty("global", context.globalObject)
        context.evaluateModule(text, "main")
        main = context.globalObject.getJSFunction("main")
    }

    public fun run(platform: Platform) {
        main.call(platform.createPlatformObject(context));
    }
}