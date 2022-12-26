//
//  Platform.swift
//  
//
//  Created by Luke Kaalim on 27/12/2022.
//

import Foundation
import QuickJS

public protocol Platform {
    // Given a javascript context, create a "platform" object
    // that will be passed to the "main" function of the
    // javascript bundle.
    func CreatePlatformObject(context: JSContext) -> JSValue;
}
