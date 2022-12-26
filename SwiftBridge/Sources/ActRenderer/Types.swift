//
//  ActTypes.swift
//  ios
//
//  Created by Luke Kaalim on 12/12/2022.
//

import Foundation
import QuickJS

public struct JSProp {
    public let value: QuickJS.JSValue;
}

public struct FunctionPropInvoke {
    public let commit: CommitID;
    public let prop: String;
    public let value: [QuickJS.JSValue];
}

public enum PropType {
    case function
    case mixed(JSProp)
}

public struct ElementComponent {
    public let name: String;
}

public struct FunctionComponent {
    
}

public enum ComponentType {
    case element(ElementComponent)
    case function
}

public struct Element {
    public let component: ComponentType;
    public let props: Dictionary<String, PropType>;
}

public typealias CommitID = String;
public struct Commit {
    public let element: Element;
    public let version: String;
    public let id: CommitID;
    public let pruned: Bool;
    public let children: [Commit];
}

public struct Diff {
    public let prev: Commit;
    public let next: Commit;
    public let diffs: [Diff]
    
    public init(value: JSValue) {
        let object = value.object!;
        
        let diffs = jsArrayValueToSwiftArray(jsArray: object.getProperty("diffs").array!).map {
            value in Diff(value: value)
        };
        
        self.prev = createCommitFromJS(value: object.getProperty("prev"));
        self.next = createCommitFromJS(value: object.getProperty("next"));
        self.diffs = diffs;
    }
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
