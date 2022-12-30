package com.lukekaalim.demoapp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.lukekaalim.kotlinbridge.BasicPlatform
import com.lukekaalim.kotlinbridge.KotlinBridge

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        val platform = BasicPlatform();
        val bridge = KotlinBridge("dist/bundle.js", assets);

        bridge.run(platform);

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }
}