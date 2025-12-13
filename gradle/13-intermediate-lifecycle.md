# Gradle 构建生命周期

## 构建生命周期概述

Gradle 构建生命周期分为三个阶段：初始化（Initialization）、配置（Configuration）和执行（Execution）。理解生命周期对于编写高效的构建脚本至关重要。

## 三个阶段

### 1. 初始化阶段

**作用**：
- 评估 `settings.gradle.kts` 文件
- 确定哪些项目参与构建
- 为每个项目创建 `Project` 实例

**执行内容**：

```kotlin
// settings.gradle.kts
rootProject.name = "my-project"
include("app", "lib")

// 在这个阶段：
// 1. Gradle 读取 settings.gradle.kts
// 2. 创建根项目和子项目的 Project 实例
// 3. 确定项目层次结构
```

**实际应用场景**：

```kotlin
// settings.gradle.kts
rootProject.name = "multi-module-project"

// 条件包含项目
if (project.hasProperty("include.experimental")) {
    include("experimental")
}

// 动态包含项目
file("modules").listFiles()?.forEach { file ->
    if (file.isDirectory) {
        include(":${file.name}")
    }
}
```

### 2. 配置阶段

**作用**：
- 执行所有构建脚本（`build.gradle.kts`）
- 配置项目和任务
- 构建任务依赖图

**执行内容**：

```kotlin
// build.gradle.kts
// 这些代码在配置阶段执行

plugins {
    id("java")
}

// 配置阶段执行
group = "com.example"
version = "1.0.0"

// 配置阶段执行
repositories {
    mavenCentral()
}

// 配置阶段执行
dependencies {
    implementation("org.slf4j:slf4j-api:2.0.7")
}

// 配置阶段执行
tasks.register("myTask") {
    println("配置阶段：任务已注册")
    doLast {
        println("执行阶段：任务执行")
    }
}
```

**实际应用场景**：

```kotlin
// build.gradle.kts
println("配置阶段：开始配置")

plugins {
    id("java")
}

// 配置阶段：设置项目属性
group = "com.example"
version = "1.0.0"

// 配置阶段：配置 Java
java {
    sourceCompatibility = JavaVersion.VERSION_17
}

// 配置阶段：注册任务
tasks.register("configured") {
    description = "配置阶段注册的任务"
    group = "custom"
    println("配置阶段：任务配置完成")
    
    doLast {
        println("执行阶段：任务执行")
    }
}

println("配置阶段：配置完成")
```

### 3. 执行阶段

**作用**：
- 执行请求的任务及其依赖
- 只执行必要的任务（增量构建）
- 按依赖顺序执行任务

**执行内容**：

```kotlin
// build.gradle.kts
tasks.register("taskA") {
    doLast {
        println("执行阶段：Task A")
    }
}

tasks.register("taskB") {
    dependsOn("taskA")
    doLast {
        println("执行阶段：Task B")
    }
}

// 执行 ./gradlew taskB
// 输出：
// 执行阶段：Task A
// 执行阶段：Task B
```

## 生命周期钩子

### 初始化阶段钩子

```kotlin
// settings.gradle.kts
gradle.beforeProject {
    println("初始化阶段：项目 ${it.name} 创建前")
}

gradle.afterProject {
    println("初始化阶段：项目 ${it.name} 创建后")
}
```

### 配置阶段钩子

```kotlin
// build.gradle.kts
// 项目配置前
gradle.beforeProject {
    println("配置阶段：项目 ${it.name} 配置前")
}

// 项目配置后
project.afterEvaluate {
    println("配置阶段：项目 ${it.name} 配置后")
}

// 所有项目配置完成后
gradle.projectsEvaluated {
    println("配置阶段：所有项目配置完成")
}
```

**实际应用场景**：

```kotlin
// build.gradle.kts
// 配置阶段：项目配置后执行
project.afterEvaluate {
    println("项目 ${project.name} 配置完成")
    
    // 可以在这里访问已配置的任务
    tasks.forEach { task ->
        println("任务: ${task.name}")
    }
}

// 配置阶段：所有项目配置完成后执行
gradle.projectsEvaluated {
    println("所有项目配置完成")
    
    // 可以在这里执行跨项目的配置
    allprojects {
        tasks.forEach { task ->
            if (task.group == "build") {
                println("构建任务: ${task.name}")
            }
        }
    }
}
```

### 执行阶段钩子

```kotlin
// build.gradle.kts
// 任务执行前
gradle.taskGraph.beforeTask {
    println("执行阶段：任务 ${this.name} 执行前")
}

// 任务执行后
gradle.taskGraph.afterTask {
    println("执行阶段：任务 ${this.name} 执行后")
}

// 构建完成
gradle.buildFinished {
    println("执行阶段：构建完成")
}
```

**实际应用场景**：

