module.exports = () => ({
    expo: {
        name: "mealmeter",
        slug: "mealmeter",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "mealmeter",
        userInterfaceStyle: "automatic",
        splash: {
            image: "./assets/images/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.mealmeter.app"
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.mealmeter.app"
        },
        web: {
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router"
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            apiUrl: process.env.API_URL || "http://localhost:8000",
        },
        newArchEnabled: true // Enable the new architecture
    }
}); 