# wbnbd

A demonstrative app for trying out agentic development (or colloquially, Vibe Coding).

## Build

```console
$ pnpm install
$ pnpm run build
$ pnpm run start
$ # or
$ pnpm run dev
```

## Notes on LLM usage

Commits involving agentic LLMs are highlighted with trailer `Assisted-by` with model name and provider. Often, the prompt to the LLM is also attached in the commit message.

Commits not marked with `Assisted-by` are written purely by a human.

An LLM assisted commit is as follows:

```console
$ jj show --no-patch eae371c88bcf73ff45b51404301f5e7387cf1dd2
Commit ID: eae371c88bcf73ff45b51404301f5e7387cf1dd2
Change ID: nwxtprzkwrspusxqmqtvuuyktxpkqtwu
Author   : Rong Bao <rong.bao@csmantle.top> (2026-02-19 14:14:46)
Committer: Rong Bao <rong.bao@csmantle.top> (2026-02-19 14:20:49)

    Add responsiveness to narrow screens

    Prompt:

    ```plain-text
    Currently, this page works well on desktop, but layouts awkwardly on mobile.
    Please add responsive layout for mobile; On narrow screens, the Search Input
    Box and Search Button should maintain a 3-to-1 ratio on the same row. Please
    also adapt the link row to narrow screens.

    The Search Button now will wrap on narrow screen. Please stop it from wrapping,
    if needed it is okay to shrink out the Search Bar's space. The tooltip inside
    Search Bar should truncate and show ellipsis (...) if overflowed.
    ```

    Assisted-by: GPT-5.3-Codex (GitHub Copilot)
```

[/AGENTS.md](/AGENTS.md) contains the general instructions used throughout the whole process. Each prompt will have this file attached or referenced, depending on the specific agentic tool.
