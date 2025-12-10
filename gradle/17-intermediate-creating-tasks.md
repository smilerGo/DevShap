# 创建与注册任务

## 任务注册

### 使用 register（推荐）

```kotlin
// ✅ 推荐：使用 register
tasks.register("myTask") {
    doLast {
        println("执行任务")
    }
}
```

### 使用 create（不推荐）

```kotlin
// ❌ 不推荐：使用 create
tasks.create("myTask") {
    doLast {
        println("执行任务")
    }
}
```

## 任务类型

### 自定义任务类型

```kotlin
abstract class MyTask : DefaultTask() {
    @get:Input
    abstract val message: Property<String>
    
    init {
        message.convention("Hello")
    }
    
    @TaskAction
    fun execute() {
        println(message.get())
    }
}

tasks.register<MyTask>("myTask") {
    message.set("Hello, Gradle!")
}
```

### 使用内置任务类型

```kotlin
// Copy 任务
tasks.register<Copy>("copyFiles") {
    from("src")
    into("build")
}

// Delete 任务
tasks.register<Delete>("cleanBuild") {
    delete("build")
}

// Exec 任务
tasks.register<Exec>("runScript") {
    commandLine("python", "script.py")
}
```

## 输入/输出声明

### 声明输入和输出

```kotlin
tasks.register("processFiles") {
    // 输入
    inputs.files("src/main/data")
    inputs.property("version", project.version)
    
    // 输出
    outputs.dir("build/processed")
    
    doLast {
        // 处理文件
    }
}
```

**实际应用场景**：

```kotlin
tasks.register("generateCode") {
    inputs.files(fileTree("src/main/templates"))
    inputs.property("version", project.version)
    outputs.dir("build/generated")
    
    doLast {
        // 生成代码
    }
}
```

## 任务依赖

### 声明依赖

```kotlin
tasks.register("taskA") { }

tasks.register("taskB") {
    dependsOn("taskA")
}

tasks.register("taskC") {
    mustRunAfter("taskB")
}
```

## 最佳实践

### 1. 使用 register

```kotlin
// ✅ 推荐
tasks.register("myTask") { }

// ❌ 不推荐
tasks.create("myTask") { }
```

### 2. 声明输入/输出

```kotlin
// ✅ 推荐：支持增量构建
tasks.register("process") {
    inputs.files("src")
    outputs.dir("build")
}

// ❌ 不推荐：无法增量构建
tasks.register("process") {
    doLast {
        // 处理
    }
}
```

## 总结

- **任务注册**：使用 register 方法
- **任务类型**：自定义或使用内置类型
- **输入/输出**：声明以支持增量构建
- **任务依赖**：使用 dependsOn、mustRunAfter 等
- **最佳实践**：使用 register、声明输入/输出

掌握任务创建是编写 Gradle 构建脚本的核心技能。


