//
//  iosApp.swift
//  ios
//
//  Created by Luke Kaalim on 10/12/2022.
//

import SwiftUI
import QuickJS
import OSLog

let runtime = JSRuntime()!
let context = runtime.createContext()!

class ActController: UIViewController {
    let renderer = ManagedRenderer();
    
    func onDiff(diff: Diff) {
        let results = self.renderer.render(diff)
        
        if let stack = view as? UIStackView {
            for index in 0..<results.count {
                let result = results[index];
                stack.insertArrangedSubview(result.node, at: index);
            }
        }
    }
    
    func loadBundle() {
        let dist = NSDataAsset(name: "dist")!
        let bundle = String(decoding: dist.data, as: UTF8.self);
        let global = context.getGlobalObject();
        global.setProperty("global", global);
        
        context.evalModule(bundle, moduleName: "main");
        let main = context.getGlobalObject().getProperty("main");
        let platform = Platform(onDiff: self.onDiff);
        
        let platformObject = platform.createJSObject(context: context);
        
        let mainOutput = context.callFunction(function: main, arguments: [platformObject])
        if (mainOutput.isException) {
            Logger().error("\(context.getException()!)")
        }
    }
    
    override func loadView() {
        view = UIStackView();
    }
    
    override func viewDidLoad() {
        super.viewDidLoad();
        loadBundle();
    }
}

struct ActUIViewControllerRepresentable: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> ActController {
        return ActController();
    }
    
    func updateUIViewController(_ uiView: ActController, context: Context) {}
}

@main
struct iosApp: App {
    var body: some Scene {
        WindowGroup {
            ActUIViewControllerRepresentable()
        }
    }
}
