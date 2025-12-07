# 编写构建脚本

## 构建脚本最佳实践

编写高效的构建脚本需要遵循一些最佳实践，包括使用 Kotlin DSL、组织代码结构、优化性能等。

## Kotlin DSL vs Groovy DSL

### Kotlin DSL 优势

```kotlin
// build.gradle.kts (Kotlin DSL)
plugins {
    id("java")
}

dependencies {
    implementation("org.slf4j:slf4j-api:2.0.7")
}

// 优势：
// 1. 类型安全
// 2. IDE 支持（自动补全、重构）
// 3. 更好的错误提示
// 4. 可读性更好
```

### Groovy DSL

```groovy
// build.gradle (Groovy DSL)
plugins {
    id 'java'
}

dependencies {
    implementation 'org.slf4j:slf4j-api:2.0.7'
}

// 特点：
// 1. 更简洁（某些场景）
// 2. 动态类型
// 3. 传统方式
```

**推荐**：优先使用 Kotlin DSL

## 脚本组织

### 1. 按逻辑分组

```kotlin
// build.gradle.kts
// 1. 插件声明
plugins {
    id("java")
    id("application")
}

// 2. 项目属性
group = "com.example"
version = "1.0.0"

// 3. Java 配置
java {
    sourceCompatibility = JavaVersion.VERSION_17
}

// 4. 仓库配置
repositories {
    mavenCentral()
}

// 5. 依赖配置
dependencies {
    implementation("org.slf4j:slf4j-api:2.0.7")
}

// 6. 任务配置
tasks.test {
    useJUnitPlatform()
}
```

### 2. 提取变量

```kotlin
// build.gradle.kts
// 版本变量
val slf4jVersion = "2.0.7"
val junitVersion = "5.9.2"

// Java 版本
val javaVersion = JavaVersion.VERSION_17

plugins {
    id("java")
}

java {
    sourceCompatibility = javaVersion
}

dependencies {
    implementation("org.slf4j:slf4j-api:$slf4jVersion")
    testImplementation("org.junit.jupiter:junit-jupiter:$junitVersion")
}
```

**实际应用场景**：

```kotlin
// build.gradle.kts
// 统一版本管理
object Versions {
    const val slf4j = "2.0.7"
    const val junit = "5.9.2"
    const val springBoot = "3.1.0"
}

plugins {
    id("java")
    id("org.springframework.boot") version Versions.springBoot
}

dependencies {
    implementation("org.slf4j:slf4j-api:${Versions.slf4j}")
    testImplementation("org.junit.jupiter:junit-jupiter:${Versions.junit}")
}
```

### 3. 使用扩展函数

```kotlin
// build.gradle.kts
// 自定义扩展函数
fun Project.hello() {
    println("Hello from ${this.name}")
}

// 使用
hello()
```

## 性能优化

### 1. 避免配置阶段执行代码

```kotlin
// ❌ 错误：配置阶段执行
tasks.register("badTask") {
    val result = expensiveOperation()
    doLast {
        println(result)
    }
}

// ✅ 正确：执行阶段执行
tasks.register("goodTask") {
    doLast {
        val result = expensiveOperation()
        println(result)
    }
}
```

### 2. 使用延迟配置

```kotlin
// ✅ 推荐：延迟配置
tasks.register("myTask") {
    doLast {
        val config = providers.gradleProperty("config")
            .orElse("default")
            .get()
        println(config)
    }
}

// ❌ 不推荐：立即读取
tasks.register("myTask") {
    val config = project.findProperty("config") ?: "default"
    doLast {
        println(config)
    }
}
```

### 3. 使用 Provider API

```kotlin
// ✅ 推荐：使用 Provider
val versionProvider = providers.gradleProperty("version")
    .orElse("1.0.0")

tasks.register("printVersion") {
    doLast {
        println(versionProvider.get())
    }
}
```

## 实际项目示例

### 示例 1：标准 Java 项目

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
    implementation("org.slf4j:slf4j-api:2.0.7")
    testImplementation("junit:junit:4.13.2")
}

application {
    mainClass.set("com.example.Main")
}

tasks.test {
    useJUnitPlatform()
}
```

### 示例 2：Spring Boot 项目

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
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.test {
    useJUnitPlatform()
}
```

## 常见问题

### Q: 如何组织大型构建脚本？

A: 使用 `apply from` 或预编译脚本插件将脚本拆分为多个文件。

### Q: 如何提高构建脚本性能？

A: 避免在配置阶段执行代码，使用延迟配置和 Provider API。

## 总结

- **使用 Kotlin DSL**：获得更好的类型安全和 IDE 支持
- **组织脚本**：按逻辑分组，提取变量
- **性能优化**：避免配置阶段执行代码，使用延迟配置
- **最佳实践**：遵循 Gradle 推荐的做法

编写高效的构建脚本是使用 Gradle 的关键技能。

