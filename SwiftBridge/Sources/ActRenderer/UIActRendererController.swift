//
//  File.swift
//  
//
//  Created by Luke Kaalim on 23/12/2022.
//

import Foundation;
import SwiftUI;
import Combine;


public class UIActRendererController: UIViewController {
    let renderer: UIKitRenderer;
    let host: RemoteRenderHost;
    
    public init(host: RemoteRenderHost) {
        self.host = host;
        self.renderer = UIKitRenderer(invoke: host.invoke);
        super.init(nibName: nil, bundle: nil);
        host.diffSubject.subscribe(Subscribers.Sink(
            receiveCompletion: { error in () },
            receiveValue: onDiff
        ))
    }
    
    required init?(coder: NSCoder) {
        return nil;
    }
    
    func onDiff(diff: Diff) {
        let results = self.renderer.render(diff)
        
        if let stack = view as? UIStackView {
            for index in 0..<results.count {
                let result = results[index];
                if (stack.arrangedSubviews.count <= index) {
                    stack.insertArrangedSubview(result.node, at: index);
                }
                if (stack.arrangedSubviews[index] != result.node) {
                    stack.insertArrangedSubview(result.node, at: index);
                }
            }
        }
    }
    
    public override func loadView() {
        view = UIStackView();
    }
}
