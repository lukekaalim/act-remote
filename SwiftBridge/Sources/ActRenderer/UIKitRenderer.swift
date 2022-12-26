//
//  File.swift
//  
//
//  Created by Luke Kaalim on 23/12/2022.
//

import Foundation
import SwiftUI
import UIKit

class UIKitRenderer: Renderer {
    typealias Node = UIView;
    
    var renderer: ManagedRenderer<UIView>? = nil;
    let invoke: (FunctionPropInvoke) -> ();
    
    init(invoke: @escaping  (FunctionPropInvoke) -> ()) {
        self.invoke = invoke;
        self.renderer = ManagedRenderer<UIView>(impl: ManagedRendererImplementation(
            createNode: createView,
            updateNode: updateView,
            removeNode: removeView
        ));
    }
    
    func createView(_ diff: Diff) -> UIView? {
        let type = diff.next.element.component;
        switch (type) {
        case .function:
            return nil;
        case .element(let element):
            switch (element.name) {
            case "ios:label":
                return UILabel();
            case "ios:stack_view":
                return UIStackView();
            case "ios:button":
                return UIButton(type: .system);
            default:
                return nil;
            }
        }
    }
    
    func updateView(_ diff: Diff, _ view: UIView, _ children: [RenderResult<UIView>]) {
        switch (view) {
        case let label as UILabel:
            let textProp = diff.next.element.props["text"];
            if case .mixed(let prop) = textProp! {
                label.text = prop.value.string!;
            }
        case let button as UIButton:
            let onPressProp = diff.next.element.props["onPress"];
            if case .function = onPressProp! {
                if #available(tvOS 14.0, *) {
                    
                    print(Thread.current)
                    button.addAction(UIAction(title: "Button Title", handler: { _ in
                        print("Start Invoke")
                        print(Thread.current)
                        self.invoke(FunctionPropInvoke(
                            commit: diff.next.id,
                            prop: "onPress",
                            value: []
                        ));
                        print("FINISHED ONPRESS HANDLER")
                    }), for: .primaryActionTriggered)
                } else {
                    // Fallback on earlier versions
                }
            }
        case let stack as UIStackView:
            let orientationProp = diff.next.element.props["orientation"];
            if case .mixed(let prop) = orientationProp! {
                let orientation = prop.value.string!;
                stack.axis = orientation == "horizontal" ? .horizontal : .vertical;
            }
            
            for index in 0..<children.count {
                let child = children[index];
                stack.insertArrangedSubview(child.node, at: index);
            }
        default:
            return;
        }
    }
    
    func removeView(_ diff: Diff, _ view: UIView, _ children: [RenderResult<UIView>]) {
        view.removeFromSuperview();
    }
    
    
    func getNodes(_ commit: Commit) -> [RenderResult<UIView>] {
        return renderer!.getNodes(commit);
    }
    func render(_ diff: Diff) -> [RenderResult<UIView>] {
        return renderer!.render(diff);
    }
}
