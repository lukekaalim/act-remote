//
//  Platform.swift
//  ios
//
//  Created by Luke Kaalim on 12/12/2022.
//

import Foundation
import QuickJS
import os

struct Platform {
    var onDiff: ((_ diff: Diff) -> ())? = nil;
    
    init(onDiff: ((_ diff: Diff) -> ())? = nil) {
        self.onDiff = onDiff;
    }
    
    public func createJSObject(context: JSContext) -> JSObjectValue {
        let object = context.createObject();
        let logger = Logger();
        
        object.setProperty("log", context.createFunction(name: "log", argumentCount: 1, implementation: { this, arguments in
            let message: String? = arguments[0].string;
            if message != nil {
                logger.info("\(message!)")
            }
                
            return nil
        }))
        
        
        object.setProperty("onDiff", context.createFunction(name: "onDiff", argumentCount: 1, implementation: { this, arguments in
            logger.info("Submitted Diff")
            logger.info("Diff: \(arguments[0].printJSON())")
            let diff = createDiffFromJS(value: arguments[0])
            if (onDiff != nil) {
                onDiff!(diff);
            }
            return nil
        }))
        object.setProperty("subscribeInvoke", context.createFunction(name: "subscribeInvoke", argumentCount: 1, implementation: { this, arguments in
            logger.info("Subscribed to subscribeInvoke")
            arguments[0].dup();
            return nil
        }))
        object.setProperty("setTimeout", context.createFunction(name: "setTimeout", argumentCount: 2, implementation: { this, arguments in
            logger.info("Set Timeout \(String(arguments[1].double!))")
            arguments[0].dup();
            return nil
        }))
        object.setProperty("cancelTimeout", context.createFunction(name: "cancelTimeout", argumentCount: 1, implementation: { this, arguments in
            logger.info("Cancelled Timeout")
            return nil
        }))
        
        return object;
    }
}
