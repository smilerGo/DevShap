# 预编译脚本插件

## 什么是预编译脚本插件？

预编译脚本插件是将 `.gradle.kts` 文件转换为可复用插件的功能，无需编译为 JAR 文件。

## 创建预编译脚本插件

### 项目结构

```
plugin-project/
├── build.gradle.kts
├── settings.gradle.kts
└── buildSrc/
    └── src/
        └── main/
            └── kotlin/
                └── my-plugin.gradle.kts
```

### 编写插件脚本

```kotlin
// buildSrc/src/main/kotlin/my-plugin.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    testImplementation("junit:junit:4.13.2")
}

tasks.test {
    useJUnitPlatform()
}
```

### 应用插件

```kotlin
// build.gradle.kts
plugins {
    id("my-plugin")
}
```

**实际应用场景**：

```kotlin
// buildSrc/src/main/kotlin/java-conventions.gradle.kts
plugins {
    id("java")
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation("junit:junit:4.13.2")
}

tasks.test {
    useJUnitPlatform()
}

// 根项目 build.gradle.kts
plugins {
    id("java-conventions")
}
```

## 最佳实践

### 1. 组织插件脚本

```kotlin
// buildSrc/src/main/kotlin/
//   - java-conventions.gradle.kts
//   - spring-boot-conventions.gradle.kts
//   - publishing-conventions.gradle.kts
```

### 2. 使用有意义的名称

```kotlin
// ✅ 推荐
// java-conventions.gradle.kts
// spring-boot-conventions.gradle.kts

// ❌ 不推荐
// plugin1.gradle.kts
// my-plugin.gradle.kts
```

## 总结

- **预编译脚本插件**：将脚本文件转换为插件
- **创建方式**：在 buildSrc 中创建 .gradle.kts 文件
- **应用方式**：使用 plugins 块
- **最佳实践**：组织脚本，使用有意义的名称

预编译脚本插件是简化构建配置的有效方式。

