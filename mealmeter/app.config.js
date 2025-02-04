module.exports = () => {
    const config = {
        expo: {
            name: "mealmeter",
            slug: "mealmeter",
            // Copy all your existing app.json configuration here
            // ... rest of your existing config ...
            extra: {
                apiUrl: process.env.API_URL || "http://localhost:8000",
            },
        },
    };

    return config;
}; 