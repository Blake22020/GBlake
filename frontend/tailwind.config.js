module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: "#111318",
                    elevated: "#0B0C10",
                    card: "rgba(255, 255, 255, 0.2)",
                },
                text: {
                    primary: "#FFFFFF",
                    secondary: "rgba(255, 255, 255, 0.75)",
                },
                primary: {
                    400: "#A08EFF",
                    500: "#8a7ef5",
                    600: "#6E5BFF",
                },
                border: {
                    subtle: "rgba(255,255,255,0.25)",
                    strong: "rgba(255,255,255,0.35)",
                },
            },
        },
    },
    plugins: [],
};
