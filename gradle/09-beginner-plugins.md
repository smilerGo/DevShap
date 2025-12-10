# 插件基础

## 什么是插件？

插件是 Gradle 扩展功能的主要方式。插件可以添加任务、配置、约定和依赖管理规则，让构建脚本更简洁、更易维护。

## 插件类型

### 核心插件

Gradle 提供的核心插件，无需版本号：

```kotlin
plugins {
    id("java")
    id("application")
    id("maven-publish")
}
```

### 社区插件

来自 Gradle 插件门户的插件，需要指定版本：

```kotlin
plugins {
    id("org.springframework.boot") version "3.1.0"
    id("io.spring.dependency-management") version "1.1.0"
}
```

## 应用插件

### 使用 plugins 块（推荐）

```kotlin
// build.gradle.kts
plugins {
    id("java")
    id("application")
    id("org.springframework.boot") version "3.1.0"
}
```

**实际应用场景**：

```kotlin
// Java 应用
plugins {
    id("java")
    id("application")
}

application {
    mainClass.set("com.example.Main")
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
```

### 使用 apply（传统方式）

```kotlin
// build.gradle.kts
apply(plugin = "java")
apply(plugin = "application")
```

## 常用插件

### Java 插件

```kotlin
plugins {
    id("java")
}

// Java 插件提供的任务
// - compileJava: 编译 Java 代码
// - test: 运行测试
// - jar: 打包 JAR
// - build: 完整构建
```

**实际应用场景**：

```kotlin
plugins {
    id("java")
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

// 配置编译选项
tasks.compileJava {
    options.encoding = "UTF-8"
    options.compilerArgs.add("-parameters")
}
```

### Application 插件

```kotlin
plugins {
    id("application")
}

application {
    mainClass.set("com.example.Main")
}

// 运行应用
// ./gradlew run
```

**实际应用场景**：

```kotlin
plugins {
    id("java")
    id("application")
}

application {
    mainClass.set("com.example.Main")
    applicationDefaultJvmArgs = listOf("-Xmx512m", "-Dfile.encoding=UTF-8")
}

// 传递参数
// ./gradlew run --args="--port 8080"
```

### Maven Publish 插件

```kotlin
plugins {
    id("maven-publish")
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])
        }
    }
    
    repositories {
        maven {
            url = uri("https://repo.example.com/releases")
        }
    }
}
```

**实际应用场景**：

```kotlin
plugins {
    id("java-library")
    id("maven-publish")
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])
            
            pom {
                name.set("My Library")
                description.set("A useful library")
                url.set("https://example.com")
            }
        }
    }
    
    repositories {
        maven {
            name = "internal"
            url = uri("https://repo.company.com/releases")
            credentials {
                username = project.findProperty("repoUsername") as String?
                password = project.findProperty("repoPassword") as String?
            }
        }
    }
}

// 发布到本地
// ./gradlew publishToMavenLocal

// 发布到远程
// ./gradlew publish
```

### Spring Boot 插件

```kotlin
plugins {
    id("java")
    id("org.springframework.boot") version "3.1.0"
    id("io.spring.dependency-management") version "1.1.0"
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
}

// 运行 Spring Boot 应用
// ./gradlew bootRun
```

**实际应用场景**：

```kotlin
plugins {
    id("java")
    id("org.springframework.boot") version "3.1.0"
    id("io.spring.dependency-management") version "1.1.0"
}

springBoot {
    buildInfo {
        properties {
            artifact.set("my-app")
            version.set(project.version.toString())
            group.set(project.group.toString())
        }
    }
}

tasks.bootRun {
    args("--spring.profiles.active=dev")
    environment("SERVER_PORT", "8080")
}
```

### Kotlin 插件

```kotlin
plugins {
    kotlin("jvm") version "1.9.0"
}

kotlin {
    jvmToolchain(17)
}

dependencies {
    implementation(kotlin("stdlib"))
}
```

**实际应用场景**：

