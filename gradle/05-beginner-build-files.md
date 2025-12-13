# 构建文件基础

## 什么是构建文件？

构建文件（`build.gradle` 或 `build.gradle.kts`）是 Gradle 项目的核心配置文件，用于定义项目的构建逻辑，包括插件、依赖、任务等。每个项目至少有一个构建文件。

## 构建文件的位置

- **根项目**：`build.gradle` 或 `build.gradle.kts`（项目根目录）
- **子项目**：各子项目目录下的 `build.gradle` 或 `build.gradle.kts`

## 基本结构

### 最简单的构建文件

```kotlin
// build.gradle.kts
// 空的构建文件也是有效的
```

### 标准 Java 项目构建文件

```kotlin
// build.gradle.kts
plugins {
    id("java")
}

group = "com.example"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.slf4j:slf4j-api:2.0.7")
    testImplementation("junit:junit:4.13.2")
}
```

## 主要组成部分

### 1. 插件声明

```kotlin
// build.gradle.kts
plugins {
    // 核心插件（无需版本）
    id("java")
    id("application")
    
    // 社区插件（需要版本）
    id("org.springframework.boot") version "3.1.0"
    id("io.spring.dependency-management") version "1.1.0"
}
```

**实际应用场景**：

```kotlin
// Java 应用
plugins {
    id("java")
    id("application")
}

// Spring Boot 应用
plugins {
    id("java")
    id("org.springframework.boot") version "3.1.0"
    id("io.spring.dependency-management") version "1.1.0"
}

// Kotlin 项目
plugins {
    kotlin("jvm") version "1.9.0"
    kotlin("plugin.spring") version "1.9.0"
}

// Android 项目
plugins {
    id("com.android.application") version "8.1.0"
    id("org.jetbrains.kotlin.android") version "1.9.0"
}
```

### 2. 项目属性

```kotlin
// build.gradle.kts
group = "com.example"
version = "1.0.0"
description = "My awesome application"
```

**实际应用场景**：

```kotlin
// 从 gradle.properties 读取版本
val projectVersion: String by project

group = "com.example"
version = projectVersion

// 或使用变量
val appVersion = "1.0.0"
group = "com.example"
version = appVersion
```

### 3. Java 配置

```kotlin
// build.gradle.kts
java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
    
    // 生成源码 JAR
    withSourcesJar()
    
    // 生成 Javadoc JAR
    withJavadocJar()
}
```

**实际应用场景**：

```kotlin
// Java 17 项目
java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

// 多版本支持
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

### 4. 仓库配置

```kotlin
// build.gradle.kts
repositories {
    // Maven Central
    mavenCentral()
    
    // Google Maven 仓库
    google()
    
    // 自定义 Maven 仓库
    maven {
        url = uri("https://repo.example.com/releases")
    }
    
    // 本地 Maven 仓库
    mavenLocal()
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
    gradlePluginPortal()
}
```

### 5. 依赖配置

```kotlin
// build.gradle.kts
dependencies {
    // 编译时依赖
    implementation("org.slf4j:slf4j-api:2.0.7")
    
    // 编译时依赖（API 可见）
    api("com.google.guava:guava:32.1.1-jre")
    
    // 运行时依赖
    runtimeOnly("org.postgresql:postgresql:42.5.0")
    
    // 测试依赖
    testImplementation("junit:junit:4.13.2")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.9.2")
    
    // 编译时依赖（不传递）
    compileOnly("javax.servlet:servlet-api:2.5")
    
    // 注解处理器
    annotationProcessor("org.projectlombok:lombok:1.18.28")
}
```

**实际应用场景**：

```kotlin
// Spring Boot 项目依赖
dependencies {
    // Web 支持
    implementation("org.springframework.boot:spring-boot-starter-web")
    
    // 数据访问
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    runtimeOnly("com.h2database:h2")
    
    // 安全
    implementation("org.springframework.boot:spring-boot-starter-security")
    
    // 测试
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

// Kotlin 项目依赖
dependencies {
    // Kotlin 标准库
    implementation(kotlin("stdlib"))
    
    // 协程
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    
    // 序列化
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")
}
```

### 6. 任务配置

```kotlin
// build.gradle.kts
tasks {
    // 编译任务
    compileJava {
        options.encoding = "UTF-8"
    }
    
    // 测试任务
    test {
        useJUnitPlatform()
        testLogging {
            events("passed", "skipped", "failed")
        }
    }
    
    // JAR 任务
    jar {
        archiveBaseName.set("my-app")
        manifest {
            attributes(
                "Main-Class" to "com.example.Main"
            )
        }
    }
}
```

**实际应用场景**：

```kotlin
// 配置测试
tasks.test {
    useJUnitPlatform()
    testLogging {
        events("passed", "skipped", "failed")
        exceptionFormat = TestExceptionFormat.FULL
        showStandardStreams = true
    }
    minHeapSize = "128m"
    maxHeapSize = "512m"
}

// 配置 JAR
tasks.jar {
    archiveBaseName.set("my-app")
    archiveVersion.set(project.version.toString())
    manifest {
        attributes(
            "Main-Class" to "com.example.Main",
            "Implementation-Version" to project.version
        )
    }
}
```

## 完整示例

### 示例 1：Java 应用

```kotlin
// build.gradle.kts
plugins {
    id("java")
    id("application")
}

group = "com.example"
version = "1.0.0"

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    // 日志
    implementation("org.slf4j:slf4j-api:2.0.7")
    implementation("ch.qos.logback:logback-classic:1.4.5")
    
    // HTTP 客户端
    implementation("com.squareup.okhttp3:okhttp:4.11.0")
    
    // JSON 处理
    implementation("com.google.code.gson:gson:2.10.1")
    
    // 测试
    testImplementation("org.junit.jupiter:junit-jupiter:5.9.2")
}

