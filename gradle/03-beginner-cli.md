# Gradle 命令行基础

## 命令行概述

Gradle 提供了强大的命令行界面（CLI），用于执行构建任务、查看项目信息、配置构建等。通过命令行，你可以完全控制构建过程。

## 基本命令格式

```bash
./gradlew [选项] [任务...]
```

**实际应用场景**：

```bash
# 执行单个任务
./gradlew build

# 执行多个任务
./gradlew clean build

# 带选项执行
./gradlew build --info

# 执行特定项目的任务（多项目构建）
./gradlew :app:build
```

## 常用命令

### 1. 查看任务列表

```bash
# 查看所有任务
./gradlew tasks

# 查看特定组的任务
./gradlew tasks --group="build"

# 查看所有任务（包括隐藏任务）
./gradlew tasks --all
```

**实际应用场景**：

```bash
# 查看构建相关任务
./gradlew tasks --group="build"
# 输出：
# Build tasks
# -----------
# assemble - Assembles the outputs of this project.
# build - Assembles and tests this project.
# buildDependents - Assembles and tests this project and all projects that depend on it.
# buildNeeded - Assembles and tests this project and all projects it depends on.
# classes - Assembles main classes.
# clean - Deletes the build directory.
# jar - Assembles a jar archive containing the main classes.
# testClasses - Assembles test classes.

# 查看验证相关任务
./gradlew tasks --group="verification"
# 输出：
# Verification tasks
# ------------------
# check - Runs all checks.
# test - Runs the unit tests.
```

### 2. 执行构建

```bash
# 完整构建（编译、测试、打包）
./gradlew build

# 仅编译（不运行测试）
./gradlew assemble

# 清理构建
./gradlew clean

# 清理后构建
./gradlew clean build
```

**实际应用场景**：

```bash
# 开发时快速构建（跳过测试）
./gradlew assemble

# CI 环境完整构建
./gradlew clean build

# 仅运行测试
./gradlew test

# 构建并发布
./gradlew build publish
```

### 3. 运行应用

```bash
# 运行主应用（需要 application 插件）
./gradlew run

# 运行特定任务
./gradlew run --args="--help"
```

**实际应用场景**：

```kotlin
// build.gradle.kts
plugins {
    id("application")
}

application {
    mainClass.set("com.example.Main")
}
```

```bash
# 运行应用
./gradlew run

# 传递参数
./gradlew run --args="--port 8080 --env production"
```

### 4. 查看项目信息

```bash
# 查看项目属性
./gradlew properties

# 查看依赖
./gradlew dependencies

# 查看特定配置的依赖
./gradlew dependencies --configuration runtimeClasspath

# 查看依赖树
./gradlew dependencies --configuration compileClasspath
```

**实际应用场景**：

```bash
# 查看所有项目属性
./gradlew properties | grep version

# 查看运行时依赖
./gradlew dependencies --configuration runtimeClasspath

# 查看测试依赖
./gradlew dependencies --configuration testRuntimeClasspath

# 查找特定依赖
./gradlew dependencies | grep slf4j
```

### 5. 查看帮助

```bash
# 查看帮助信息
./gradlew --help

# 查看任务帮助
./gradlew help --task build

# 查看 Gradle 版本
./gradlew --version
```

## 命令行选项

### 常用选项

#### --info, --debug, --quiet

```bash
# 详细输出
./gradlew build --info

# 调试输出（非常详细）
./gradlew build --debug

# 静默输出（只显示错误）
./gradlew build --quiet
```

**实际应用场景**：

```bash
# 调试构建问题
./gradlew build --debug | tee build.log

# CI 环境静默构建
./gradlew build --quiet

# 查看任务执行详情
./gradlew build --info
```

#### --stacktrace, --full-stacktrace

```bash
# 显示堆栈跟踪
./gradlew build --stacktrace

# 显示完整堆栈跟踪
./gradlew build --full-stacktrace
```

**实际应用场景**：

```bash
# 构建失败时查看详细错误
./gradlew build --stacktrace

# 插件错误时查看完整堆栈
./gradlew build --full-stacktrace
```

#### --refresh-dependencies

```bash
# 刷新依赖缓存
./gradlew build --refresh-dependencies
```

**实际应用场景**：

```bash
# 依赖更新后强制刷新
./gradlew build --refresh-dependencies

# 解决依赖冲突
./gradlew dependencies --refresh-dependencies
```

#### --no-daemon

```bash
# 不使用守护进程
./gradlew build --no-daemon
```

**实际应用场景**：

```bash
# CI 环境（某些 CI 系统不支持守护进程）
./gradlew build --no-daemon

# 调试守护进程问题
./gradlew build --no-daemon --stacktrace
```

#### --offline

```bash
# 离线模式（不使用网络）
./gradlew build --offline
```

**实际应用场景**：

```bash
# 网络受限环境
./gradlew build --offline

# 验证离线构建能力
./gradlew build --offline
```

#### --parallel

```bash
# 并行执行任务
./gradlew build --parallel
```

**实际应用场景**：

```bash
# 多模块项目并行构建
./gradlew build --parallel

# 结合 --max-workers 控制并行度
./gradlew build --parallel --max-workers=4
```

