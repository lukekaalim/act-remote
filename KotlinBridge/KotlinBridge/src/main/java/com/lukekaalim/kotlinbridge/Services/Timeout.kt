package com.lukekaalim.kotlinbridge.Services

import android.os.Handler
import android.os.Looper
import com.whl.quickjs.wrapper.JSFunction
import com.whl.quickjs.wrapper.JSObject
import com.whl.quickjs.wrapper.QuickJSContext
import java.util.*
import kotlin.concurrent.timerTask

public class Timeout {
    private val timer = Timer();
    private val mainHandler = Handler(Looper.getMainLooper())

    fun createServiceObject(context: QuickJSContext): JSObject {
        val obj = context.createNewJSObject();

        obj.setProperty("setTimeout", fun (args): Any? {
            val callback = args[0] as JSFunction;
            var duration = (args[1] as Number).toLong();
            callback.hold();

            timer.schedule(timerTask {
                var myRunnable = Runnable() {
                    run() {
                        callback.call();
                        callback.release();
                    }
                };
                mainHandler.post(myRunnable);
            }, duration);

            return null;
        });

        return obj;
    }
}