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
import com.lukekaalim.kotlinbridge.BasicPlatform
import com.lukekaalim.kotlinbridge.KotlinBridge
import com.whl.quickjs.android.QuickJSLoader
import com.whl.quickjs.wrapper.JSFunction
import com.whl.quickjs.wrapper.JSObject
import com.whl.quickjs.wrapper.QuickJSContext
import java.nio.charset.StandardCharsets
import java.util.*
import kotlin.concurrent.timerTask


class MainActivity : FragmentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        val rootView = FrameLayout(this);

        val platform = BasicPlatform(this, rootView);
        val bridge = KotlinBridge("dist/bundle.js", assets);

        val button = Button(this);
        button.text = "Hello!";
        rootView.addView(button)
        bridge.run(platform);
        setContentView(rootView);

        super.onCreate(savedInstanceState)
    }
}