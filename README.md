# monorepo

1. pnpm init
   生成 package.json; private: true
2. 根据官网创建 pnpm-wrokspace.yaml
3. 在 packages 文件夹下创建项目并 init
   要是在根目录下的 package.json 自动添加 workspaces 的话
   npm init -w 名字

4. 把包添加到 root `package.json pnpm install @xz-ui/theme-chalk -w
5. 在包下安装 pnpm i element-plus -r --filter @xz-ui/components
6. 全局安装 pnpm install vue typescript @types/node -D -w
7. 启动 play 根目录下的 package.json scripts: "dev": "pnpm -C ./packages/play dev"

pnpm setup? 在执行 pnpm -g 的时候没法全局安装 所以要执行这个命令

## typescript 配置

1. 在根路径下执行 pnpm tsc --init
2. tsconfig.json 拆分成细小颗粒

## npx eslint --init 报错

ERR_PNPM_ADDING_TO_ROOT  Running this command will add the dependency to the workspace root, which might
not be what you want - if you really meant it, make it explicit by running this command again with the -w
flag (or --workspace-root). If you don't want to see this warning anymore, you may set the ignore-workspace-root-check setting to true.

解决： `pnpm config set ignore-workspace-root-check true`
