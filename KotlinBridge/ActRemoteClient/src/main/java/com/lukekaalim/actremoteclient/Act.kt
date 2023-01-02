package com.lukekaalim.actremoteclient

class Diff(
    val prev: Commit,
    val next: Commit,
    val diffs: List<Diff>)

class Commit(
    val id: String,
    val pruned: Boolean,
    val version: String,
    val element: Element,
    val children: List<Commit>)

open class Component
class FunctionComponent: Component()
class ElementComponent(val name: String): Component()

class Element(
    val id: String,
    val component: Component,
    val props: Map<String, Prop>)

open class Prop()

class FunctionProp: Prop()
class JSONProp(val value: Any): Prop()

class InvokePayload(
    val commitId: String,
    val propName: String,
    val value: List<Any>)