application {
    mainClass.set("com.example.Main")
}

tasks.test {
    useJUnitPlatform()
}
```

### 示例 2：Spring Boot 应用

```kotlin
// build.gradle.kts
plugins {
    id("java")
    id("org.springframework.boot") version "3.1.0"
    id("io.spring.dependency-management") version "1.1.0"
}

group = "com.example"
version = "1.0.0"

java {
    sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    
    runtimeOnly("com.h2database:h2")
    runtimeOnly("org.postgresql:postgresql")
    
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.test {
    useJUnitPlatform()
}
```

### 示例 3：Kotlin 库

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "1.9.0"
    `maven-publish`
}

group = "com.example"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
    
    testImplementation("org.jetbrains.kotlin:kotlin-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
}

kotlin {
    jvmToolchain(17)
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])
        }
    }
}
```

## 多项目构建文件

### 根项目构建文件

```kotlin
// 根项目 build.gradle.kts
plugins {
    id("java")
}

// 所有子项目共享的配置
allprojects {
    group = "com.example"
    version = "1.0.0"
    
    repositories {
        mavenCentral()
    }
}

// 子项目共享的配置
subprojects {
    apply(plugin = "java")
    
    java {
        sourceCompatibility = JavaVersion.VERSION_17
    }
    
    dependencies {
        testImplementation("junit:junit:4.13.2")
    }
}
```

### 子项目构建文件

```kotlin
// app/build.gradle.kts
plugins {
    id("java")
    id("application")
}

dependencies {
    implementation(project(":lib"))
}

application {
    mainClass.set("com.example.Main")
}

// lib/build.gradle.kts
plugins {
    id("java-library")
}

dependencies {
    api("org.slf4j:slf4j-api:2.0.7")
}
```

## 最佳实践

### 1. 使用 Kotlin DSL

```kotlin
// ✅ 推荐：使用 Kotlin DSL
// build.gradle.kts
plugins {
    id("java")
}

// ❌ 不推荐：使用 Groovy DSL（除非必要）
// build.gradle
plugins {
    id 'java'
}
```

### 2. 组织配置块

```kotlin
// ✅ 推荐：按逻辑分组
plugins { }
java { }
repositories { }
dependencies { }
tasks { }

// ❌ 不推荐：混乱的组织
```

### 3. 使用变量

```kotlin
// ✅ 推荐：使用变量管理版本
val slf4jVersion = "2.0.7"
val junitVersion = "5.9.2"

dependencies {
    implementation("org.slf4j:slf4j-api:$slf4jVersion")
    testImplementation("org.junit.jupiter:junit-jupiter:$junitVersion")
}
```

### 4. 提取公共配置

```kotlin
// ✅ 推荐：在根项目中提取公共配置
allprojects {
    repositories {
        mavenCentral()
    }
}
```

## 常见问题

### Q: build.gradle 和 build.gradle.kts 有什么区别？

A: `build.gradle` 使用 Groovy DSL，`build.gradle.kts` 使用 Kotlin DSL。推荐使用 Kotlin DSL 以获得更好的类型安全和 IDE 支持。

### Q: 可以在构建文件中执行代码吗？

A: 可以，但要注意执行时机。在配置阶段执行的代码会影响构建性能。

### Q: 如何查看构建文件的执行顺序？

A: 使用 `./gradlew build --info` 查看详细的执行信息。

## 总结

- **构建文件**是项目构建逻辑的核心
- **主要组成部分**：插件、属性、Java 配置、仓库、依赖、任务
- **使用 Kotlin DSL**获得更好的开发体验
- **合理组织**配置块提高可读性
- **提取公共配置**减少重复

掌握构建文件的编写是使用 Gradle 的基础，它是定义项目构建逻辑的主要方式。





