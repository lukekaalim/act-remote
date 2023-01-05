package com.lukekaalim.actremoteclient

import android.content.Context
import android.view.View
import com.facebook.yoga.YogaNode
import com.facebook.yoga.YogaNodeFactory
import com.facebook.yoga.android.YogaLayout

class YogaElements(val context: Context) {

    fun createNodes(diff: Diff, element: ElementComponent): View? {
        return when (element.name) {
            else -> null;
        }
    }
}