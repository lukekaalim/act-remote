package com.lukekaalim.kotlinbridge.Services

import android.util.Log
import com.whl.quickjs.wrapper.JSObject
import com.whl.quickjs.wrapper.QuickJSContext

class Device {
    fun createServiceObject(context: QuickJSContext): JSObject {
        val obj = context.createNewJSObject();

        obj.setProperty("platformFamilyType", "android");

        return obj;
    }
}