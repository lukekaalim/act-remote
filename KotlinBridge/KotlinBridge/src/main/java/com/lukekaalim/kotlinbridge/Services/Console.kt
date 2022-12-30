package com.lukekaalim.kotlinbridge.Services

import com.whl.quickjs.wrapper.JSObject
import com.whl.quickjs.wrapper.QuickJSContext

class Console {
    fun createServiceObject(context: QuickJSContext): JSObject {
        val obj = context.createNewJSObject();

        obj.setProperty("log", fun (arguments): Any? {
            val message = arguments[0];
            print(message);
            return null;
        });

        return obj;
    }
}