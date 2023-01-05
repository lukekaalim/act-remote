//
//  ActMultiTargetDemoApp.swift
//  ActMultiTargetDemo
//
//  Created by Luke Kaalim on 2/1/2023.
//

import SwiftUI;
import SwiftBridge;
import ActRenderer;

let platform = BasicPlatform();
let bridge = SwiftBridge(bundlePath: "dist");

@main
struct ActMultiTargetDemoApp: App {
    var body: some Scene {
        WindowGroup {
            ActRendererComponent(host: platform.render)
                .onAppear {
                    bridge.run(platform);
                }
        }
        
    }
}
