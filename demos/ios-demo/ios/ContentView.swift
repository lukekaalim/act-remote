//
//  ContentView.swift
//  ios
//
//  Created by Luke Kaalim on 10/12/2022.
//

import SwiftUI

struct ContentView: View {
    var greetz: String;
    
    init(greeting: String) {
        greetz = greeting;
    }
    
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundColor(.accentColor)
            Text(self.greetz)
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(greeting: "AAA")
    }
}
