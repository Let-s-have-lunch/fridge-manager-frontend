import { Config } from "tailwindcss";

export default {
    // 다크 모드를 'class' 방식으로 사용
    darkMode: "class",

    // Tailwind CSS가 클래스를 구성할 때 참고할 파일들의 경로
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],

    presets: [require("nativewind/preset")],

    theme: {
        extend: {
            colors: {
                // Background
                bg: {
                    default: "var(--bg-default)",
                    paper: "var(--bg-paper)",
                    light: "var(--bg-light)",
                },
                // Text
                text: {
                    DEFAULT: "var(--text-default)",
                    secondary: "var(--text-secondary)",
                },
                // Border / Divider
                divider: "var(--divider)",

                // Primary (Cozy Coral)
                primary: {
                    main: "var(--primary-main)",
                    contrast: "var(--primary-contrast)",
                    light: "var(--primary-light)",
                },
                // Secondary (Fresh Blue)
                secondary: {
                    main: "var(--secondary-main)",
                    contrast: "var(--secondary-contrast)",
                    point: "var(--secondary-point)",
                },
                // Success
                success: {
                    main: "var(--success-main)",
                    contrast: "var(--success-contrast)",
                    point: "var(--success-point)",
                },
                // Error
                error: {
                    main: "var(--error-main)",
                    contrast: "var(--error-contrast)",
                    point: "var(--error-point)",
                },
                // Warning
                warning: {
                    main: "var(--warning-main)",
                    contrast: "var(--warning-contrast)",
                },
                // Info
                info: {
                    main: "var(--info-main)",
                    contrast: "var(--info-contrast)",
                },
            },
        },
    },

    safelist: [
        {
            pattern:
                /(bg|text|border)-(primary|secondary|error|success|warning|info|text)-(main|contrast|secondary|light|point)/,
        },
    ],

    plugins: [],
} satisfies Config;
