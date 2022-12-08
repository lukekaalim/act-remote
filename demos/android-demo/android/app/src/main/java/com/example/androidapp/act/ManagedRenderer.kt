package com.example.androidapp.act

import android.view.View
import com.example.androidapp.act.serializable.Commit
import com.example.androidapp.act.serializable.Diff
import com.example.androidapp.act.serializable.ElementComponent
import com.example.androidapp.act.serializable.FunctionComponent

class ManagedRenderer<Node>(var options: Options<Node>) {
    val nodesByCommitID = mutableMapOf<String, Node>()

    class Options<Node>(
        val add: (
            diff: Diff,
            element: ElementComponent
        ) -> Node?,
        val update: (
            diff: Diff,
            node: Node,
            children: List<RenderResult<Node>>
        ) -> Unit,
        val delete: (
            diff: Diff,
            node: Node,
            children: List<RenderResult<Node>>
        ) -> Unit,
    );
    class RenderResult<Node>(val node: Node, val commit: Commit);

    fun createNode(diff: Diff): Node? {
        val node = when (val component = diff.next.element.component) {
            is FunctionComponent -> null;
            is ElementComponent ->  options.add(diff, component);
            else -> null;
        }
        if (node != null)
            nodesByCommitID[diff.next.id] = node;
        return node
    };

    fun updateNode(diff: Diff, node: Node, children: List<RenderResult<Node>>) {
        options.update(diff, node, children);
    }


    fun removeNode(diff: Diff, node: Node, children: List<RenderResult<Node>>) {
        options.delete(diff, node, children);
        nodesByCommitID.remove(diff.next.id);
    }

    fun getNodes (commit: Commit): List<RenderResult<Node>> {
        var node = nodesByCommitID[commit.id];
        if (node != null)
            return listOf(RenderResult(node, commit));

        return commit.children.map(fun (c) = getNodes(c)).flatten();
    }

    fun render(diff: Diff, parentNode: Node? = null): List<RenderResult<Node>> {
        var node = nodesByCommitID[diff.next.id] ?: createNode(diff);
        var children = diff.diffs.map(fun (diff) = render(diff, node)).flatten();

        var hasDiff = diff.next.id != diff.prev.id;

        if (node == null) {
            return if (!hasDiff)
                getNodes(diff.next);
            else
                children;
        }

        updateNode(diff, node, children);

        if (!diff.next.pruned)
            return listOf(RenderResult(node, diff.next));

        removeNode(diff, node, children);
        return emptyList();
    }
}