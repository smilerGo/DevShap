# 插件简介

## 插件类型

### 脚本插件

脚本插件是简单的 Gradle 脚本文件，可以直接应用。

```kotlin
// scripts/common.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    testImplementation("junit:junit:4.13.2")
}

// build.gradle.kts
apply(from = "scripts/common.gradle.kts")
```

### 二进制插件

二进制插件是编译后的插件，通常发布到仓库。

```kotlin
// build.gradle.kts
plugins {
    id("com.example.my-plugin") version "1.0.0"
}
```

## 插件 ID 命名

### 命名规范

- **核心插件**：简短名称，如 `java`、`application`
- **社区插件**：反向域名，如 `org.springframework.boot`
- **自定义插件**：遵循反向域名规范

```kotlin
// 核心插件
plugins {
    id("java")
}

// 社区插件
plugins {
    id("org.springframework.boot") version "3.1.0"
}

// 自定义插件
plugins {
    id("com.example.my-plugin") version "1.0.0"
}
```

## 选择插件类型

### 脚本插件适用场景

- 简单的配置共享
- 项目特定的配置
- 不需要版本管理

### 二进制插件适用场景

- 可复用的功能
- 需要版本管理
- 需要发布和分发

## 总结

- **插件类型**：脚本插件和二进制插件
- **插件 ID**：遵循命名规范
- **选择原则**：根据需求选择合适类型

理解插件类型是开发 Gradle 插件的基础。

