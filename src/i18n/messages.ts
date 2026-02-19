export const messages = {
    en: {
        title: "WBNBD",
        subtitle: "Let Me Baidu That For You",
        placeholder: "Type your search query...",
        enginePlaceholder:
            "Custom search engine URL (use @QUERY@ as placeholder)",
        getLink: "Get Link",
        search: "Search",
        step1: "Step 1: Move to the search box...",
        step2: "Step 2: Type your question...",
        step3: "Step 3: Click search!",
    },
    zh: {
        title: "WBNBD",
        subtitle: "我帮你百度",
        placeholder: "输入你的搜索内容...",
        enginePlaceholder: "自定义搜索引擎 URL（使用 @QUERY@ 作为占位符）",
        getLink: "生成链接",
        search: "搜索",
        step1: "第一步：移动到搜索框...",
        step2: "第二步：输入你的问题...",
        step3: "第三步：点击搜索！",
    },
} as const

export type Locale = keyof typeof messages
