package com.lukekaalim.kotlinbridge.Services

import android.util.Log
import com.whl.quickjs.wrapper.JSObject
import com.whl.quickjs.wrapper.QuickJSContext

class Console {
    fun createServiceObject(context: QuickJSContext): JSObject {
        val obj = context.createNewJSObject();

        obj.setProperty("log", fun (arguments): Any? {
            val message = arguments[0] as String;
            Log.i("Console.Log", message);
            return null;
        });

        return obj;
    }
}