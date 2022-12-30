package com.lukekaalim.actremoteclient

import android.view.View

public class ViewRenderer: Renderer<View> {
    private val options = ManagedRenderer.Options<View>(
        add = ::add,
        update = ::update,
        delete = ::delete
    )
    private val renderer: ManagedRenderer<View> =
        ManagedRenderer<View>(options)


    private fun add(diff: Diff, component: ElementComponent): View? {
        return null
    }
    private fun update(diff: Diff, node: View, children: List<RenderResult<View>>) {
        return
    }
    private fun delete(diff: Diff, node: View, children: List<RenderResult<View>>) {
        return
    }

    override fun render(diff: Diff): List<RenderResult<View>> {
        return renderer.render(diff)
    }
}