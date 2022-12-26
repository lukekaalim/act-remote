//
//  ManagedRenderer.swift
//  ios
//
//  Created by Luke Kaalim on 12/12/2022.
//

import Foundation
import SwiftUI

public struct RenderResult<T> {
    let commit: Commit;
    let node: T;
}

protocol Renderer {
    associatedtype Node
    
    func render(_ diff: Diff) -> [RenderResult<Node>]
    func getNodes(_ commit: Commit) -> [RenderResult<Node>]
}


struct ManagedRendererImplementation<T> {
    let createNode: (_ diff: Diff) -> T?;
    let updateNode: (_ diff: Diff, _ node: T, _ children: [RenderResult<T>]) -> ();
    let removeNode: (_ diff: Diff, _ node: T, _ children: [RenderResult<T>]) -> ();
}

class ManagedRenderer<T>: Renderer {
    typealias Node = T;
    
    let impl: ManagedRendererImplementation<T>;
    
    init(impl: ManagedRendererImplementation<T>) {
        self.impl = impl;
    }
    
    var nodes: Dictionary<String, T> = Dictionary();
    
    public func getNodes(_ commit: Commit) -> [RenderResult<T>] {
        let node = nodes[commit.id]
        if (node != nil) {
            return [RenderResult(commit: commit, node: node!)];
        }
        
        return commit.children.flatMap { commit in
            return getNodes(commit);
        }
    }
    
    public func render(_ diff: Diff) -> [RenderResult<T>] {
        let node: T? = nodes[diff.next.id] ?? impl.createNode(diff);
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

        impl.updateNode(diff, node!, children);
        
        if (!diff.next.pruned) {
            return [RenderResult(commit: diff.next, node: node!)];
        }
        
        impl.removeNode(diff, node!, children);
        return [];
    }
}
