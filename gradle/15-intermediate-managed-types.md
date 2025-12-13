# Gradle 托管类型

## 什么是托管类型？

Gradle 托管类型（Managed Types）是 Gradle 提供的类型安全属性系统，支持延迟配置和类型检查。主要类型包括 `Property<T>`、`ListProperty<T>`、`SetProperty<T>` 等。

## Property<T>

### 基本用法

```kotlin
// 定义 Property
val version: Property<String> = objects.property(String::class.java)

// 设置值
version.set("1.0.0")

// 获取值
println(version.get())

// 提供默认值
val versionWithDefault = version.orElse("1.0.0")
```

**实际应用场景**：

```kotlin
// 自定义扩展
open class MyExtension {
    val version: Property<String> = objects.property(String::class.java)
    val enabled: Property<Boolean> = objects.property(Boolean::class.java)
    
    init {
        version.convention("1.0.0")
        enabled.convention(true)
    }
}

// 使用
extensions.create("myExtension", MyExtension::class.java)

myExtension {
    version.set("2.0.0")
    enabled.set(false)
}
```

## ListProperty<T>

### 基本用法

```kotlin
// 定义 ListProperty
val dependencies: ListProperty<String> = objects.listProperty(String::class.java)

// 设置值
dependencies.set(listOf("dep1", "dep2"))

// 添加值
dependencies.add("dep3")

// 获取值
println(dependencies.get())
```

**实际应用场景**：

```kotlin
// 自定义扩展
open class ConfigExtension {
    val includes: ListProperty<String> = objects.listProperty(String::class.java)
    val excludes: ListProperty<String> = objects.listProperty(String::class.java)
    
    init {
        includes.convention(listOf("**/*.java"))
        excludes.convention(emptyList())
    }
}

extensions.create("config", ConfigExtension::class.java)

config {
    includes.set(listOf("**/*.java", "**/*.kt"))
    excludes.add("**/*Test.java")
}
```

## SetProperty<T>

### 基本用法

```kotlin
// 定义 SetProperty
val tags: SetProperty<String> = objects.setProperty(String::class.java)

// 设置值
tags.set(setOf("tag1", "tag2"))

// 添加值
tags.add("tag3")

// 获取值
println(tags.get())
```

## 实际应用

### 自定义任务

```kotlin
abstract class MyTask : DefaultTask() {
    @get:Input
    abstract val message: Property<String>
    
    @get:Input
    abstract val count: Property<Int>
    
    init {
        message.convention("Hello")
        count.convention(1)
    }
    
    @TaskAction
    fun execute() {
        repeat(count.get()) {
            println(message.get())
        }
    }
}

tasks.register<MyTask>("myTask") {
    message.set("Hello, Gradle!")
    count.set(3)
}
```

## 最佳实践

### 1. 使用托管类型

```kotlin
// ✅ 推荐：使用 Property
abstract class MyTask : DefaultTask() {
    @get:Input
    abstract val version: Property<String>
}

// ❌ 不推荐：使用普通属性
open class MyTask : DefaultTask() {
    var version: String = "1.0.0"
}
```

### 2. 提供默认值

```kotlin
abstract class MyTask : DefaultTask() {
    @get:Input
    abstract val version: Property<String>
    
    init {
        version.convention("1.0.0")
    }
}
```

## 总结

- **托管类型**：Property、ListProperty、SetProperty 等
- **类型安全**：编译时类型检查
- **延迟配置**：支持延迟计算
- **最佳实践**：使用托管类型，提供默认值

掌握托管类型是编写高级 Gradle 插件和任务的基础。





