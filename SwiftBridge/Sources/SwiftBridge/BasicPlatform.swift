//
//  File.swift
//  
//
//  Created by Luke Kaalim on 26/12/2022.
//

import Foundation
import QuickJS

public struct BasicPlatform: Platform {
    public let console = ConsoleService();
    public let render = RenderService();
    public let timeout = TimeoutService();
    
    public init() {
        
    }
    
    public func CreatePlatformObject(context: JSContext) -> JSValue {
        let object = context.createObject();
        object.setProperty("render", render.CreateServiceObject(context: context));
        object.setProperty("console", console.CreateServiceObject(context: context));
        object.setProperty("timeout", timeout.CreateServiceObject(context: context));
        object.dup();
        
        return object;
    }
}
