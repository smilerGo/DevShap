# 构建扫描

## 什么是构建扫描？

构建扫描（Build Scan）是 Gradle 提供的构建分析和可视化工具，可以生成详细的构建报告，帮助识别构建性能问题、依赖问题和其他构建相关信息。

## 构建扫描的功能

1. **性能分析**：识别构建瓶颈和慢任务
2. **依赖分析**：查看依赖关系和版本冲突
3. **测试报告**：查看测试执行情况
4. **任务执行**：查看任务执行顺序和耗时
5. **环境信息**：查看构建环境配置

## 启用构建扫描

### 方法 1：命令行启用

```bash
# 生成构建扫描
./gradlew build --scan

# 首次使用需要接受许可协议
# 扫描结果会上传到 scans.gradle.com
```

**实际应用场景**：

```bash
# 完整构建并生成扫描
./gradlew clean build --scan

# 仅测试并生成扫描
./gradlew test --scan

# 多项目构建扫描
./gradlew build --scan
```

### 方法 2：在构建脚本中启用

```kotlin
// build.gradle.kts
plugins {
    id("com.gradle.build-scan") version "3.0"
}

buildScan {
    termsOfServiceUrl = "https://gradle.com/terms-of-service"
    termsOfServiceAgree = "yes"
    
    // 发布扫描
    publishAlways()
}
```

**实际应用场景**：

```kotlin
// build.gradle.kts
plugins {
    id("com.gradle.build-scan") version "3.0"
}

buildScan {
    termsOfServiceUrl = "https://gradle.com/terms-of-service"
    termsOfServiceAgree = "yes"
    
    // 总是发布（开发环境）
    if (project.hasProperty("buildScan.always")) {
        publishAlways()
    }
    
    // 仅在失败时发布（CI 环境）
    if (project.hasProperty("buildScan.onFailure")) {
        publishOnFailure()
    }
    
    // 添加自定义标签
    tag(project.findProperty("env") as String? ?: "local")
    tag(project.name)
    
    // 添加自定义值
    value("Git Commit", project.findProperty("git.commit") as String? ?: "unknown")
    value("Build Number", project.findProperty("build.number") as String? ?: "local")
}
```

## 查看构建扫描

### 在线查看

执行 `./gradlew build --scan` 后，Gradle 会：

1. 上传扫描结果到 `scans.gradle.com`
2. 在控制台输出扫描 URL
3. 可以在浏览器中打开 URL 查看详细报告

### 扫描报告内容

构建扫描报告包含：

- **构建概览**：构建时间、任务数量、成功率
- **性能**：最慢的任务、构建阶段耗时
- **依赖**：依赖图、版本冲突、更新建议
- **测试**：测试结果、失败测试详情
- **环境**：Java 版本、操作系统、Gradle 版本
- **任务**：任务执行顺序、依赖关系、耗时

## 实际应用场景

### 场景 1：性能优化

```bash
# 生成构建扫描
./gradlew build --scan

# 查看报告中的性能部分
# - 识别最慢的任务
# - 查看任务执行时间
# - 分析构建阶段耗时
```

**分析步骤**：

1. 打开构建扫描报告
2. 查看"Performance"部分
3. 识别最慢的任务
4. 优化慢任务（添加输入/输出、启用缓存等）
5. 重新生成扫描对比改进

### 场景 2：依赖分析

```bash
# 生成依赖扫描
./gradlew dependencies --scan

# 查看报告中的依赖部分
# - 依赖关系图
# - 版本冲突
# - 可更新的依赖
```

**分析步骤**：

1. 打开构建扫描报告
2. 查看"Dependencies"部分
3. 识别版本冲突
4. 查看可更新的依赖
5. 解决冲突并更新依赖

### 场景 3：CI/CD 集成

```kotlin
// build.gradle.kts
plugins {
    id("com.gradle.build-scan") version "3.0"
}

buildScan {
    termsOfServiceUrl = "https://gradle.com/terms-of-service"
    termsOfServiceAgree = "yes"
    
    // CI 环境配置
    if (System.getenv("CI") == "true") {
        tag("CI")
        value("CI System", System.getenv("CI_SYSTEM") ?: "unknown")
        value("Build Number", System.getenv("BUILD_NUMBER") ?: "unknown")
        publishOnFailure()
    }
}
```

**CI 配置示例**：

```yaml
# GitHub Actions
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Build with scan
        run: ./gradlew build --scan
        env:
          CI: 'true'
          CI_SYSTEM: 'GitHub Actions'
          BUILD_NUMBER: ${{ github.run_number }}
```

