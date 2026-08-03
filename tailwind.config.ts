import { Config } from "tailwindcss";

export default {
    // 다크 모드를 'class' 방식으로 사용
    darkMode: "class",

    // Tailwind CSS가 클래스를 구성할 때 참고할 파일들의 경로
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./types/**/*.{js,jsx,ts,tsx}",
    ],

    presets: [require("nativewind/preset")],

    theme: {
        extend: {
            colors: {
                bg: {
                    default: "var(--bg-default)",
                    paper: "var(--bg-paper)",
                    subtle: "var(--bg-subtle)",
                    button: "var(--bg-button)",
                },

                text: {
                    default: "var(--text-default)",
                    secondary: "var(--text-secondary)",
                    subtle: "var(--text-subtle)",
                    contrast: "var(--text-contrast)",

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
                    bg: "var(--error-bg)",
                    border: "var(--error-border)",
                },

                warning: {
                    main: "var(--warning-main)",
                    contrast: "var(--warning-contrast)",
                    bg: "var(--warning-bg)",
                    border: "var(--warning-border)",
                },

                info: {
                    main: "var(--info-main)",
                    contrast: "var(--info-contrast)",
                },

                menu: {
                    bg: "var(--menu-bg)",
                    icon: "var(--menu-icon)",
                    danger: {
                        bg: "var(--menu-danger-bg)",
                        icon: "var(--menu-danger-icon)",
                    },
                },

                button: {
                    subtle: "var(--button-subtle)",
                },

                expire: {
                    expired: {
                        bg: "var(--expire-expired-bg)",
                        text: "var(--expire-expired-text)",
                    },
                    soon: {
                        bg: "var(--expire-soon-bg)",
                        text: "var(--expire-soon-text)",
                    },
                    warning: {
                        bg: "var(--expire-warning-bg)",
                        text: "var(--expire-warning-text)",
                    },
                    safe: {
                        bg: "var(--expire-safe-bg)",
                        text: "var(--expire-safe-text)",
                    },
                },
            },
        },
    },

    safelist: [
        {
            // 기존 3단어 조합 (예: bg-primary-main)
            pattern:
                /(bg|text|border)-(primary|secondary|error|success|warning|info|text|menu|button)-(main|contrast|secondary|point|subtle|bg|icon|danger)/,

        },
        {
            // 👉 [추가된 부분]: expire 전용 4단어 조합 정규식 추가! (예: bg-expire-expired-bg)
            pattern: /(bg|text|border)-expire-(expired|soon|warning|safe)-(bg|text)/,
        },
    ],

    plugins: [],
} satisfies Config;
