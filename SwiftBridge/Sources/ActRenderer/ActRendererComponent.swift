//
//  SwiftUIView 2.swift
//  
//
//  Created by Luke Kaalim on 26/12/2022.
//
import Foundation;
import SwiftUI;
import Combine;

public struct ActRendererComponent: UIViewControllerRepresentable {
    var host: RemoteRenderHost;
    
    public init(host: RemoteRenderHost) {
        self.host = host
    }

    public func makeUIViewController(context: Context) -> UIActRendererController {
        UIActRendererController(host: host)
    }

    public func updateUIViewController(_ view: UIActRendererController, context: Context) {
        
    }
}
