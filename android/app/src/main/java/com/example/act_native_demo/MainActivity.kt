package com.example.act_native_demo

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.FragmentActivity
import com.whl.quickjs.android.QuickJSLoader
import com.whl.quickjs.wrapper.JSCallFunction
import com.whl.quickjs.wrapper.JSModule
import com.whl.quickjs.wrapper.QuickJSContext


/**
 * Loads [MainFragment].
 */
class MainActivity : FragmentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        QuickJSLoader.init();
        val context = QuickJSContext.create()
        context.evaluate("var a = 1 + 2;");

        fun console(vararg args: Any): Any? {
            var arg = args[0];
            if (arg is String)
                Log.i("JAVASCRIPT", arg)
            return null;
        }

        context.globalObject.setProperty("console", ::console);

        context.evaluateModule("import { hello } from 'world';" +
                "" +
                "console(hello)", "Main")
        JSModule.setModuleLoader(QuickJSResourceLoader())
        Log.i("TAG", "HELLO!")


        setContentView(R.layout.activity_main)
        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                .replace(R.id.main_browse_fragment, MainFragment())
                .commitNow()
        }
    }
}