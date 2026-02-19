export const messages = {
    en: {
        title: "WBNBD",
        subtitle: "Let Me Baidu That For You",
        placeholder: "Type your search query...",
        enginePlaceholder: `Custom search engine URL (use @QUERY@ as keyword placeholder)`,
        search: "Search",
        step1: "Step 1: Type your question",
        step2: "Step 2: Click the search button",
        step3: "It really is that simple!",
    },
    zh: {
        title: "WBNBD",
        subtitle: "我帮你百度",
        placeholder: "输入你的搜索内容",
        enginePlaceholder: `自定义搜索引擎 URL（关键词处使用 @QUERY@ 占位）`,
        search: "搜索一下",
        step1: "第一步：输入你的问题",
        step2: "第二步：点击搜索按钮",
        step3: "就是这么简单！",
    },
} as const

export type Locale = keyof typeof messages