```kotlin
// build.gradle.kts
// 任务执行前：记录开始时间
gradle.taskGraph.beforeTask { task ->
    task.ext["startTime"] = System.currentTimeMillis()
}

// 任务执行后：计算耗时
gradle.taskGraph.afterTask { task ->
    val startTime = task.ext["startTime"] as Long
    val duration = System.currentTimeMillis() - startTime
    if (duration > 1000) {
        println("任务 ${task.name} 耗时: ${duration}ms")
    }
}

// 构建完成：生成报告
gradle.buildFinished {
    println("构建完成")
    if (it.failure != null) {
        println("构建失败: ${it.failure?.message}")
    } else {
        println("构建成功")
    }
}
```

## 实际项目示例

### 示例 1：完整的生命周期跟踪

```kotlin
// settings.gradle.kts
println("初始化阶段：开始")

rootProject.name = "lifecycle-demo"
include("app")

gradle.beforeProject {
    println("初始化阶段：项目 ${it.name} 创建前")
}

gradle.afterProject {
    println("初始化阶段：项目 ${it.name} 创建后")
}

println("初始化阶段：完成")

// 根项目 build.gradle.kts
println("配置阶段：根项目开始配置")

allprojects {
    println("配置阶段：项目 ${name} 配置中")
    
    afterEvaluate {
        println("配置阶段：项目 ${name} 配置完成")
    }
}

gradle.projectsEvaluated {
    println("配置阶段：所有项目配置完成")
}

gradle.taskGraph.whenReady {
    println("执行阶段：任务图准备完成")
    println("要执行的任务: ${allTasks.map { it.name }}")
}

gradle.taskGraph.beforeTask {
    println("执行阶段：任务 ${name} 开始执行")
}

gradle.taskGraph.afterTask {
    println("执行阶段：任务 ${name} 执行完成")
}

gradle.buildFinished {
    println("执行阶段：构建完成")
}

println("配置阶段：根项目配置完成")
```

### 示例 2：性能监控

```kotlin
// build.gradle.kts
val buildStartTime = System.currentTimeMillis()

gradle.taskGraph.whenReady {
    println("任务图准备完成，共 ${allTasks.size} 个任务")
}

gradle.taskGraph.beforeTask { task ->
    task.ext["startTime"] = System.currentTimeMillis()
}

gradle.taskGraph.afterTask { task ->
    val startTime = task.ext["startTime"] as Long
    val duration = System.currentTimeMillis() - startTime
    
    if (duration > 100) {
        println("任务 ${task.name} 耗时: ${duration}ms")
    }
}

gradle.buildFinished {
    val totalTime = System.currentTimeMillis() - buildStartTime
    println("总构建时间: ${totalTime}ms")
    
    if (it.failure != null) {
        println("构建失败")
    } else {
        println("构建成功")
    }
}
```

### 示例 3：条件配置

```kotlin
// build.gradle.kts
// 配置阶段：根据属性配置项目
project.afterEvaluate {
    if (project.hasProperty("production")) {
        println("生产环境配置")
        tasks.named("jar") {
            manifest {
                attributes(
                    "Environment" to "production"
                )
            }
        }
    } else {
        println("开发环境配置")
    }
}
```

## 最佳实践

### 1. 避免在配置阶段执行耗时操作

```kotlin
// ❌ 错误：配置阶段执行耗时操作
tasks.register("badTask") {
    val result = expensiveOperation()  // 配置阶段执行
    doLast {
        println(result)
    }
}

// ✅ 正确：执行阶段执行耗时操作
tasks.register("goodTask") {
    doLast {
        val result = expensiveOperation()  // 执行阶段执行
        println(result)
    }
}
```

### 2. 使用生命周期钩子

```kotlin
// ✅ 推荐：使用钩子执行配置后操作
project.afterEvaluate {
    // 配置完成后执行
    tasks.forEach { task ->
        // 配置任务
    }
}
```

### 3. 理解执行顺序

```kotlin
// 配置阶段：按脚本评估顺序执行
// 1. settings.gradle.kts
// 2. 根项目 build.gradle.kts
// 3. 子项目 build.gradle.kts

// 执行阶段：按任务依赖顺序执行
tasks.register("taskA") { }
tasks.register("taskB") {
    dependsOn("taskA")  // taskB 在 taskA 之后执行
}
```

## 常见问题

### Q: 配置阶段和执行阶段有什么区别？

A: 配置阶段执行所有构建脚本，配置项目和任务。执行阶段只执行请求的任务。

### Q: 如何查看生命周期执行过程？

A: 使用 `./gradlew build --info` 或添加生命周期钩子打印日志。

### Q: 为什么构建启动慢？

A: 可能是在配置阶段执行了耗时操作，应该将这些操作移到执行阶段。

## 总结

- **三个阶段**：初始化 → 配置 → 执行
- **初始化阶段**：评估 Settings 文件，创建项目实例
- **配置阶段**：执行构建脚本，配置项目和任务
- **执行阶段**：执行请求的任务
- **生命周期钩子**：beforeProject、afterEvaluate、beforeTask、afterTask、buildFinished
- **最佳实践**：避免在配置阶段执行耗时操作，使用生命周期钩子

理解 Gradle 构建生命周期是编写高效构建脚本的基础，它帮助你优化构建性能。





