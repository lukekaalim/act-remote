//
//  File.swift
//  
//
//  Created by Luke Kaalim on 26/12/2022.
//

import Foundation
import OSLog;
import QuickJS;

public struct ConsoleService {
    public func CreateServiceObject(context: JSContext) -> JSValue {
        let object = context.createObject();
        object.dup();
        
        let log = context.createFunction(name: "log", argumentCount: 1) { this, arguments in
            if #available(tvOS 14, *) {
                Logger().info("\(arguments[0].string!)")
            }
            
            return nil;
        }
        
        object.setProperty("log", log);
        
        return object;
    }
}