#### --build-cache

```bash
# 启用构建缓存
./gradlew build --build-cache
```

**实际应用场景**：

```bash
# 首次构建后启用缓存
./gradlew build --build-cache

# CI 环境使用远程缓存
./gradlew build --build-cache
```

### 项目选择选项

#### -p, --project-dir

```bash
# 指定项目目录
./gradlew build -p /path/to/project

# 或
./gradlew build --project-dir=/path/to/project
```

#### 多项目构建

```bash
# 执行根项目任务
./gradlew build

# 执行特定子项目任务
./gradlew :app:build

# 执行所有子项目任务
./gradlew :app:build :lib:build

# 执行依赖项目
./gradlew :app:buildNeeded
```

**实际应用场景**：

```bash
# 仅构建 app 模块
./gradlew :app:build

# 构建 app 及其依赖
./gradlew :app:buildNeeded

# 构建 app 及依赖它的项目
./gradlew :app:buildDependents

# 并行构建所有模块
./gradlew build --parallel
```

## 实际应用场景

### 场景 1：日常开发

```bash
# 快速编译（跳过测试）
./gradlew compileJava

# 运行测试
./gradlew test

# 查看测试报告
open build/reports/tests/test/index.html

# 运行特定测试类
./gradlew test --tests "com.example.UserTest"

# 运行特定测试方法
./gradlew test --tests "com.example.UserTest.testCreateUser"
```

### 场景 2：CI/CD 流程

```bash
# 完整构建流程
./gradlew clean build --info

# 发布到本地仓库
./gradlew publishToMavenLocal

# 发布到远程仓库
./gradlew publish

# 生成构建扫描
./gradlew build --scan
```

### 场景 3：依赖管理

```bash
# 查看依赖树
./gradlew dependencies

# 查看依赖更新
./gradlew dependencyUpdates

# 刷新依赖
./gradlew build --refresh-dependencies

# 查看依赖冲突
./gradlew dependencies | grep conflict
```

### 场景 4：多模块项目

```bash
# 构建所有模块
./gradlew build

# 仅构建特定模块
./gradlew :api:build

# 构建模块及其依赖
./gradlew :api:buildNeeded

# 并行构建
./gradlew build --parallel --max-workers=4
```

## 任务执行选项

### 跳过任务

```bash
# 跳过测试
./gradlew build -x test

# 跳过多个任务
./gradlew build -x test -x check

# 使用 --exclude-task
./gradlew build --exclude-task test
```

**实际应用场景**：

```bash
# 快速构建（跳过测试和检查）
./gradlew assemble -x test -x check

# 仅打包（跳过所有验证）
./gradlew jar -x test -x check
```

### 重新执行任务

```bash
# 强制重新执行（忽略增量构建）
./gradlew build --rerun-tasks
```

### 继续执行（忽略失败）

```bash
# 即使任务失败也继续执行
./gradlew build --continue
```

**实际应用场景**：

```bash
# 查看所有测试结果（即使有失败）
./gradlew test --continue

# 构建所有模块（即使某些失败）
./gradlew build --continue
```

## 性能优化选项

### --max-workers

```bash
# 限制并行工作线程数
./gradlew build --max-workers=4
```

### --no-build-cache

```bash
# 禁用构建缓存
./gradlew build --no-build-cache
```

### --no-configuration-cache

```bash
# 禁用配置缓存
./gradlew build --no-configuration-cache
```

## 组合使用示例

```bash
# 完整构建流程（CI 环境）
./gradlew clean build \
  --info \
  --stacktrace \
  --build-cache \
  --parallel \
  --max-workers=4

# 开发环境快速构建
./gradlew assemble \
  -x test \
  -x check \
  --quiet

# 调试构建问题
./gradlew build \
  --debug \
  --stacktrace \
  --no-daemon
```

## 常见问题

### Q: 如何查看任务的详细信息？

A: 使用 `./gradlew help --task <taskName>` 或 `./gradlew tasks --all`

### Q: 如何执行特定项目的任务？

A: 使用 `:projectName:taskName` 格式，如 `./gradlew :app:build`

### Q: 如何查看所有可用选项？

A: 运行 `./gradlew --help` 查看所有选项

### Q: 如何提高构建速度？

A: 
- 使用 `--parallel` 并行执行
- 使用 `--build-cache` 启用缓存
- 使用 `--max-workers` 调整并行度
- 使用守护进程（默认启用）

### Q: 如何调试构建问题？

A: 
- 使用 `--debug` 查看详细日志
- 使用 `--stacktrace` 查看堆栈跟踪
- 使用 `--info` 查看信息输出

## 总结

- **基本命令**：tasks、build、clean、test、run 等
- **常用选项**：--info、--debug、--stacktrace、--parallel 等
- **项目选择**：使用 `:projectName:taskName` 执行特定项目任务
- **性能优化**：使用 --parallel、--build-cache 等选项
- **调试技巧**：使用 --debug、--stacktrace 查看详细信息

掌握命令行使用是高效使用 Gradle 的关键，它让你能够灵活控制构建过程。


