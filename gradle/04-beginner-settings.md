# Settings 文件基础

## 什么是 Settings 文件？

Settings 文件（`settings.gradle` 或 `settings.gradle.kts`）是 Gradle 构建的入口点，用于定义项目层次结构、配置项目名称和包含的子项目。Gradle 在执行任何构建脚本之前，首先会查找并执行 Settings 文件。

## Settings 文件的作用

1. **定义项目名称**：设置根项目的名称
2. **包含子项目**：声明多模块项目中的子项目
3. **配置构建**：设置构建级别的配置
4. **插件管理**：管理插件版本和仓库

## 基本结构

### 单项目 Settings 文件

```kotlin
// settings.gradle.kts
rootProject.name = "my-app"
```

**实际应用场景**：

```kotlin
// 简单的单项目应用
// settings.gradle.kts
rootProject.name = "todo-app"

// build.gradle.kts
plugins {
    id("java")
    id("application")
}

application {
    mainClass.set("com.example.TodoApp")
}
```

### 多项目 Settings 文件

```kotlin
// settings.gradle.kts
rootProject.name = "my-project"

include("app")
include("lib")
```

**实际应用场景**：

```kotlin
// 多模块 Spring Boot 项目
// settings.gradle.kts
rootProject.name = "spring-boot-multi-module"

include("api")
include("service")
include("repository")
include("common")

// 项目目录结构
// spring-boot-multi-module/
//   ├── settings.gradle.kts
//   ├── build.gradle.kts
//   ├── api/
//   │   └── build.gradle.kts
//   ├── service/
//   │   └── build.gradle.kts
//   ├── repository/
//   │   └── build.gradle.kts
//   └── common/
//       └── build.gradle.kts
```

## 常用配置

### 1. 设置项目名称

```kotlin
// settings.gradle.kts
rootProject.name = "my-application"

// 默认情况下，项目名称是目录名
// 使用 rootProject.name 可以覆盖默认名称
```

**实际应用场景**：

```kotlin
// 项目目录：my-awesome-project
// 但希望项目名称是：awesome-app
rootProject.name = "awesome-app"

// 构建输出会使用新名称
// 例如：awesome-app-1.0.0.jar
```

### 2. 包含子项目

```kotlin
// settings.gradle.kts
rootProject.name = "multi-module-project"

// 包含单个子项目
include("app")

// 包含多个子项目
include("app", "lib", "utils")

// 包含嵌套子项目
include("app")
include("app:web")
include("app:api")
```

**实际应用场景**：

```kotlin
// 大型企业应用结构
rootProject.name = "enterprise-app"

// 核心模块
include("core")
include("core:domain")
include("core:infrastructure")

// 应用模块
include("app")
include("app:web")
include("app:mobile")

// 共享模块
include("shared")
include("shared:common")
include("shared:utils")
```

### 3. 项目路径映射

```kotlin
// settings.gradle.kts
rootProject.name = "my-project"

// 默认：项目名称 = 目录名称
include("app")

// 自定义项目路径
include("app")
project(":app").projectDir = file("applications/app")

// 或使用更简洁的方式
include("app")
project(":app").projectDir = file("apps/main")
```

**实际应用场景**：

```kotlin
// 非标准目录结构
rootProject.name = "legacy-project"

// 项目实际在 legacy/app 目录
include("app")
project(":app").projectDir = file("legacy/app")

// 多个项目路径映射
include("api", "web")
project(":api").projectDir = file("backend/api")
project(":web").projectDir = file("frontend/web")
```

### 4. 插件管理

```kotlin
// settings.gradle.kts
rootProject.name = "my-project"

// 插件管理块
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
    
    // 解析策略
    resolutionStrategy {
        eachPlugin {
            if (requested.id.id == "com.example.custom-plugin") {
                useModule("com.example:custom-plugin:1.0.0")
            }
        }
    }
}

// 依赖解析
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        mavenCentral()
        google()
    }
}

include("app")
```

**实际应用场景**：

```kotlin
// 企业项目：统一管理插件版本
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
        // 内部 Maven 仓库
        maven {
            url = uri("https://repo.company.com/releases")
        }
    }
    
    // 统一插件版本
    plugins {
        id("org.springframework.boot") version "3.1.0"
        id("io.spring.dependency-management") version "1.1.0"
        id("org.jetbrains.kotlin.jvm") version "1.9.0"
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        mavenCentral()
        // 内部仓库优先
        maven {
            url = uri("https://repo.company.com/releases")
            isAllowInsecureProtocol = false
        }
    }
}

rootProject.name = "company-project"
include("app", "lib")
```

