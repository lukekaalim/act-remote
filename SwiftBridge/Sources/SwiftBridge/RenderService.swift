//
//  File.swift
//  
//
//  Created by Luke Kaalim on 23/12/2022.
//

import Foundation
import ActRenderer
import SwiftUI
import Combine;
import QuickJS;

public class RenderService: RemoteRenderHost {
    let invokeSubject = PassthroughSubject<FunctionPropInvoke, Error>();
    
    public func invoke(param: FunctionPropInvoke) {
        invokeSubject.send(param);
    }
    
    public var diffSubject: any Subject<Diff, Error> = PassthroughSubject<Diff, Error>();
    
    struct SubscriptionObject: ConvertibleWithJavascript {
        let internalValue: JSValue?;
        init?(_ context: QuickJS.JSContextWrapper, value: QuickJS.JSCValue) {
            internalValue = nil
        }
        init(internalValue: JSValue) {
            self.internalValue = internalValue;
        }
        public func jsValue(_ context: JSContextWrapper) -> JSValue {
            self.internalValue!;
        }
    }
    
    public func CreateServiceObject(context: JSContext) -> JSValue {
        let object = context.createObject();
        
        object.dup();
        object.setProperty("subscribeCallback", context.createFunction(
            name: "subscribeCallback",
            argumentCount: 1,
            implementation: { this, arguments in
            
                arguments[0].dup();
                let callbackFunction = arguments[0];
                let subscriber = Subscribers.Sink<FunctionPropInvoke, Error>(
                    receiveCompletion: { error in () },
                    receiveValue: {
                        invoke in
                        do {
                            let arguments = [
                                invoke.commit.convertToJS(context),
                                invoke.prop.convertToJS(context),
                                invoke.value.map({ value in JSUnknown(value) }).convertToJS(context)
                            ];
                            
                            try context.callFunction(
                                function: callbackFunction,
                                arguments: arguments
                            )
                        } catch {
                            print("Render Callback Error: \(error)")
                        }
                    }
                );
                let cancelFunc = context.createFunction(name: "cancelCallback", argumentCount: 0) { this, arguments in
                    subscriber.cancel();
                    return nil
                }
                let subscriptionObject = context.createObject()
                subscriptionObject.dup();
                subscriptionObject.setProperty("cancel", cancelFunc)
                self.invokeSubject.subscribe(subscriber);
                
                return SubscriptionObject(internalValue: subscriptionObject);
            }
        ))
        object.setProperty("submitDiff", context.createFunction(
            name: "submitDiff",
            argumentCount: 1,
            implementation: { this, arguments in
                
                arguments[0].dup();
                let diff = Diff(value: arguments[0]);
                self.diffSubject.send(diff);
                    
                return nil
            }
        ))
        
        return object;
    }
}
