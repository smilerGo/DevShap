# 使用插件

## 插件扩展

### 配置插件扩展

```kotlin
plugins {
    id("java")
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    withSourcesJar()
}
```

**实际应用场景**：

```kotlin
plugins {
    id("application")
}

application {
    mainClass.set("com.example.Main")
    applicationName = "my-app"
}

plugins {
    id("org.springframework.boot") version "3.1.0"
}

springBoot {
    buildInfo {
        properties {
            artifact.set("my-app")
        }
    }
}
```

## 插件间通信

### 访问其他插件的扩展

```kotlin
plugins {
    id("java")
    id("maven-publish")
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])
            
            // 使用 Java 插件的配置
            pom {
                name.set(project.name)
            }
        }
    }
}
```

## 自定义插件应用

### 应用自定义插件

```kotlin
// build.gradle.kts
plugins {
    id("com.example.my-plugin") version "1.0.0"
}

// 或使用 apply
apply(plugin = "com.example.my-plugin")
```

## 最佳实践

### 1. 统一插件版本

```kotlin
// settings.gradle.kts
pluginManagement {
    plugins {
        id("org.springframework.boot") version "3.1.0"
    }
}

// build.gradle.kts
plugins {
    id("org.springframework.boot")  // 无需版本
}
```

## 总结

- **插件扩展**：配置插件提供的扩展
- **插件间通信**：访问其他插件的配置
- **自定义插件**：应用和配置自定义插件
- **最佳实践**：统一管理插件版本

掌握插件使用是高效使用 Gradle 的关键。

