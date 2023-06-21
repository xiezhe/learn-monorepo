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

4. 使用组件 pnpm install @xz-ui/components

5. 使用 UI，在`.vitepress/theme/index.ts`文件内

```javascript
import xzUI from "@xz-ui/components";
...
 enhanceApp({ app, router, siteData }) {
    // ...
    app.use(xzUI);
  },
....
```

参考文章：
[vitepress 从 0 到 1，让每个前后端小伙伴都拥有一个属于自己的博客](https://juejin.cn/post/7239341970463391781)
