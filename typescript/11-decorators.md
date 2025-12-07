# TypeScript 装饰器

装饰器（Decorators）是一种特殊类型的声明，可以附加到类、方法、属性或参数上，用于修改或扩展它们的行为。

## 1. 装饰器基础

### 启用装饰器

在 `tsconfig.json` 中启用装饰器支持：

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 装饰器语法

装饰器使用 `@` 符号，可以是一个函数或表达式。

```typescript
// 类装饰器
@classDecorator
class MyClass {
  // ...
}

// 方法装饰器
class MyClass {
  @methodDecorator
  myMethod() {
    // ...
  }
}

// 属性装饰器
class MyClass {
  @propertyDecorator
  myProperty: string;
}

// 参数装饰器
class MyClass {
  myMethod(@parameterDecorator param: string) {
    // ...
  }
}
```

## 2. 类装饰器

类装饰器应用于类构造函数，用于观察、修改或替换类定义。

### 基本用法

```typescript
// 类装饰器函数
function classDecorator(constructor: Function) {
  console.log("类装饰器被调用");
  console.log("构造函数:", constructor);
}

@classDecorator
class MyClass {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

// 输出：
// 类装饰器被调用
// 构造函数: [Function: MyClass]
```

### 修改类定义

```typescript
// 添加静态属性
function addStaticProperty(constructor: Function) {
  (constructor as any).version = "1.0.0";
}

@addStaticProperty
class MyClass {
  // ...
}

console.log((MyClass as any).version); // "1.0.0"

// 添加实例方法
function addMethod(constructor: Function) {
  constructor.prototype.greet = function() {
    console.log(`Hello, I'm ${this.name}`);
  };
}

@addMethod
class Person {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const person = new Person("张三");
(person as any).greet(); // "Hello, I'm 张三"
```

### 返回新构造函数

```typescript
// 类装饰器可以返回新的构造函数
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
  return constructor;
}

@sealed
class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet() {
    return "Hello, " + this.greeting;
  }
}

// 装饰器工厂（带参数）
function classDecoratorFactory(prefix: string) {
  return function(constructor: Function) {
    const original = constructor;

    function newConstructor(...args: any[]) {
      console.log(`${prefix}: 创建实例`);
      return new (original as any)(...args);
    }

    newConstructor.prototype = original.prototype;
    return newConstructor as any;
  };
}

@classDecoratorFactory("日志")
class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const user = new User("张三");
// 输出：日志: 创建实例
```

### 实际应用场景

```typescript
// 单例模式装饰器
function singleton<T extends { new (...args: any[]): {} }>(constructor: T) {
  let instance: any;

  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) {
        return instance;
      }
      super(...args);
      instance = this;
    }
  };
}

@singleton
class Database {
  constructor() {
    console.log("数据库连接已创建");
  }
}

const db1 = new Database();
const db2 = new Database();
console.log(db1 === db2); // true

// 日志装饰器
function logClass(target: Function) {
  const original = target;

  function construct(constructor: Function, args: any[]) {
    console.log(`创建 ${constructor.name} 实例`);
    return new (constructor as any)(...args);
  }

  const f: any = function(...args: any[]) {
    return construct(original, args);
  };

  f.prototype = original.prototype;
  return f;
}

@logClass
class ApiClient {
  constructor(private baseUrl: string) {}
}

const client = new ApiClient("https://api.example.com");
// 输出：创建 ApiClient 实例
```

## 3. 方法装饰器

方法装饰器应用于方法的属性描述符，用于观察、修改或替换方法定义。

### 基本用法

```typescript
// 方法装饰器
function methodDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log("目标:", target);
  console.log("属性名:", propertyKey);
  console.log("描述符:", descriptor);
}

class MyClass {
  @methodDecorator
  myMethod() {
    console.log("方法被调用");
  }
}

