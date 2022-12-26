//
//  iosApp.swift
//  ios
//
//  Created by Luke Kaalim on 10/12/2022.
//

import SwiftUI
import QuickJS
import OSLog
import SwiftBridge;
import ActRenderer;

let platform = BasicPlatform();
let bridge = SwiftBridge(bundlePath: "dist");

@main
struct iosApp: App {
    var body: some Scene {
        WindowGroup {
            ActRendererComponent(host: platform.render)
            .onAppear {
                bridge.run(platform);
            }
        }
    }
}
