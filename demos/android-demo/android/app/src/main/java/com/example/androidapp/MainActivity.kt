package com.example.androidapp

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.fragment.app.FragmentActivity
import com.example.androidapp.act.ManagedRenderer
import com.example.androidapp.act.serializable.FunctionProp
import com.example.androidapp.act.serializable.InvokePayload
import com.example.androidapp.act.serializable.JSONProp
import com.example.androidapp.act.serializable.convertJSObjectToDiff
import com.whl.quickjs.android.QuickJSLoader
import com.whl.quickjs.wrapper.JSFunction
import com.whl.quickjs.wrapper.JSModule.Loader
import com.whl.quickjs.wrapper.JSObject
import com.whl.quickjs.wrapper.QuickJSContext
import java.nio.charset.StandardCharsets
import java.util.*
import kotlin.concurrent.timerTask


class MainActivity : FragmentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        var stream = assets.open("dist/bundle.js");
        var bytes = stream.use { it.readBytes() };
        val text = String(bytes, StandardCharsets.UTF_8)

        QuickJSLoader.init();
        var context = QuickJSContext.create();
        context.globalObject.setProperty("global", context.globalObject);

        context.evaluateModule(text, "main");
        var main = context.globalObject.getJSFunction("main");

        fun attachChildren (parent: ViewGroup, children: List<View>) {
            parent.removeAllViews();
            for (child in children)
                parent.addView(child);
        }

        var parent = LinearLayout(this);
        parent.orientation = LinearLayout.VERTICAL;
        val invokeSubscribers = mutableSetOf<(payload: InvokePayload) -> Unit>();
        fun invoke(payload: InvokePayload) {
            for (subscriber in invokeSubscribers)
                subscriber(payload);
        }

        var renderer = ManagedRenderer<View>(ManagedRenderer.Options<View>(
            add = fun (_, element): View? {
                return when (val name = element.name) {
                    "android:linear_layout" -> LinearLayout(this);
                    "android:text" -> TextView(this);
                    "android:button" -> Button(this);
                    else -> TextView(this);
                }
            },
            update = fun (diff, view, children) {
                if (view is ViewGroup) {
                    attachChildren(view, children.map { it.node });
                }
                if (view is TextView) {
                    var prop = diff.next.element.props["content"];
                    if (prop != null && prop is JSONProp)
                        view.text = prop.value as? String ?: "";
                }
                if (view is Button) {
                    var onClick = diff.next.element.props["onClick"];
                    if (onClick is FunctionProp)
                        view.setOnClickListener {
                            invoke(InvokePayload(diff.next.id, "onClick", listOf("YES")))
                        }
                }
            },
            delete = fun (_, _, _) {},
        ))

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
                for (i in 0 until payload.value.size)
                    jsArray.set(payload.value[i], i);
                jsFunction.call(payload.commitId, payload.propName, jsArray);
                jsArray.release();
            }
            invokeSubscribers.add(::subscriber);
            return "OK";
        })

        main.call(platform);


        class AssetLoader(): Loader {
            override fun getModuleScript(moduleName: String?): String {
                TODO("Not yet implemented")
            }
        }

        setContentView(parent)
    }
}