// 输出：
// 目标: MyClass {}
// 属性名: myMethod
// 描述符: { value: [Function: myMethod], writable: true, enumerable: false, configurable: true }
```

### 修改方法行为

```typescript
// 日志装饰器
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    console.log(`调用方法: ${propertyKey}`);
    console.log("参数:", args);
    const result = originalMethod.apply(this, args);
    console.log("返回值:", result);
    return result;
  };

  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(2, 3);
// 输出：
// 调用方法: add
// 参数: [2, 3]
// 返回值: 5

// 性能测量装饰器
function measureTime(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`${propertyKey} 执行时间: ${end - start} 毫秒`);
    return result;
  };

  return descriptor;
}

class DataProcessor {
  @measureTime
  processData(data: any[]): any[] {
    // 处理数据
    return data.map(item => ({ ...item, processed: true }));
  }
}
```

### 装饰器工厂

```typescript
// 带参数的方法装饰器
function logWithLevel(level: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
      console.log(`[${level}] 调用方法: ${propertyKey}`);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

class Logger {
  @logWithLevel("INFO")
  info(message: string): void {
    console.log(message);
  }

  @logWithLevel("ERROR")
  error(message: string): void {
    console.error(message);
  }
}

// 重试装饰器
function retry(times: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      let lastError: Error;

      for (let i = 0; i < times; i++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error as Error;
          console.log(`尝试 ${i + 1}/${times} 失败，重试中...`);
        }
      }

      throw lastError!;
    };

    return descriptor;
  };
}

class ApiService {
  @retry(3)
  async fetchData(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("请求失败");
    }
    return response.json();
  }
}
```

## 4. 属性装饰器

属性装饰器应用于类的属性，用于观察、修改或替换属性定义。

### 基本用法

```typescript
// 属性装饰器
function propertyDecorator(target: any, propertyKey: string) {
  console.log("目标:", target);
  console.log("属性名:", propertyKey);
}

class MyClass {
  @propertyDecorator
  myProperty: string = "默认值";
}

// 输出：
// 目标: MyClass {}
// 属性名: myProperty
```

### 实际应用场景

```typescript
// 只读属性装饰器
function readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
    configurable: false
  });
}

class User {
  @readonly
  id: number;

  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

const user = new User(1, "张三");
// user.id = 2; // ❌ 错误：只读属性

// 验证装饰器
function validateEmail(target: any, propertyKey: string) {
  let value: string;

  Object.defineProperty(target, propertyKey, {
    get: () => value,
    set: (newValue: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newValue)) {
        throw new Error(`无效的邮箱地址: ${newValue}`);
      }
      value = newValue;
    },
    enumerable: true,
    configurable: true
  });
}

class Contact {
  @validateEmail
  email: string = "";

  constructor(email: string) {
    this.email = email;
  }
}

const contact = new Contact("zhangsan@example.com"); // ✅
// const invalid = new Contact("invalid-email"); // ❌ 错误
```

## 5. 参数装饰器

参数装饰器应用于函数参数，用于观察参数的使用。

### 基本用法

```typescript
// 参数装饰器
function parameterDecorator(target: any, propertyKey: string, parameterIndex: number) {
  console.log("目标:", target);
  console.log("方法名:", propertyKey);
  console.log("参数索引:", parameterIndex);
}

class MyClass {
  myMethod(
    @parameterDecorator param1: string,
    @parameterDecorator param2: number
  ): void {
    // ...
  }
}

// 输出：
// 目标: MyClass {}
// 方法名: myMethod
// 参数索引: 1
// 目标: MyClass {}
// 方法名: myMethod
// 参数索引: 0
```

### 实际应用场景

```typescript
// 依赖注入装饰器（简化版）
const dependencies = new Map<string, any>();

function inject(token: string) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const existingDependencies = Reflect.getMetadata("design:paramtypes", target) || [];
    existingDependencies[parameterIndex] = token;
    Reflect.defineMetadata("design:paramtypes", existingDependencies, target);
  };
}

