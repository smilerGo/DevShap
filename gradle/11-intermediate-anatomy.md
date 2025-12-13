# Gradle 构建的解剖

## 构建的组成部分

一个完整的 Gradle 构建由以下部分组成：

1. **Settings 文件**：定义项目结构
2. **构建脚本**：定义构建逻辑
3. **项目**：构建的基本单位
4. **任务**：构建的执行单元

## 项目结构

### 标准项目结构

```
project-root/
├── settings.gradle.kts      # Settings 文件
├── build.gradle.kts         # 根项目构建脚本
├── gradle/
│   └── wrapper/             # Wrapper 文件
├── src/
│   ├── main/                # 主源代码
│   │   ├── java/
│   │   └── resources/
│   └── test/                # 测试源代码
│       ├── java/
│       └── resources/
└── build/                   # 构建输出目录
```

### 多项目结构

```
project-root/
├── settings.gradle.kts      # Settings 文件
├── build.gradle.kts         # 根项目构建脚本
├── app/
│   └── build.gradle.kts     # 子项目构建脚本
├── lib/
│   └── build.gradle.kts     # 子项目构建脚本
└── common/
    └── build.gradle.kts     # 子项目构建脚本
```

## 脚本评估顺序

Gradle 按以下顺序评估脚本：

1. **Settings 文件**：`settings.gradle.kts`
2. **根项目构建脚本**：`build.gradle.kts`
3. **子项目构建脚本**：按 `settings.gradle.kts` 中的顺序

**实际应用场景**：

```kotlin
// 1. settings.gradle.kts（首先评估）
rootProject.name = "my-project"
include("app", "lib")

// 2. 根项目 build.gradle.kts
allprojects {
    group = "com.example"
    version = "1.0.0"
}

// 3. app/build.gradle.kts
dependencies {
    implementation(project(":lib"))
}

// 4. lib/build.gradle.kts
dependencies {
    api("org.slf4j:slf4j-api:2.0.7")
}
```

## 构建生命周期

Gradle 构建分为三个阶段：

### 1. 初始化阶段（Initialization）

- 评估 `settings.gradle.kts`
- 确定哪些项目参与构建
- 为每个项目创建 `Project` 实例

```kotlin
// settings.gradle.kts
rootProject.name = "my-project"
include("app", "lib")

// 在这个阶段，Gradle 会：
// 1. 读取 settings.gradle.kts
// 2. 创建根项目和子项目的 Project 实例
```

### 2. 配置阶段（Configuration）

- 执行所有构建脚本
- 配置项目和任务
- 构建任务依赖图

```kotlin
// build.gradle.kts
// 这个阶段的代码会立即执行

plugins {
    id("java")
}

// 配置阶段执行
println("配置阶段：设置 Java 版本")
java {
    sourceCompatibility = JavaVersion.VERSION_17
}

// 配置阶段执行
tasks.register("myTask") {
    println("配置阶段：注册任务")
    doLast {
        println("执行阶段：执行任务")
    }
}
```

### 3. 执行阶段（Execution）

- 执行请求的任务及其依赖
- 只执行必要的任务（增量构建）

```kotlin
// 执行阶段只执行 doLast 中的代码
tasks.register("myTask") {
    doLast {
        println("执行阶段：执行任务")
    }
}
```

## 配置阶段 vs 执行阶段

### 配置阶段代码

```kotlin
// build.gradle.kts
// 这些代码在配置阶段执行

plugins {
    id("java")
}

// 配置阶段执行
val version = "1.0.0"
group = "com.example"
version = version

// 配置阶段执行
repositories {
    mavenCentral()
}

// 配置阶段执行
dependencies {
    implementation("org.slf4j:slf4j-api:2.0.7")
}

// 配置阶段执行
tasks.register("configured") {
    println("配置阶段：任务已配置")
}
```

### 执行阶段代码

```kotlin
// build.gradle.kts
// 这些代码在执行阶段执行

tasks.register("executed") {
    doLast {
        println("执行阶段：任务正在执行")
    }
}

tasks.register("both") {
    println("配置阶段：任务配置")
    doFirst {
        println("执行阶段：任务开始")
    }
    doLast {
        println("执行阶段：任务完成")
    }
}
```

**实际应用场景**：

```kotlin
// ❌ 错误：在配置阶段执行耗时操作
tasks.register("badTask") {
    // 这会在配置阶段执行，影响构建启动时间
    val result = expensiveOperation()
    doLast {
        println(result)
    }
}

// ✅ 正确：在执行阶段执行耗时操作
tasks.register("goodTask") {
    doLast {
        // 这会在执行阶段执行，只在任务运行时执行
        val result = expensiveOperation()
        println(result)
    }
}
```

## 项目对象

### Project API

每个构建脚本都对应一个 `Project` 实例，可以通过 `project` 变量访问：

