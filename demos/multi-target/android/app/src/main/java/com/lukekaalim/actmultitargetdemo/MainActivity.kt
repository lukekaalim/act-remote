package com.lukekaalim.actmultitargetdemo

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.FrameLayout
import com.lukekaalim.kotlinbridge.BasicPlatform
import com.lukekaalim.kotlinbridge.KotlinBridge

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        val rootView = FrameLayout(this);

        val platform = BasicPlatform(this, rootView);
        val bridge = KotlinBridge("dist/bundle.js", assets);

        bridge.run(platform);
        setContentView(rootView);

        super.onCreate(savedInstanceState)
    }
}