package com.example.androidapp.act.serializable

import com.whl.quickjs.wrapper.JSArray
import com.whl.quickjs.wrapper.JSObject

fun convertJSObjectToProp(value: JSObject): Prop {
    var type = value.getString("type");
    return when (type) {
        "function" -> FunctionProp();
        "mixed" -> JSONProp(value.getProperty("value"));
        else -> {
            throw java.lang.Exception("Unknown Prop Type!")
        }
    }
}

fun convertJSObjectToComponent(value: JSObject): Component {
    var type = value.getString("type");
    return when (type) {
        "function" -> FunctionComponent();
        "element" -> ElementComponent(value.getString("name"));
        else -> {
            throw java.lang.Exception("Unknown Prop Type!")
        }
    }
}

fun convertJSArrayToList(value: JSArray): List<Any> {
    var length = value.length();
    var list = mutableListOf<Any>();
    for (i in 0 until length)
        list.add(value[i]);

    return list;
}
fun convertJSArrayToPair(value: JSArray): Pair<Any, Any> {
    return Pair(value[0], value[1]);
}


fun convertJSObjectToElement(value: JSObject): Element {
    var propPairs = convertJSArrayToList(value.getJSArray("props"))
        .map { convertJSArrayToPair(it as JSArray) }
        .map {
            Pair(it.first as String, convertJSObjectToProp(it.second as JSObject));
        }
        .toTypedArray();
    var props = mapOf<String, Prop>(*propPairs);

    var component = convertJSObjectToComponent(value.getJSObject("component"));

    return Element(component, props);
}

fun convertJSObjectToCommit(value: JSObject): Commit {
    var element = convertJSObjectToElement(value.getJSObject("element"));
    var children = convertJSArrayToList(value.getJSArray("children"))
        .map { convertJSObjectToCommit(it as JSObject) }
    return Commit(
        value.getString("id"),
        value.getBoolean("pruned"),
        value.getString("version"),
        element,
        children,
    )
}

fun convertJSObjectToDiff(value: JSObject): Diff {
    var diffs = convertJSArrayToList(value.getJSArray("diffs"))
        .map { convertJSObjectToDiff(it as JSObject) }

    return Diff(
        convertJSObjectToCommit(value.getJSObject("prev")),
        convertJSObjectToCommit(value.getJSObject("next")),
        diffs,
    )
}

class Diff(val prev: Commit, val next: Commit, val diffs: List<Diff>);

class Commit(
    val id: String,
    val pruned: Boolean,
    val version: String,
    val element: Element,
    val children: List<Commit>
);

open class Component();
class FunctionComponent(): Component();
class ElementComponent(val name: String): Component();

class Element(val component: Component, val props: Map<String, Prop>);

open class Prop()

class FunctionProp(): Prop();
class JSONProp(val value: Any): Prop();

class InvokePayload(val commitId: String, val propName: String, val value: List<Any>);