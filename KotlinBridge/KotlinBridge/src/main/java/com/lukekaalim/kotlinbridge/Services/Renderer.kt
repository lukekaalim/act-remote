package com.lukekaalim.kotlinbridge.Services

import com.lukekaalim.actremoteclient.ViewRenderer
import com.whl.quickjs.wrapper.JSObject
import com.whl.quickjs.wrapper.QuickJSContext

class Renderer {
    val renderer = ViewRenderer();

    fun createServiceObject(context: QuickJSContext): JSObject {
        val obj = context.createNewJSObject();

        obj.setProperty("submitDiff", fun (arg): String {
            return "aaa";
        });
        obj.setProperty("subscribeCallback", fun (arg): JSObject {
            val cancelObject = context.createNewJSObject();
            cancelObject.setProperty("cancel", fun(arg): Nothing? {
                return null;
            });
            return cancelObject;
        });

        return obj;
    }
}