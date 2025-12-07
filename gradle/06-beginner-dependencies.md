# 依赖管理基础

## 什么是依赖管理？

依赖管理是 Gradle 的核心功能之一，用于声明、解析和管理项目所需的外部库。Gradle 自动下载依赖、处理版本冲突，并构建依赖图。

## 依赖配置

### 常用依赖配置

```kotlin
// build.gradle.kts
dependencies {
    // 编译时依赖（传递）
    implementation("org.slf4j:slf4j-api:2.0.7")
    
    // 编译时依赖（API 可见，传递）
    api("com.google.guava:guava:32.1.1-jre")
    
    // 运行时依赖
    runtimeOnly("org.postgresql:postgresql:42.5.0")
    
    // 编译时依赖（不传递）
    compileOnly("javax.servlet:servlet-api:2.5")
    
    // 测试编译时依赖
    testImplementation("junit:junit:4.13.2")
    
    // 测试运行时依赖
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.9.2")
    
    // 注解处理器
    annotationProcessor("org.projectlombok:lombok:1.18.28")
}
```

### 依赖配置说明

| 配置 | 说明 | 传递性 | 使用场景 |
|------|------|--------|----------|
| `implementation` | 编译时依赖 | 是 | 大多数依赖 |
| `api` | 编译时依赖，API 可见 | 是 | 库项目公开 API |
| `compileOnly` | 编译时依赖 | 否 | 仅编译需要 |
| `runtimeOnly` | 运行时依赖 | 是 | 运行时库 |
| `testImplementation` | 测试编译时依赖 | 是 | 测试框架 |
| `testRuntimeOnly` | 测试运行时依赖 | 是 | 测试运行时库 |

**实际应用场景**：

```kotlin
// Java 应用
dependencies {
    // 核心依赖
    implementation("org.slf4j:slf4j-api:2.0.7")
    implementation("ch.qos.logback:logback-classic:1.4.5")
    
    // 数据库（运行时需要）
    runtimeOnly("com.h2database:h2:2.2.220")
    
    // 测试
    testImplementation("org.junit.jupiter:junit-jupiter:5.9.2")
}

// 库项目（需要公开 API）
dependencies {
    // 公开的 API 依赖
    api("com.google.guava:guava:32.1.1-jre")
    
    // 内部实现依赖
    implementation("org.apache.commons:commons-lang3:3.12.0")
}

// Servlet 应用
dependencies {
    // 编译时需要，运行时由容器提供
    compileOnly("javax.servlet:servlet-api:2.5")
    
    // 运行时依赖
    implementation("org.springframework:spring-web:6.0.9")
}
```

## 依赖声明格式

### Maven 坐标

```kotlin
dependencies {
    // 格式：group:artifact:version
    implementation("org.slf4j:slf4j-api:2.0.7")
    
    // 带分类器
    implementation("com.example:my-lib:1.0.0:jdk8")
    
    // 带扩展名
    implementation("com.example:my-lib:1.0.0@zip")
}
```

### 项目依赖

```kotlin
dependencies {
    // 依赖同一构建中的其他项目
    implementation(project(":lib"))
    
    // 依赖特定配置
    implementation(project(":lib", "default"))
    
    // 依赖特定路径的项目
    implementation(project(":shared:common"))
}
```

**实际应用场景**：

```kotlin
// 多模块项目
// app/build.gradle.kts
dependencies {
    // 依赖 lib 模块
    implementation(project(":lib"))
    
    // 依赖 common 模块
    implementation(project(":common"))
}

// lib/build.gradle.kts
dependencies {
    // 依赖 common 模块（API 可见）
    api(project(":common"))
}
```

### 文件依赖

```kotlin
dependencies {
    // 本地 JAR 文件
    implementation(files("libs/custom.jar"))
    
    // 多个文件
    implementation(files("libs/a.jar", "libs/b.jar"))
    
    // 目录中的所有文件
    implementation(fileTree("libs") { include("*.jar") })
}
```

