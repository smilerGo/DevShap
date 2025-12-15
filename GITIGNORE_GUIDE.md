# Gitignore 规则介绍

## 目录
1. [什么是 .gitignore](#什么是-gitignore)
2. [基本语法规则](#基本语法规则)
3. [本项目 Gitignore 规则详解](#本项目-gitignore-规则详解)
4. [常见技术栈的 Gitignore 规则](#常见技术栈的-gitignore-规则)
5. [最佳实践](#最佳实践)
6. [常见问题](#常见问题)

---

## 什么是 .gitignore

`.gitignore` 是 Git 版本控制系统中的一个配置文件，用于指定哪些文件或目录应该被 Git 忽略，不会被提交到版本库中。

### 为什么需要 .gitignore？

- **避免提交不必要的文件**：如编译产物、依赖包、临时文件等
- **保护敏感信息**：如 API 密钥、密码、配置文件等
- **减少仓库体积**：排除大型文件和不必要的文件
- **提高协作效率**：避免团队成员之间的文件冲突

---

## 基本语法规则

### 1. 注释
以 `#` 开头的行是注释，会被忽略。

```gitignore
# 这是一个注释
# 忽略所有 .log 文件
*.log
```

### 2. 匹配模式

#### 通配符
- `*`：匹配零个或多个字符（除了路径分隔符 `/`）
- `?`：匹配单个字符
- `**`：匹配任意层级的目录

```gitignore
# 匹配所有 .class 文件
*.class

# 匹配所有 .txt 文件（任意目录）
**/*.txt

# 匹配任意层级的 node_modules
**/node_modules/
```

#### 路径匹配
- `/` 开头：只匹配根目录下的文件
- `/` 结尾：只匹配目录，不匹配文件
- 无 `/`：匹配文件和目录

```gitignore
# 只匹配根目录下的 build 目录
/build

# 匹配所有目录下的 build 目录
build/

# 匹配 build 文件或目录
build
```

### 3. 否定规则（取反）
以 `!` 开头表示否定，用于排除某些被忽略的文件。

```gitignore
# 忽略所有 .log 文件
*.log

# 但不忽略 important.log
!important.log
```

### 4. 转义字符
使用反斜杠 `\` 转义特殊字符。

```gitignore
# 匹配文件名包含 * 的文件
\*.txt
```

---

## 本项目 Gitignore 规则详解

当前项目的 `.gitignore` 文件包含以下规则：

```gitignore
# Ignore Gradle project-specific cache directory
.gradle

# Ignore Gradle build output directory
build

.idea

.vscode

**/*/node_modules/

**/*/bin/

**/*/dist*/
```

### 规则说明

#### 1. `.gradle`
- **作用**：忽略 Gradle 缓存目录
- **说明**：Gradle 会在项目根目录创建 `.gradle` 文件夹存储缓存和配置，这些文件是本地生成的，不需要版本控制

#### 2. `build`
- **作用**：忽略所有 `build` 目录
- **说明**：Gradle 编译后的输出目录，包含 `.class` 文件、JAR 包等编译产物，这些可以通过构建工具重新生成

#### 3. `.idea`
- **作用**：忽略 IntelliJ IDEA 的配置目录
- **说明**：包含 IDE 的个人设置、工作区配置等，这些通常是开发者个人的偏好设置

#### 4. `.vscode`
- **作用**：忽略 VS Code 的配置目录
- **说明**：包含 VS Code 的工作区设置、调试配置等，这些配置因人而异

#### 5. `**/*/node_modules/`
- **作用**：忽略所有子目录中的 `node_modules` 文件夹
- **说明**：Node.js 的依赖包目录，体积庞大，可以通过 `npm install` 或 `yarn install` 重新安装

#### 6. `**/*/bin/`
- **作用**：忽略所有子目录中的 `bin` 目录
- **说明**：Java 编译后的字节码文件目录，包含 `.class` 文件

#### 7. `**/*/dist*/`
- **作用**：忽略所有以 `dist` 开头的目录（如 `dist`、`dist-electron` 等）
- **说明**：前端构建后的输出目录，包含打包后的静态资源文件

---

## 常见技术栈的 Gitignore 规则

### Java / Gradle 项目

```gitignore
# Gradle
.gradle/
build/
!gradle/wrapper/gradle-wrapper.jar
!**/src/main/**/build/
!**/src/test/**/build/

# IntelliJ IDEA
.idea/
*.iws
*.iml
*.ipr
out/

# Eclipse
.classpath
.project
.settings/
bin/

# NetBeans
nbproject/private/
build/
nbbuild/
dist/
nbdist/
.nb-gradle/

# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties
.mvn/wrapper/maven-wrapper.jar
```

### Node.js / TypeScript / Vue 项目

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Build outputs
dist/
dist-*/
build/
*.local

# Environment variables
.env
.env.local
.env.*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Testing
coverage/
*.lcov
.nyc_output

# TypeScript
*.tsbuildinfo
```

### Electron 项目

```gitignore
# Electron
dist-electron/
*.app
*.dmg
*.exe
*.deb
*.rpm
*.AppImage
*.snap

# Electron Builder
dist-electron/
```

### 通用规则

```gitignore
# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
Desktop.ini

# Logs
*.log
logs/
*.log.*

# Temporary files
*.tmp
*.temp
*.swp
*.swo
*~

# Archives
*.zip
*.tar
*.tar.gz
*.rar
*.7z

# Database
*.db
*.sqlite
*.sqlite3
```

---

## 最佳实践

### 1. 项目结构考虑
根据项目类型和结构，选择合适的忽略规则：

```gitignore
# 多模块项目：使用 ** 匹配所有子模块
**/build/
**/target/

# 单模块项目：直接指定路径
build/
target/
```

### 2. 敏感信息保护
**永远不要提交**以下类型的文件：

```gitignore
# 密钥和证书
*.key
*.pem
*.p12
*.jks
secrets/
credentials/

# 配置文件中的敏感信息
config.properties
application-local.yml
.env
.env.local
```

### 3. 依赖管理
依赖包应该被忽略，但依赖管理文件应该提交：

```gitignore
# 忽略依赖包
node_modules/
.gradle/caches/

# 但提交依赖管理文件
!package.json
!package-lock.json
!build.gradle
!gradle/wrapper/gradle-wrapper.properties
```

### 4. 构建产物
所有构建产物都应该被忽略：

```gitignore
# Java
build/
target/
*.class
*.jar
*.war

# JavaScript/TypeScript
dist/
build/
*.js.map

# 但保留源代码
!src/**/*.java
!src/**/*.ts
```

### 5. IDE 配置
个人 IDE 配置应该忽略，但团队共享的配置可以提交：

```gitignore
# 个人配置
.idea/workspace.xml
.idea/tasks.xml
.idea/dictionaries/
.vscode/settings.json

# 但可以提交团队共享配置
!.vscode/extensions.json
!.vscode/launch.json
```

---

## 常见问题

### Q1: 如何检查哪些文件被忽略了？

```bash
# 查看被忽略的文件
git status --ignored

# 或者使用
git ls-files --others --ignored --exclude-standard
```

### Q2: 已经提交的文件如何忽略？

如果文件已经被 Git 跟踪，需要先从 Git 中移除：

```bash
# 从 Git 中移除但保留本地文件
git rm --cached <file>

# 从 Git 中移除整个目录
git rm -r --cached <directory>

# 然后添加到 .gitignore
echo "<file>" >> .gitignore
git add .gitignore
git commit -m "Add to gitignore"
```

### Q3: 如何忽略特定扩展名的文件？

```gitignore
# 忽略所有 .log 文件
*.log

# 忽略特定目录下的 .log 文件
logs/*.log

# 忽略所有目录下的 .log 文件
**/*.log
```

### Q4: 如何只忽略根目录的文件？

```gitignore
# 只忽略根目录的 README.txt
/README.txt

# 忽略所有 README.txt（包括子目录）
README.txt
```

### Q5: 如何排除某些被忽略的文件？

```gitignore
# 忽略所有 .txt 文件
*.txt

# 但不忽略 important.txt
!important.txt

# 注意：如果父目录被忽略，需要先取消忽略父目录
!logs/
!logs/*.txt
logs/**/*.txt
!logs/important.txt
```

### Q6: 多个 .gitignore 文件的优先级？

Git 会按照以下顺序查找 `.gitignore` 文件：
1. 项目根目录的 `.gitignore`
2. 子目录的 `.gitignore`（会覆盖父目录的规则）
3. 全局的 `.gitignore`（通过 `git config --global core.excludesfile` 设置）

### Q7: 如何验证 .gitignore 规则？

```bash
# 使用 git check-ignore 命令
git check-ignore -v <file>

# 示例
git check-ignore -v build/classes
# 输出：.gitignore:5:build    build/classes
```

---

## 推荐资源

- [Git 官方文档 - gitignore](https://git-scm.com/docs/gitignore)
- [GitHub 官方 gitignore 模板](https://github.com/github/gitignore)
- [gitignore.io](https://www.toptal.com/developers/gitignore) - 在线生成 .gitignore 文件

---

## 总结

`.gitignore` 是 Git 项目管理中不可或缺的工具。正确配置 `.gitignore` 可以：

✅ 保持仓库整洁  
✅ 保护敏感信息  
✅ 提高协作效率  
✅ 减少不必要的冲突  

建议定期检查和更新 `.gitignore` 文件，确保它符合项目当前的需求。

