//
//  ActTypes.swift
//  ios
//
//  Created by Luke Kaalim on 12/12/2022.
//

import Foundation
import QuickJS

struct JSProp {
    let value: QuickJS.JSValue;
}

enum PropType {
    case function
    case mixed(JSProp)
}

struct ElementComponent {
    let name: String;
}

struct FunctionComponent {
    
}

enum ComponentType {
    case element(ElementComponent)
    case function
}

struct Element {
    let component: ComponentType;
    let props: Dictionary<String, PropType>;
}

struct Commit {
    let element: Element;
    let version: String;
    let id: String;
    let pruned: Bool;
    let children: [Commit];
}

struct Diff {
    let prev: Commit;
    let next: Commit;
    let diffs: [Diff]
}

func createPropTypeFromJS(value: JSValue) -> PropType {
    let object = value.object!;
    let type = object.getProperty("type").string!;
    switch type {
    case "function":
        return PropType.function;
    case "mixed":
        let value = object.getProperty("value");
        value.dup();
        return PropType.mixed(JSProp(value: value));
    default:
        return PropType.function;
    }
}

func createComponentTypeFromJS(value: JSValue) -> ComponentType {
    let object = value.object!;
    let type = object.getProperty("type").string!;
    switch type {
    case "function":
        return ComponentType.function;
    case "element":
        return ComponentType.element(ElementComponent(name: object.getProperty("name").string!));
    default:
        return ComponentType.function;
    }
}

func createElementFromJS(value: JSValue) -> Element {
    let object = value.object!;
    let props = Dictionary<String, PropType>(
        uniqueKeysWithValues: jsArrayValueToSwiftArray(jsArray: object.getProperty("props").array!)
            .map { element in jsArrayValueToTuplePair(jsArray: element.array!) }
            .map { pair in (pair.0.string!, createPropTypeFromJS(value: pair.1)) }
    );
    return Element(
        component: createComponentTypeFromJS(value: object.getProperty("component")),
        props: props
    )
}

func jsArrayValueToTuplePair(jsArray: JSArrayValue) -> (JSValue, JSValue) {
    return (jsArray.getIndex(0), jsArray.getIndex(1))
}

func jsArrayValueToSwiftArray(jsArray: JSArrayValue) -> [JSValue] {
    var swiftArray = Array<JSValue>();
    for index in 0..<jsArray.length {
        swiftArray.append(jsArray.getIndex(index))
    }
    return swiftArray;
}

func createCommitFromJS(value: JSValue) -> Commit {
    let object = value.object!;
    let children = jsArrayValueToSwiftArray(jsArray: object.getProperty("children").array!).map { value in
        return createCommitFromJS(value: value)
    };
    
    return Commit(
        element: createElementFromJS(value: object.getProperty("element")),
        version: object.getProperty("version").string!,
        id: object.getProperty("id").string!,
        pruned: object.getProperty("pruned").bool!,
        children: children
    )
}

func createDiffFromJS(value: JSValue) -> Diff {
    let object = value.object!;
    let diffs = jsArrayValueToSwiftArray(jsArray: object.getProperty("diffs").array!).map { value in
        return createDiffFromJS(value: value)
    };
    
    return Diff(
        prev: createCommitFromJS(value: object.getProperty("prev")),
        next: createCommitFromJS(value: object.getProperty("next")),
        diffs: diffs
    )
}