**实际应用场景**：

```kotlin
// 使用本地 JAR 文件
dependencies {
    // 第三方 JAR（不在 Maven 仓库）
    implementation(files("libs/legacy-library.jar"))
    
    // 本地开发的库
    implementation(files("libs/local-sdk.jar"))
}
```

## 仓库配置

### 常用仓库

```kotlin
repositories {
    // Maven Central
    mavenCentral()
    
    // Google Maven 仓库
    google()
    
    // Gradle 插件仓库
    gradlePluginPortal()
    
    // 本地 Maven 仓库
    mavenLocal()
    
    // 自定义 Maven 仓库
    maven {
        url = uri("https://repo.example.com/releases")
    }
    
    // Ivy 仓库
    ivy {
        url = uri("https://repo.example.com/ivy")
    }
}
```

**实际应用场景**：

```kotlin
// 企业项目：使用内部仓库
repositories {
    // 内部仓库优先
    maven {
        url = uri("https://repo.company.com/releases")
        credentials {
            username = project.findProperty("repoUsername") as String?
            password = project.findProperty("repoPassword") as String?
        }
    }
    // 公共仓库作为备用
    mavenCentral()
}

// 开源项目：使用公共仓库
repositories {
    mavenCentral()
    google()
}

// Android 项目
repositories {
    google()
    mavenCentral()
}
```

## 版本管理

### 直接指定版本

```kotlin
dependencies {
    implementation("org.slf4j:slf4j-api:2.0.7")
}
```

### 使用变量

```kotlin
val slf4jVersion = "2.0.7"
val junitVersion = "5.9.2"

dependencies {
    implementation("org.slf4j:slf4j-api:$slf4jVersion")
    testImplementation("org.junit.jupiter:junit-jupiter:$junitVersion")
}
```

### 版本范围

```kotlin
dependencies {
    // 允许 2.0.0 到 2.9.9（不包括 3.0.0）
    implementation("org.slf4j:slf4j-api:2.+")
    
    // 允许 2.0.0 及以上版本
    implementation("org.slf4j:slf4j-api:2.0.0+")
    
    // 允许 2.0.0 到 2.5.0（不包括 2.5.0）
    implementation("org.slf4j:slf4j-api:[2.0.0,2.5.0)")
}
```

**实际应用场景**：

```kotlin
// 使用版本变量（推荐）
val springBootVersion = "3.1.0"
val kotlinVersion = "1.9.0"

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web:$springBootVersion")
    implementation("org.jetbrains.kotlin:kotlin-stdlib:$kotlinVersion")
}

// 使用版本目录（更推荐，后续章节介绍）
```

## 依赖排除

### 排除传递依赖

```kotlin
dependencies {
    implementation("com.example:my-lib:1.0.0") {
        // 排除特定依赖
        exclude(group = "org.slf4j", module = "slf4j-api")
        
        // 排除整个组
        exclude(group = "com.google.guava")
    }
}
```

**实际应用场景**：

```kotlin
// 解决版本冲突
dependencies {
    // 使用新版本
    implementation("org.slf4j:slf4j-api:2.0.7")
    
    // 排除旧版本的传递依赖
    implementation("com.example:legacy-lib:1.0.0") {
        exclude(group = "org.slf4j", module = "slf4j-api")
    }
}
```

## 实际项目示例

### 示例 1：Spring Boot Web 应用

```kotlin
// build.gradle.kts
plugins {
    id("java")
    id("org.springframework.boot") version "3.1.0"
    id("io.spring.dependency-management") version "1.1.0"
}

dependencies {
    // Web 支持
    implementation("org.springframework.boot:spring-boot-starter-web")
    
    // 数据访问
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    runtimeOnly("com.h2database:h2")
    runtimeOnly("org.postgresql:postgresql")
    
    // 安全
    implementation("org.springframework.boot:spring-boot-starter-security")
    
    // 验证
    implementation("org.springframework.boot:spring-boot-starter-validation")
    
    // 测试
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
}
```