```kotlin
// build.gradle.kts
// project 是隐式的，可以省略

// 这些是等价的
project.group = "com.example"
group = "com.example"

project.version = "1.0.0"
version = "1.0.0"

project.repositories {
    mavenCentral()
}
repositories {
    mavenCentral()
}
```

**实际应用场景**：

```kotlin
// 访问项目属性
println("项目名称: ${project.name}")
println("项目版本: ${project.version}")
println("项目组: ${project.group}")

// 访问项目目录
val srcDir = project.file("src/main/java")
val buildDir = project.layout.buildDirectory.get().asFile

// 访问其他项目（多项目构建）
val libProject = project(":lib")
println("Lib 项目版本: ${libProject.version}")
```

## 任务对象

### Task API

任务通过 `tasks` 容器访问：

```kotlin
// 注册任务
tasks.register("myTask") {
    doLast {
        println("执行任务")
    }
}

// 配置任务
tasks.named("myTask") {
    description = "我的任务"
    group = "custom"
}

// 访问任务
val task = tasks.named("myTask").get()
println("任务名称: ${task.name}")
```

**实际应用场景**：

```kotlin
// 配置现有任务
tasks.compileJava {
    options.encoding = "UTF-8"
}

// 创建任务依赖
tasks.register("deploy") {
    dependsOn(tasks.build)
    doLast {
        println("部署应用")
    }
}

// 条件配置任务
if (project.hasProperty("runTests")) {
    tasks.test {
        useJUnitPlatform()
    }
}
```

## 实际项目示例

### 示例 1：理解生命周期

```kotlin
// build.gradle.kts
println("配置阶段：开始配置项目")

plugins {
    id("java")
}

println("配置阶段：插件已应用")

tasks.register("lifecycle") {
    println("配置阶段：任务已注册")
    
    doFirst {
        println("执行阶段：任务开始")
    }
    
    doLast {
        println("执行阶段：任务完成")
    }
}

println("配置阶段：项目配置完成")

// 执行 ./gradlew lifecycle
// 输出：
// 配置阶段：开始配置项目
// 配置阶段：插件已应用
// 配置阶段：任务已注册
// 配置阶段：项目配置完成
// 执行阶段：任务开始
// 执行阶段：任务完成
```

### 示例 2：配置阶段优化

```kotlin
// build.gradle.kts
// ✅ 正确：配置阶段只做配置
tasks.register("processData") {
    // 配置阶段：声明输入输出
    inputs.files("data/input.txt")
    outputs.file("build/output.txt")
    
    // 执行阶段：执行实际处理
    doLast {
        val input = file("data/input.txt").readText()
        val output = processData(input)
        file("build/output.txt").writeText(output)
    }
}

// ❌ 错误：配置阶段执行处理
tasks.register("badProcessData") {
    // 配置阶段执行，影响构建启动时间
    val input = file("data/input.txt").readText()
    val output = processData(input)
    
    doLast {
        file("build/output.txt").writeText(output)
    }
}
```

## 最佳实践

### 1. 避免在配置阶段执行代码

```kotlin
// ✅ 推荐：在执行阶段执行
tasks.register("myTask") {
    doLast {
        // 执行逻辑
    }
}

// ❌ 不推荐：在配置阶段执行
tasks.register("myTask") {
    // 配置阶段执行
    expensiveOperation()
}
```

### 2. 使用延迟配置

```kotlin
// ✅ 推荐：延迟配置
tasks.register("myTask") {
    doLast {
        // 使用延迟配置
        val config = providers.gradleProperty("config").orElse("default")
        println(config.get())
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

### 3. 理解脚本评估顺序

```kotlin
// settings.gradle.kts（首先评估）
rootProject.name = "my-project"

// 根项目 build.gradle.kts（其次评估）
allprojects {
    version = "1.0.0"
}

// 子项目 build.gradle.kts（最后评估）
dependencies {
    implementation("org.slf4j:slf4j-api:2.0.7")
}
```

## 常见问题

### Q: 配置阶段和执行阶段有什么区别？

A: 配置阶段执行所有构建脚本，配置项目和任务。执行阶段只执行请求的任务。

### Q: 如何查看构建生命周期？

A: 使用 `./gradlew build --info` 查看详细的构建信息。

### Q: 为什么构建启动慢？

A: 可能是在配置阶段执行了耗时操作，应该将这些操作移到执行阶段。

## 总结

- **构建组成部分**：Settings 文件、构建脚本、项目、任务
- **脚本评估顺序**：Settings → 根项目 → 子项目
- **构建生命周期**：初始化 → 配置 → 执行
- **配置阶段**：执行构建脚本，配置项目和任务
- **执行阶段**：执行请求的任务
- **最佳实践**：避免在配置阶段执行耗时操作，使用延迟配置

理解 Gradle 构建的解剖是掌握 Gradle 的基础，它帮助你编写高效的构建脚本。





