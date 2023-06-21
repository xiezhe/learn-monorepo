# docs

1. npm init @xz-ui/docs -w
2. 使用 pnpm 安装 得配置 本目录下的 package.json

```json
{
  "pnpm": {
    "peerDependencyRules": {
      "ignoreMissing": ["@algolia/client-search", "search-insights"]
    }
  }
}
```

3. 执行 `pnpm exec vitepress init`

参考文章：
[vitepress 从 0 到 1，让每个前后端小伙伴都拥有一个属于自己的博客](https://juejin.cn/post/7239341970463391781)
