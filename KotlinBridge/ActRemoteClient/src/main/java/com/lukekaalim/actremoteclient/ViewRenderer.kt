package com.lukekaalim.actremoteclient

import android.app.ActionBar
import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.view.children

fun attachChildren (parent: ViewGroup, children: List<View>) {
    var isChildrenDifferent = parent.childCount != children.size || parent.children
        .mapIndexed(fun (realIndex, view) = children[realIndex] != view)
        .any { it }
    if (!isChildrenDifferent)
        return;
    parent.removeAllViews();
    for (child in children)
        parent.addView(child);
}

public class ViewRenderer(val context: Context, val invoke: (payload: InvokePayload) -> Unit): Renderer<View> {
    private val options = ManagedRenderer.Options<View>(
        add = ::add,
        update = ::update,
        delete = ::delete
    )
    private val renderer: ManagedRenderer<View> =
        ManagedRenderer<View>(options)


    private fun add(diff: Diff, element: ElementComponent): View? {
        return when (element.name) {
            "android:linear_layout" -> LinearLayout(context);
            "android:frame_layout" -> FrameLayout(context);
            "android:text" -> TextView(context);
            "act:string" -> TextView(context);
            "android:button" -> Button(context);
            /*
            "android:exoplayer" -> {
                var view = StyledPlayerView(context);
                view.player = ExoPlayer.Builder(context).build();
                view;
            };
             */
            else -> null;
        }
    }
    private fun update(diff: Diff, view: View, children: List<RenderResult<View>>) {

        var component = diff.next.element.component;
        if (component !is ElementComponent)
            return;

        if (view is ViewGroup) {
            when (component.name) {
                "android:linear_layout",
                "android:frame_layout" ->
                    attachChildren(view, children.map { it.node });
            }
        }
        if (diff.next.version == diff.prev.version)
            return;

        if (view is LinearLayout) {
            var orientation = diff.next.element.props["orientation"];
            if (orientation is JSONProp)
                view.orientation = if
                                           ((orientation.value as String).lowercase() == "horizontal")
                    LinearLayout.HORIZONTAL
                else
                    LinearLayout.VERTICAL
        }
        if (view is FrameLayout) {
            if (view.layoutParams == null)
                view.layoutParams = ViewGroup.LayoutParams(
                    ActionBar.LayoutParams.MATCH_PARENT,
                    ActionBar.LayoutParams.MATCH_PARENT
                );
            view.layoutParams.width = ActionBar.LayoutParams.MATCH_PARENT;
            view.layoutParams.height = ActionBar.LayoutParams.MATCH_PARENT;
        }
        if (view is TextView) {
            var content = diff.next.element.props["content"];
            if (content is JSONProp)
                view.text = content.value as? String ?: "";
        }
        if (view is Button) {
            var onClick = diff.next.element.props["onClick"];
            if (onClick is FunctionProp)
                view.setOnClickListener {
                    invoke(InvokePayload(diff.next.id, "onClick", listOf("YES")))
                }
        }
        /*
        if (view is StyledPlayerView) {
            var player = view.player;
            if (player != null) {
                var videoUri = diff.next.element.props["videoUri"];
                if (videoUri is JSONProp) {
                    var videoUriString = videoUri.value as String;
                    if (player.currentMediaItem?.localConfiguration?.uri.toString() != videoUriString) {
                        val mediaItem = MediaItem.fromUri(videoUriString)
                        player.setMediaItem(mediaItem)
                        player.prepare()
                        player.play()
                    }
                }
            }
        }
        */
    }
    private fun delete(diff: Diff, node: View, children: List<RenderResult<View>>) {
        return
    }

    override fun render(diff: Diff): List<RenderResult<View>> {
        return renderer.render(diff)
    }
}