package com.lukekaalim.kotlinbridge.Services

import com.whl.quickjs.wrapper.JSFunction
import com.whl.quickjs.wrapper.JSObject
import com.whl.quickjs.wrapper.QuickJSContext

public class Timeout {
    fun createServiceObject(context: QuickJSContext): JSObject {
        val obj = context.createNewJSObject();

        obj.setProperty("setTimeout", fun (arguments): Any? {
            val callback = arguments[0];
            val time = arguments[1];
            return null;
        });

        return obj;
    }
}