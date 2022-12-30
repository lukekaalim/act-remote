# act-remote

"Remote Rendering" is where the program that controls
application code is running in a different environment
than the one that actually displays things on the screen
and recieves events.

Classic examples are:
 - Writing a App for Web, iOS, Android, & Desktop targets simultaniously
 - Controlling the output of once device from another
 - Inspecting the output of an app in a serialized form

This project handles these cases for `@lukekaalim/act` apps. More
specifically, these projects enable you to write cross-platform
apps in javascript, running the in Swift, Kotlin and other environments. It
does so through a couple methods:
 - Language Bridges.
 - Serializable Diff Types.

## Main Projects

### RemoteRenderer

## Supporting Projects

### KotlinBridge

```
// start platform
// open bridge
// run bridge

```

### SwiftBridge
### CSharpBridge
