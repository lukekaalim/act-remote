package com.lukekaalim.kotlinbridge

import com.whl.quickjs.wrapper.JSObject
import com.whl.quickjs.wrapper.QuickJSContext

interface Platform {
  fun createPlatformObject(context: QuickJSContext): JSObject;
}