## 实际项目示例

### 示例 1：标准多模块项目

```kotlin
// settings.gradle.kts
rootProject.name = "e-commerce-platform"

include(":api")
include(":service")
include(":repository")
include(":common")

// 项目结构
// e-commerce-platform/
//   ├── settings.gradle.kts
//   ├── build.gradle.kts
//   ├── api/
//   ├── service/
//   ├── repository/
//   └── common/
```

### 示例 2：嵌套模块项目

```kotlin
// settings.gradle.kts
rootProject.name = "microservices"

// 服务模块
include(":services")
include(":services:user-service")
include(":services:order-service")
include(":services:payment-service")

// 共享模块
include(":shared")
include(":shared:common")
include(":shared:utils")

// 基础设施模块
include(":infrastructure")
include(":infrastructure:database")
include(":infrastructure:messaging")
```

### 示例 3：Spring Boot 多模块

```kotlin
// settings.gradle.kts
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
    plugins {
        id("org.springframework.boot") version "3.1.0"
        id("io.spring.dependency-management") version "1.1.0"
    }
}

rootProject.name = "spring-boot-app"

include(":api")
include(":service")
include(":repository")
include(":domain")
```

### 示例 4：Android 多模块项目

```kotlin
// settings.gradle.kts
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "android-app"

include(":app")
include(":core")
include(":feature:home")
include(":feature:profile")
include(":feature:settings")
```

## 高级配置

### 条件包含项目

```kotlin
// settings.gradle.kts
rootProject.name = "my-project"

include("app")

// 根据条件包含项目
if (System.getProperty("include.experimental") == "true") {
    include("experimental")
}
```

### 动态项目配置

```kotlin
// settings.gradle.kts
rootProject.name = "dynamic-project"

// 动态包含所有子目录
file("modules").listFiles()?.forEach { file ->
    if (file.isDirectory) {
        include(":${file.name}")
        project(":${file.name}").projectDir = file
    }
}
```

### 项目构建名称

```kotlin
// settings.gradle.kts
rootProject.name = "my-project"

// 自定义构建名称
gradle.beforeProject {
    if (it.name == "app") {
        it.buildFileName = "app-build.gradle.kts"
    }
}
```

## 最佳实践

### 1. 使用 Kotlin DSL

```kotlin
// ✅ 推荐：使用 Kotlin DSL
// settings.gradle.kts
rootProject.name = "my-project"
include("app")

// ❌ 不推荐：使用 Groovy DSL（除非必要）
// settings.gradle
rootProject.name = 'my-project'
include 'app'
```

### 2. 统一项目命名

```kotlin
// ✅ 推荐：明确设置项目名称
rootProject.name = "my-application"

// ❌ 不推荐：依赖默认目录名
// 可能导致构建输出名称不一致
```

### 3. 合理组织子项目

```kotlin
// ✅ 推荐：清晰的模块划分
rootProject.name = "my-project"
include(":api")
include(":service")
include(":repository")

// ❌ 不推荐：过于扁平或过于嵌套
```

### 4. 使用插件管理

```kotlin
// ✅ 推荐：在 settings.gradle.kts 中统一管理插件
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
    plugins {
        id("org.springframework.boot") version "3.1.0"
    }
}
```

## 常见问题

### Q: Settings 文件是必需的吗？

A: 对于单项目，Settings 文件是可选的，Gradle 会使用默认值。对于多项目构建，Settings 文件是必需的。

### Q: 可以在 Settings 文件中执行任务吗？

A: 不可以。Settings 文件只在配置阶段执行，用于设置项目结构，不能执行任务。

### Q: 如何重命名项目？

A: 修改 `rootProject.name` 即可，但要注意这会影响构建输出名称。

### Q: 如何排除某个子项目？

A: 使用 `exclude()` 方法，或者简单地不包含它。

```kotlin
include("app", "lib")
exclude("lib")  // 排除 lib 项目
```

## 总结

- **Settings 文件**是 Gradle 构建的入口点
- **定义项目结构**：设置项目名称和包含子项目
- **插件管理**：统一管理插件版本和仓库
- **依赖解析**：配置依赖仓库和解析策略
- **多项目支持**：轻松管理大型多模块项目

掌握 Settings 文件的配置是管理 Gradle 项目的基础，特别是对于多模块项目。

