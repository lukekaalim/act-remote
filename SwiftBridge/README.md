# SwiftBridge

A description of this package.


## Usage

```swift
import SwiftBridge;
import ActRenderer;

let myPlatform = BasicPlatform();
let bridge = SwiftBridge(platform: myPlatform);

@main
struct iosApp: App {
    var body: some Scene {
        WindowGroup {
            ActRendererView(renderService: myPlatform.renderService)
        }
    }
}
```