```kotlin
plugins {
    kotlin("jvm") version "1.9.0"
    kotlin("plugin.spring") version "1.9.0"
    kotlin("plugin.jpa") version "1.9.0"
}

kotlin {
    jvmToolchain(17)
    
    compilerOptions {
        freeCompilerArgs.add("-Xjsr305=strict")
    }
}
```

## 插件配置

### 配置插件扩展

```kotlin
plugins {
    id("java")
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    withSourcesJar()
    withJavadocJar()
}
```

**实际应用场景**：

```kotlin
// Java 插件配置
java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
    
    // 生成源码 JAR
    withSourcesJar()
    
    // 生成 Javadoc JAR
    withJavadocJar()
}

// Application 插件配置
application {
    mainClass.set("com.example.Main")
    applicationName = "my-app"
    executableDir = "bin"
}
```

### 配置插件任务

```kotlin
plugins {
    id("java")
}

tasks.test {
    useJUnitPlatform()
    testLogging {
        events("passed", "skipped", "failed")
    }
}
```

**实际应用场景**：

```kotlin
// 配置测试任务
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

// 配置 JAR 任务
tasks.jar {
    archiveBaseName.set("my-app")
    manifest {
        attributes(
            "Main-Class" to "com.example.Main",
            "Implementation-Version" to project.version
        )
    }
}
```

## 插件查找顺序

Gradle 按以下顺序查找插件：

1. **核心插件**：Gradle 内置插件
2. **插件门户**：`plugins.gradle.org`
3. **自定义仓库**：在 `settings.gradle.kts` 中配置的仓库

```kotlin
// settings.gradle.kts
pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
        // 自定义仓库
        maven {
            url = uri("https://repo.example.com/plugins")
        }
    }
}
```

## 实际项目示例

### 示例 1：标准 Java 应用

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
}

application {
    mainClass.set("com.example.Main")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.slf4j:slf4j-api:2.0.7")
    testImplementation("junit:junit:4.13.2")
}
```

### 示例 2：Spring Boot Web 应用

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
    runtimeOnly("com.h2database:h2")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}
```

### 示例 3：Kotlin 库项目

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "1.9.0"
    `maven-publish`
}

group = "com.example"
version = "1.0.0"

kotlin {
    jvmToolchain(17)
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
    testImplementation(kotlin("test"))
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])
        }
    }
}
```

## 最佳实践

### 1. 使用 plugins 块

```kotlin
// ✅ 推荐
plugins {
    id("java")
}

// ❌ 不推荐
apply(plugin = "java")
```

### 2. 统一管理插件版本

```kotlin
// settings.gradle.kts
pluginManagement {
    plugins {
        id("org.springframework.boot") version "3.1.0"
        id("io.spring.dependency-management") version "1.1.0"
    }
}

// build.gradle.kts
plugins {
    id("org.springframework.boot")
    id("io.spring.dependency-management")
}
```

### 3. 只应用必要的插件

```kotlin
// ✅ 推荐：只应用需要的插件
plugins {
    id("java")
}

// ❌ 不推荐：应用不必要的插件
plugins {
    id("java")
    id("war")  // 如果不需要 WAR，不要应用
}
```

## 常见问题

### Q: 如何查看可用的插件？

A: 访问 [Gradle 插件门户](https://plugins.gradle.org/) 或使用 `./gradlew tasks --all` 查看插件提供的任务。

### Q: 插件和任务有什么区别？

A: 插件是功能的集合，可以添加多个任务、配置和约定。任务是具体的执行单元。

### Q: 如何应用本地插件？

A: 使用 `buildscript` 块或 `plugins` 块引用本地文件：

```kotlin
plugins {
    id("com.example.custom-plugin") version "1.0.0"
}
```

## 总结

- **插件**扩展 Gradle 功能，添加任务、配置和约定
- **核心插件**无需版本，社区插件需要版本
- **应用插件**：使用 `plugins` 块（推荐）
- **配置插件**：通过扩展和任务配置
- **常用插件**：Java、Application、Maven Publish、Spring Boot 等
- **最佳实践**：使用 plugins 块、统一管理版本、只应用必要插件

掌握插件的使用是高效使用 Gradle 的关键，插件让构建脚本更简洁、更易维护。


