package com.lukekaalim.kotlinbridge.Services

import android.content.Context
import android.view.ViewGroup
import com.lukekaalim.actremoteclient.*
import com.whl.quickjs.wrapper.JSFunction
import com.whl.quickjs.wrapper.JSObject
import com.whl.quickjs.wrapper.QuickJSContext
import com.whl.quickjs.wrapper.QuickJSException

class Renderer(val context: Context, private val rootView: ViewGroup) {
    private val renderer = ViewRenderer(context, ::invoke);
    private val invokeSubscribers = mutableSetOf<(payload: InvokePayload) -> Unit>()

    fun invoke(payload: InvokePayload) {
        for (subscriber in invokeSubscribers)
            subscriber(payload);
    }

    fun createServiceObject(context: QuickJSContext): JSObject {
        val obj = context.createNewJSObject();

        obj.setProperty("submitDiff", fun (arg): Nothing? {
            val diff = convertJSObjectToDiff(arg[0] as JSObject);
            val results = renderer.render(diff);
            attachChildren(rootView, results.map { it.node });
            return null;
        });
        obj.setProperty("subscribeCallback", fun (arg): JSObject {
            val callbackFunc = arg[0] as JSFunction;
            callbackFunc.hold();
            val cancelObject = context.createNewJSObject();
            invokeSubscribers.add { payload ->
                var jsArray = context.createNewJSArray();
                for (i in 0 until payload.value.size) {
                    jsArray.set(payload.value[i], i);
                }
                callbackFunc.call(payload.commitId, payload.propName, jsArray)
            }
            cancelObject.setProperty("cancel", fun(_): Nothing? {
                return null;
            });
            return cancelObject;
        });

        return obj;
    }
}