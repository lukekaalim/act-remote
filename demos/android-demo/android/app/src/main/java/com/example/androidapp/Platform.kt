package com.example.androidapp

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.View
import android.view.ViewGroup
import com.example.androidapp.act.ManagedRenderer
import com.example.androidapp.act.attachChildren
import com.example.androidapp.act.serializable.InvokePayload
import com.example.androidapp.act.serializable.convertJSObjectToDiff
import com.whl.quickjs.wrapper.JSFunction
import com.whl.quickjs.wrapper.JSObject
import com.whl.quickjs.wrapper.QuickJSContext
import java.util.*
import kotlin.concurrent.timerTask

fun CreatePlatformJSObject(
    context: QuickJSContext,
    renderer: ManagedRenderer<View>,
    parent: ViewGroup,
    subscribeInvoke: (subscriber: (payload: InvokePayload) -> Unit) -> Unit
): JSObject {
    var platform = context.createNewJSObject();
    platform.setProperty("log", fun (v) = Log.i("Platform", v[0] as String))
    platform.setProperty("onDiff", fun (args): String {
        var diff = convertJSObjectToDiff(args[0] as JSObject)

        var result = renderer.render(diff);
        attachChildren(parent, result.map(fun (r) = r.node));

        return "OK";
    })
    var timer = Timer();
    platform.setProperty("setTimeout", fun (args): Double {
        var callback = args[0] as JSFunction;
        var duration = (args[1] as Number).toLong();
        callback.hold();

        timer.schedule(timerTask {
            val mainHandler = Handler(Looper.getMainLooper())
            var myRunnable = Runnable() {
                run() {
                    callback.call();
                    callback.release();
                }
            };
            mainHandler.post(myRunnable);
        }, duration);

        return 1.0;
    });
    platform.setProperty("cancelTimeout", fun (_): Nothing? = null)
    platform.setProperty("subscribeInvoke", fun (args): String {
        var jsFunction = args[0] as JSFunction;
        jsFunction.hold();
        fun subscriber (payload: InvokePayload) {
            var jsArray = context.createNewJSArray();
            //jsArray.hold();
            //jsArray
            for (i in 0 until payload.value.size);
                jsArray.set(0, 0);
            //jsFunction.call(payload.commitId, payload.propName, jsArray);
            //jsArray.release();
        }
        subscribeInvoke(::subscriber);
        return "OK";
    })

    return platform
}