//
//  File.swift
//
//
//  Created by Luke Kaalim on 26/12/2022.
//

import Foundation
import OSLog;
import QuickJS;

public struct TimeoutService {
    public func CreateServiceObject(context: JSContext) -> JSValue {
        let object = context.createObject();
        object.dup();
        
        let setTimeout = context.createFunction(name: "setTimeout", argumentCount: 2) { this, arguments in
            let timeout = arguments[1].double!;
            arguments[0].dup();
            let callbackFunction = arguments[0];
            
            DispatchQueue.main.asyncAfter(deadline: .now() + (timeout / 1000)) {
                do {
                    try context.callFunction(function: callbackFunction, arguments: []);
                } catch {
                    print("Timout error: \(error)")
                }
            }
            return nil;
        }
        
        object.setProperty("setTimeout", setTimeout);
        setTimeout.dup();
        //object.setProperty("clearTimeout", );
        
        return object;
    }
}
