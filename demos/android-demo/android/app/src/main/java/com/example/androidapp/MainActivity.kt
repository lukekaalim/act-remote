package com.example.androidapp

import android.app.ActionBar.LayoutParams
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.view.children
import androidx.fragment.app.FragmentActivity
import com.example.androidapp.act.CreateAndroidViewRenderer
import com.example.androidapp.act.ManagedRenderer
import com.example.androidapp.act.attachChildren
import com.example.androidapp.act.serializable.*
import com.google.android.exoplayer2.ExoPlayer
import com.google.android.exoplayer2.MediaItem
import com.google.android.exoplayer2.ui.StyledPlayerView
import com.whl.quickjs.android.QuickJSLoader
import com.whl.quickjs.wrapper.JSFunction
import com.whl.quickjs.wrapper.JSObject
import com.whl.quickjs.wrapper.QuickJSContext
import java.nio.charset.StandardCharsets
import java.util.*
import kotlin.concurrent.timerTask


class MainActivity : FragmentActivity() {
    var renderer: ManagedRenderer<View> = CreateAndroidViewRenderer(this, ::invoke);

    val invokeSubscribers = mutableSetOf<(payload: InvokePayload) -> Unit>();
    fun invoke(payload: InvokePayload) {
        for (subscriber in invokeSubscribers)
            subscriber(payload);
    }
    fun subscribeInvoke (listener: (payload: InvokePayload) -> Unit) {
        invokeSubscribers.add(listener);
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState);
        var stream = assets.open("dist/bundle.js");
        var bytes = stream.use { it.readBytes() };
        val text = String(bytes, StandardCharsets.UTF_8)

        QuickJSLoader.init();
        var context = QuickJSContext.create();
        context.globalObject.setProperty("global", context.globalObject);

        context.evaluateModule(text, "main");
        var main = context.globalObject.getJSFunction("main");

        var parent = FrameLayout(this);
        var platform = CreatePlatformJSObject(context, renderer, parent, ::subscribeInvoke);

        main.call(platform);
        setContentView(parent)
    }

    override fun onDestroy() {
        super.onDestroy()
    }
}