## 构建扫描配置

### 基本配置

```kotlin
buildScan {
    termsOfServiceUrl = "https://gradle.com/terms-of-service"
    termsOfServiceAgree = "yes"
    
    // 发布策略
    publishAlways()           // 总是发布
    publishOnFailure()        // 仅在失败时发布
    publishIfAuthenticated()  // 仅在认证时发布
}
```

### 添加标签和值

```kotlin
buildScan {
    // 添加标签
    tag("production")
    tag("backend")
    tag(project.name)
    
    // 添加值
    value("Version", project.version.toString())
    value("Branch", project.findProperty("git.branch") as String?)
    value("Commit", project.findProperty("git.commit") as String?)
}
```

**实际应用场景**：

```kotlin
buildScan {
    termsOfServiceUrl = "https://gradle.com/terms-of-service"
    termsOfServiceAgree = "yes"
    
    // 环境标签
    tag(System.getProperty("os.name"))
    tag(JavaVersion.current().toString())
    
    // 项目信息
    tag(project.name)
    value("Project Version", project.version.toString())
    value("Project Group", project.group.toString())
    
    // Git 信息
    val gitBranch = project.findProperty("git.branch") as String? ?: "unknown"
    val gitCommit = project.findProperty("git.commit") as String? ?: "unknown"
    tag(gitBranch)
    value("Git Branch", gitBranch)
    value("Git Commit", gitCommit)
    
    // 发布策略
    if (project.hasProperty("buildScan.publish")) {
        publishAlways()
    } else {
        publishOnFailure()
    }
}
```

### 链接到其他系统

```kotlin
buildScan {
    // 链接到 CI 系统
    link("CI Build", "https://ci.example.com/build/${System.getenv("BUILD_ID")}")
    
    // 链接到版本控制
    link("Source", "https://github.com/example/project/commit/${gitCommit}")
    
    // 链接到问题跟踪
    link("Issue", "https://github.com/example/project/issues/${issueId}")
}
```

## 本地构建扫描

### 使用 Develocity（原 Gradle Enterprise）

```kotlin
// settings.gradle.kts
plugins {
    id("com.gradle.develocity") version "3.0"
}

develocity {
    server = "https://ge.example.com"
    
    buildScan {
        publishAlways()
        uploadInBackground = false
    }
}
```

**企业环境配置**：

```kotlin
// settings.gradle.kts
plugins {
    id("com.gradle.develocity") version "3.0"
}

develocity {
    server = uri("https://ge.company.com")
    
    buildScan {
        publishAlways()
        uploadInBackground = false
        
        // 认证
        server = uri("https://ge.company.com")
        allowUntrustedServer = false
    }
}
```

## 最佳实践

### 1. 在 CI 中启用

```kotlin
// build.gradle.kts
buildScan {
    if (System.getenv("CI") == "true") {
        tag("CI")
        publishOnFailure()
    }
}
```

### 2. 添加有用的标签和值

```kotlin
buildScan {
    tag(project.name)
    tag(System.getProperty("os.name"))
    value("Java Version", JavaVersion.current().toString())
    value("Gradle Version", GradleVersion.current().version)
}
```

### 3. 保护敏感信息

```kotlin
buildScan {
    // 不要添加敏感信息
    // value("Password", password)  // ❌ 不要这样做
    
    // 使用环境变量或属性文件
    value("Environment", System.getenv("ENV") ?: "local")
}
```

## 常见问题

### Q: 构建扫描是免费的吗？

A: 公共扫描（scans.gradle.com）是免费的，但有限制。企业可以使用 Develocity（原 Gradle Enterprise）获得更多功能。

### Q: 如何禁用构建扫描？

A: 不添加 `--scan` 选项，或移除构建扫描插件配置。

### Q: 构建扫描会泄露敏感信息吗？

A: 可能。不要在扫描中添加密码、密钥等敏感信息。使用标签和值时要小心。

### Q: 如何查看本地构建扫描？

A: 使用 Develocity 或 Gradle Enterprise 可以查看本地扫描。

## 总结

- **构建扫描**提供详细的构建分析和可视化
- **启用方式**：命令行 `--scan` 或插件配置
- **功能**：性能分析、依赖分析、测试报告等
- **CI 集成**：在 CI 环境中自动生成扫描
- **最佳实践**：添加标签和值、保护敏感信息、在 CI 中启用

构建扫描是优化构建性能和诊断问题的强大工具，建议在开发和 CI 环境中使用。

