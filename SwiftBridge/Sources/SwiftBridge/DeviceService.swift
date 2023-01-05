//
//  File.swift
//  
//
//  Created by Luke Kaalim on 2/1/2023.
//

import Foundation
import QuickJS

public struct DeviceService {
    public func CreateServiceObject(context: JSContext) -> JSValue {
        let object = context.createObject();
        object.dup();
        
        object.setProperty("platformFamilyType", "ios".convertToJS(context));
        
        return object;
    }
}
