import SwiftUI
import QuickJS
import OSLog

public class SwiftBridge {
    var main: ((_ platformObject: JSValue) -> ())?;
    public let runtime: JSRuntime;
    public let context: JSContext;
    
    public init(bundlePath: String) {
        runtime = JSRuntime()!
        context = runtime.createContext()!
        
        let dist = NSDataAsset(name: bundlePath)!
        let bundle = String(decoding: dist.data, as: UTF8.self);
        let global = context.getGlobalObject();
        global.setProperty("global", global);
        
        context.evalModule(bundle, moduleName: "main");
        let main = context.getGlobalObject().getProperty("main");
        self.main = nil;
        
        self.main = {
            platform in
            do {
                try self.context.callFunction(function: main, arguments: [platform])
            } catch {
                print("Error in main: \(error)")
            }
        }
    }
    
    public func run(platformObject: JSValue) {
        self.main!(platformObject)
    }
}
