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

                bg: {
                    default: "var(--bg-default)",
                    paper: "var(--bg-paper)",
                    subtle: "var(--bg-subtle)",
                },

                text: {
                    default: "var(--text-default)",
                    secondary: "var(--text-secondary)",
                    subtle: "var(--text-subtle)",
                },

                divider: "var(--divider)",

                // Primary (Cozy Coral)
                primary: {
                    main: "var(--primary-main)",
                    contrast: "var(--primary-contrast)",
                    point: "var(--primary-point)",
                },
                // Secondary (Fresh Blue)
                secondary: {
                    main: "var(--secondary-main)",
                    contrast: "var(--secondary-contrast)",
                    point: "var(--secondary-point)",
                },

                success: {
                    main: "var(--success-main)",
                    contrast: "var(--success-contrast)",
                    point: "var(--success-point)",
                },

                error: {
                    main: "var(--error-main)",
                    contrast: "var(--error-contrast)",
                    point: "var(--error-point)",
                },

                warning: {
                    main: "var(--warning-main)",
                    contrast: "var(--warning-contrast)",
                },

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
                /(bg|text|border)-(primary|secondary|error|success|warning|info|text)-(main|contrast|secondary|point|subtle)/,
        },
    ],

    plugins: [],
} satisfies Config;
