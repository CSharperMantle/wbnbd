export const messages = {
    en: {
        title: "WBNBD",
        subtitle: "Let Me Baidu That For You",
        placeholder: "Type your search query...",
        enginePlaceholder: `Custom search engine URL (use @QUERY@ as keyword placeholder)`,
        search: "Search",
        step1: "Step 1: Move your cursor to the search box",
        step2: "Step 2: Type your question",
        step3: "Step 3: Click search!",
    },
    zh: {
        title: "WBNBD",
        subtitle: "我帮你百度",
        placeholder: "输入你的搜索内容",
        enginePlaceholder: `自定义搜索引擎 URL（关键词处使用 @QUERY@ 占位）`,
        search: "搜索一下",
        step1: "第一步：移动光标到搜索框",
        step2: "第二步：输入你的问题",
        step3: "第三步：点击搜索！",
    },
} as const

export type Locale = keyof typeof messages
