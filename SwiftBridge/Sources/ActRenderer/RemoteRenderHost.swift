//
//  File.swift
//  
//
//  Created by Luke Kaalim on 26/12/2022.
//

import Foundation
import QuickJS;
import Combine;

public protocol RemoteRenderHost {
    func invoke(param: FunctionPropInvoke) -> ();
    var diffSubject: any Subject<Diff, Error> { get };
}
