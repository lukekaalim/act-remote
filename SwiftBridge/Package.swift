// swift-tools-version: 5.7
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "SwiftBridge",
    platforms: [
        .macOS(.v10_14), .iOS(.v13), .tvOS(.v13)
    ],
    products: [
        // Products define the executables and libraries a package produces, and make them visible to other packages.
        .library(
            name: "SwiftBridge",
            targets: ["SwiftBridge"]),
        .library(
            name: "ActRenderer",
            targets: ["ActRenderer"]),
    ],
    dependencies: [
        // Dependencies declare other packages that this package depends on.
        // .package(url: /* package url */, from: "1.0.0"),
        .package(
            url: "https://github.com/lukekaalim/QuickJS-Swift-tvOS.git",
            branch: "dev/add-tvOS-support"
        ),
    ],
    targets: [
        // Targets are the basic building blocks of a package. A target can define a module or a test suite.
        // Targets can depend on other targets in this package, and on products in packages this package depends on.
        .target(
            name: "SwiftBridge",
            dependencies: [
                .product(name: "QuickJS", package: "QuickJS-Swift-tvOS"),
                "ActRenderer"
            ]),
        .target(
            name: "ActRenderer",
            dependencies: [
                .product(name: "QuickJS", package: "QuickJS-Swift-tvOS")
            ]),
        .testTarget(
            name: "SwiftBridgeTests",
            dependencies: ["SwiftBridge"]),
    ]
)