### 示例 2：Kotlin 多平台项目

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "1.9.0"
}

kotlin {
    jvm()
    js(IR) {
        browser()
    }
    ios()
    
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
            }
        }
        
        val jvmMain by getting {
            dependencies {
                implementation("com.squareup.okhttp3:okhttp:4.11.0")
            }
        }
    }
}
```

### 示例 3：Android 应用

```kotlin
// build.gradle.kts
plugins {
    id("com.android.application") version "8.1.0"
    id("org.jetbrains.kotlin.android") version "1.9.0"
}

dependencies {
    // Android 核心库
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    
    // UI
    implementation("com.google.android.material:material:1.10.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    
    // 网络
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    
    // 测试
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
}
```

## 查看依赖

### 命令行查看

```bash
# 查看所有依赖
./gradlew dependencies

# 查看特定配置的依赖
./gradlew dependencies --configuration runtimeClasspath

# 查看依赖树
./gradlew dependencies --configuration compileClasspath

# 查找特定依赖
./gradlew dependencies | grep slf4j
```

### 依赖报告

```bash
# 生成依赖报告
./gradlew dependencies > dependencies.txt

# 生成 HTML 报告（需要插件）
./gradlew dependencyReport
```

## 最佳实践

### 1. 使用明确的版本

```kotlin
// ✅ 推荐：明确指定版本
implementation("org.slf4j:slf4j-api:2.0.7")

// ❌ 不推荐：使用版本范围（可能导致构建不稳定）
implementation("org.slf4j:slf4j-api:2.+")
```

### 2. 使用版本变量

```kotlin
// ✅ 推荐：使用变量管理版本
val slf4jVersion = "2.0.7"
dependencies {
    implementation("org.slf4j:slf4j-api:$slf4jVersion")
}
```

### 3. 正确使用依赖配置

```kotlin
// ✅ 推荐：根据用途选择配置
dependencies {
    implementation("org.slf4j:slf4j-api:2.0.7")  // 实现依赖
    api("com.google.guava:guava:32.1.1-jre")     // API 依赖
    compileOnly("javax.servlet:servlet-api:2.5") // 仅编译
}
```

### 4. 避免依赖冲突

```kotlin
// ✅ 推荐：统一版本管理
dependencies {
    implementation("org.slf4j:slf4j-api:2.0.7")
    // 排除传递依赖中的旧版本
    implementation("com.example:lib:1.0.0") {
        exclude(group = "org.slf4j")
    }
}
```

## 常见问题

### Q: implementation 和 api 有什么区别？

A: `implementation` 是内部实现依赖，不会暴露给消费者。`api` 是公开 API 依赖，会暴露给消费者。库项目应使用 `api` 声明公开 API 的依赖。

### Q: 如何处理依赖版本冲突？

A: 使用 `./gradlew dependencies` 查看冲突，然后排除旧版本或统一版本。

### Q: 如何更新依赖？

A: 使用 `./gradlew dependencyUpdates` 查看可用更新，或手动修改版本号。

### Q: compileOnly 和 provided 有什么区别？

A: `compileOnly` 是 Gradle 的配置，`provided` 是 Maven 的 scope。功能类似，但 `compileOnly` 更明确。

## 总结

- **依赖配置**：implementation、api、compileOnly、runtimeOnly 等
- **依赖声明**：Maven 坐标、项目依赖、文件依赖
- **仓库配置**：mavenCentral、google、自定义仓库
- **版本管理**：直接指定、变量、版本范围
- **依赖排除**：解决版本冲突
- **最佳实践**：明确版本、正确配置、避免冲突

掌握依赖管理是使用 Gradle 的基础，它让项目能够轻松使用外部库和模块。

