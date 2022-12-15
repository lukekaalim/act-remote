//
//  ManagedRenderer.swift
//  ios
//
//  Created by Luke Kaalim on 12/12/2022.
//

import Foundation
import SwiftUI

public struct RenderResult {
    let commit: Commit;
    let node: UIView;
}

class ViewRenderer {
    
}


class ManagedRenderer {
    var nodes: Dictionary<String, UIView> = Dictionary();
    
    func createNode(_ diff: Diff) -> UIView? {
        let type = diff.next.element.component;
        switch (type) {
        case .function:
            return nil;
        case .element(let element):
            switch (element.name) {
            case "ios:text":
                return UILabel();
            case "ios:stack_view":
                return UIStackView();
            default:
                return nil;
            }
        }
    }
    
    func updateNode(node: UIView?, diff: Diff, children: [RenderResult]) {
        switch (node) {
        case let label as UILabel:
            let contentProp = diff.next.element.props["content"];
            if case .mixed(let prop) = contentProp! {
                label.text = prop.value.string!;
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
    
    func getNodes(_ commit: Commit) -> [RenderResult] {
        let node = nodes[commit.id]
        if (node != nil) {
            return [RenderResult(commit: commit, node: node!)];
        }
        
        return commit.children.flatMap { commit in
            return getNodes(commit);
        }
    }
    
    public func render(_ diff: Diff) -> [RenderResult] {
        let node: UIView? = nodes[diff.next.id] ?? createNode(diff);
        let children = diff.diffs.flatMap { diff in render(diff) }

        let hasDiff = diff.next.version != diff.prev.version;
      
        if (node == nil) {
            if (!hasDiff) {
                return getNodes(diff.next);
            }
            else {
                return children;
            }
        }

        updateNode(node: node, diff: diff, children: children);
        
        if (!diff.next.pruned) {
            return [RenderResult(commit: diff.next, node: node!)];
        }
        
        //removeNode(diff, node);
        return [];
    }
}
