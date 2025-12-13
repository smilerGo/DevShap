# Gradle 使用手册

欢迎使用 Gradle 使用手册！本手册基于 Gradle 9.2.1，涵盖了从基础到高级的所有内容，每个章节都配有详细的代码示例和实际应用场景。

> **提示**：Gradle 强烈推荐使用 **Kotlin DSL**（`build.gradle.kts`）以获得更好的 IDE 支持和类型安全。

## 目录

### 一、面向初学者（Beginner）

适合无 Gradle 经验的用户，快速上手基础操作。

1. [核心概念](./01-beginner-core-concepts.md)
   - Gradle 是什么
   - 构建脚本、任务、项目的基本关系
   - 核心概念理解

2. [Wrapper 基础](./02-beginner-wrapper.md)
   - 使用 Gradle Wrapper
   - 初始化项目
   - Wrapper 文件说明

3. [命令行基础](./03-beginner-cli.md)
   - 常用命令
   - 任务执行
   - 命令行选项

4. [Settings 文件基础](./04-beginner-settings.md)
   - settings.gradle.kts 文件
   - 项目名称定义
   - 多模块项目配置

5. [构建文件基础](./05-beginner-build-files.md)
   - build.gradle.kts 文件
   - 插件声明
   - 基本配置

6. [依赖管理基础](./06-beginner-dependencies.md)
   - 仓库声明
   - 依赖添加
   - 依赖配置（implementation、testImplementation 等）

7. [任务基础](./07-beginner-tasks.md)
   - 任务概念
   - 自定义任务
   - 任务执行

8. [增量构建与构建缓存](./08-beginner-incremental-builds.md)
   - 增量构建原理
   - 构建缓存启用
   - 性能优化

9. [插件基础](./09-beginner-plugins.md)
   - 插件应用
   - 常用插件
   - 插件配置

10. [构建扫描](./10-beginner-build-scan.md)
    - Build Scan 介绍
    - 生成构建报告
    - 性能分析

### 二、面向构建工程师（Intermediate）

适合需要自定义构建逻辑的开发者。

11. [Gradle 构建的解剖](./11-intermediate-anatomy.md)
    - 项目结构
    - 脚本评估顺序
    - 配置阶段 vs 执行阶段

12. [多项目构建结构](./12-intermediate-multi-project.md)
    - 根项目与子项目
    - 共享配置
    - 项目依赖

13. [Gradle 构建生命周期](./13-intermediate-lifecycle.md)
    - 初始化阶段
    - 配置阶段
    - 执行阶段
    - 生命周期钩子

14. [编写构建脚本](./14-intermediate-build-scripts.md)
    - Kotlin DSL 最佳实践
    - 脚本组织
    - 性能优化

15. [Gradle 托管类型](./15-intermediate-managed-types.md)
    - Property<T> 类型
    - ListProperty<T> 类型
    - 延迟配置

16. [声明与管理依赖](./16-intermediate-dependency-management.md)
    - 版本目录（Version Catalogs）
    - 依赖约束
    - 依赖解析

17. [创建与注册任务](./17-intermediate-creating-tasks.md)
    - tasks.register() 使用
    - 输入/输出声明
    - 增量构建支持

18. [使用插件](./18-intermediate-working-with-plugins.md)
    - 插件扩展配置
    - 插件间通信
    - 自定义插件应用

### 三、面向插件开发者（Advanced）

适合需要开发可复用 Gradle 插件的开发者。

19. [插件简介](./19-advanced-plugin-intro.md)
    - 脚本插件 vs 二进制插件
    - 插件 ID 命名规范
    - 插件类型选择

20. [预编译脚本插件](./20-advanced-precompiled-scripts.md)
    - 预编译脚本插件概念
    - 创建预编译脚本插件
    - 应用预编译脚本插件

21. [二进制插件开发](./21-advanced-binary-plugins.md)
    - 插件类编写
    - Plugin<Project> 接口实现
    - 任务注册
    - 扩展添加

22. [二进制插件发布](./22-advanced-plugin-publishing.md)
    - 发布到 Maven 仓库
    - maven-publish 插件使用
    - 版本管理
    - 发布流程

## 学习路径建议

### 初学者路径

1. 从 [核心概念](./01-beginner-core-concepts.md) 开始，了解 Gradle 的基本概念
2. 学习 [Wrapper 基础](./02-beginner-wrapper.md) 和 [命令行基础](./03-beginner-cli.md)
3. 掌握 [构建文件基础](./05-beginner-build-files.md) 和 [依赖管理基础](./06-beginner-dependencies.md)
4. 学习 [任务基础](./07-beginner-tasks.md) 和 [插件基础](./09-beginner-plugins.md)
5. 了解 [增量构建与构建缓存](./08-beginner-incremental-builds.md) 提升构建性能

### 构建工程师路径

1. 深入学习 [Gradle 构建的解剖](./11-intermediate-anatomy.md) 和 [构建生命周期](./13-intermediate-lifecycle.md)
2. 掌握 [多项目构建结构](./12-intermediate-multi-project.md)
3. 学习 [编写构建脚本](./14-intermediate-build-scripts.md) 最佳实践
4. 掌握 [Gradle 托管类型](./15-intermediate-managed-types.md) 和 [依赖管理](./16-intermediate-dependency-management.md)
5. 学习 [创建与注册任务](./17-intermediate-creating-tasks.md) 和 [使用插件](./18-intermediate-working-with-plugins.md)

### 插件开发者路径

1. 了解 [插件简介](./19-advanced-plugin-intro.md)
2. 学习 [预编译脚本插件](./20-advanced-precompiled-scripts.md)
3. 掌握 [二进制插件开发](./21-advanced-binary-plugins.md)
4. 学习 [二进制插件发布](./22-advanced-plugin-publishing.md)

## 快速参考

### 常用命令

```bash
# 查看所有任务
./gradlew tasks

# 执行构建
./gradlew build

# 清理构建
./gradlew clean

# 运行应用
./gradlew run

# 查看帮助
./gradlew --help

# 生成构建扫描
./gradlew build --scan
```

### 常用插件

```kotlin
// Java 项目
plugins {
    id("java")
}

// 应用程序
plugins {
    id("application")
}

// 发布到 Maven
plugins {
    id("maven-publish")
}
```

### 依赖配置

```kotlin
dependencies {
    // 编译时依赖
    implementation("org.slf4j:slf4j-api:2.0.7")
    
    // 测试依赖
    testImplementation("junit:junit:4.13.2")
    
    // 运行时依赖
    runtimeOnly("org.postgresql:postgresql:42.5.0")
}
```

## 资源链接

- [Gradle 官方文档](https://docs.gradle.org/current/userguide/getting_started.html)
- [Gradle Forums](https://discuss.gradle.org/)
- [GitHub Issues](https://github.com/gradle/gradle/issues)
- [Groovy DSL 参考](https://docs.gradle.org/current/dsl/)
- [Kotlin DSL 参考](https://docs.gradle.org/current/kotlin-dsl/)
- [API 文档](https://docs.gradle.org/current/javadoc/)

---

**祝学习愉快！** 🎉