// 注册依赖
dependencies.set("UserService", {
  getUser: (id: number) => ({ id, name: "张三" })
});

class UserController {
  constructor(
    @inject("UserService") private userService: any
  ) {}

  getUser(id: number) {
    return this.userService.getUser(id);
  }
}

// 验证参数装饰器
function required(target: any, propertyKey: string, parameterIndex: number) {
  const existingRequiredParams: number[] = Reflect.getOwnMetadata("required", target, propertyKey) || [];
  existingRequiredParams.push(parameterIndex);
  Reflect.defineMetadata("required", existingRequiredParams, target, propertyKey);
}

function validate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const requiredParams: number[] = Reflect.getOwnMetadata("required", target, propertyKey) || [];

  descriptor.value = function(...args: any[]) {
    for (const index of requiredParams) {
      if (args[index] === undefined || args[index] === null) {
        throw new Error(`参数 ${index} 是必需的`);
      }
    }
    return originalMethod.apply(this, args);
  };

  return descriptor;
}

class Validator {
  @validate
  process(
    @required name: string,
    @required age: number,
    email?: string
  ): void {
    console.log(`处理: ${name}, ${age}, ${email || "无邮箱"}`);
  }
}

const validator = new Validator();
validator.process("张三", 25); // ✅
// validator.process("张三"); // ❌ 错误：参数 1 是必需的
```

## 6. 装饰器组合

多个装饰器可以应用到同一个声明上。

```typescript
// 装饰器执行顺序：从下到上
function first() {
  console.log("first(): 工厂函数被调用");
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): 装饰器被调用");
  };
}

function second() {
  console.log("second(): 工厂函数被调用");
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): 装饰器被调用");
  };
}

class Example {
  @first()
  @second()
  method(): void {
    // ...
  }
}

// 输出：
// second(): 工厂函数被调用
// first(): 工厂函数被调用
// first(): 装饰器被调用
// second(): 装饰器被调用
```

## 7. 实际应用：依赖注入框架

```typescript
// 简化的依赖注入实现
class Container {
  private services = new Map<string, any>();

  register<T>(token: string, factory: () => T): void {
    this.services.set(token, factory);
  }

  resolve<T>(token: string): T {
    const factory = this.services.get(token);
    if (!factory) {
      throw new Error(`服务 ${token} 未注册`);
    }
    return factory();
  }
}

const container = new Container();

// 注册服务
container.register("UserService", () => ({
  getUser: (id: number) => ({ id, name: "张三", email: "zhangsan@example.com" })
}));

// 使用装饰器注入
function inject(token: string) {
  return function(target: any, propertyKey: string | undefined, parameterIndex: number) {
    const paramTypes = Reflect.getMetadata("design:paramtypes", target) || [];
    paramTypes[parameterIndex] = token;
    Reflect.defineMetadata("design:paramtypes", paramTypes, target);
  };
}

class UserController {
  constructor(
    @inject("UserService") private userService: any
  ) {}

  getUser(id: number) {
    return this.userService.getUser(id);
  }
}
```

## 总结

- **类装饰器**：应用于类构造函数，可以观察、修改或替换类定义
- **方法装饰器**：应用于方法，可以修改方法行为，如添加日志、性能测量等
- **属性装饰器**：应用于属性，可以添加验证、只读等特性
- **参数装饰器**：应用于参数，常用于依赖注入和参数验证
- **装饰器工厂**：返回装饰器函数的函数，允许传递参数
- **装饰器组合**：多个装饰器可以组合使用，执行顺序从下到上
- **实际应用**：
  - 日志记录
  - 性能测量
  - 参数验证
  - 依赖注入
  - 单例模式
- **注意事项**：
  - 需要启用 `experimentalDecorators` 选项
  - 装饰器是实验性特性，未来可能会变化
  - 合理使用装饰器，避免过度使用


