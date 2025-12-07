# TypeScript 基础部分

## 1. 类型系统基础

### 基本类型

TypeScript 提供了多种基本类型，用于定义变量的数据类型。

#### 基本类型列表

```typescript
// 字符串类型
let name: string = "张三";
let message: string = `你好，${name}`;

// 数字类型（包括整数和浮点数）
let age: number = 25;
let price: number = 99.99;
let count: number = 0;

// 布尔类型
let isActive: boolean = true;
let isCompleted: boolean = false;

// 空值类型
let nullValue: null = null;
let undefinedValue: undefined = undefined;

// void 类型（通常用于函数返回值）
function logMessage(): void {
  console.log("这条消息没有返回值");
}

// any 类型（不推荐使用，会失去类型检查）
let anything: any = "可以是任何类型";
anything = 42;
anything = true;

// unknown 类型（更安全的 any）
let userInput: unknown = "用户输入";
// unknown 类型需要类型检查后才能使用
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase());
}
```

### 类型注解

类型注解是显式地为变量、函数参数和返回值指定类型。

```typescript
// 变量类型注解
let username: string = "admin";
let userId: number = 1001;

// 函数参数和返回值类型注解
function greet(name: string): string {
  return `你好，${name}`;
}

// 对象类型注解
let user: { name: string; age: number } = {
  name: "李四",
  age: 30
};

// 数组类型注解
let numbers: number[] = [1, 2, 3, 4, 5];
let names: Array<string> = ["张三", "李四", "王五"];
```

**使用场景**：
- API 响应数据定义
- 函数参数和返回值约束
- 对象结构定义
- 数组元素类型约束

### 类型推断

TypeScript 编译器可以自动推断变量的类型，无需显式注解。

```typescript
// TypeScript 自动推断为 string 类型
let message = "Hello World";

// TypeScript 自动推断为 number 类型
let count = 10;

// TypeScript 自动推断为 boolean 类型
let isReady = true;

// TypeScript 自动推断为 number[] 类型
let scores = [85, 90, 78, 92];

// 函数返回类型推断
function add(a: number, b: number) {
  return a + b; // 返回类型自动推断为 number
}

// 对象类型推断
const user = {
  name: "张三",
  age: 25
}; // 类型推断为 { name: string; age: number }
```

**最佳实践**：
- 让 TypeScript 自动推断类型，只在必要时添加类型注解
- 函数参数通常需要类型注解
- 复杂对象建议使用接口或类型别名

## 2. 变量声明

### let、const、var 的区别

#### let 声明

```typescript
// let 声明的变量可以重新赋值
let counter = 0;
counter = 1; // ✅ 允许

// let 具有块级作用域
if (true) {
  let blockScoped = "块级作用域";
  console.log(blockScoped); // ✅ 可以访问
}
// console.log(blockScoped); // ❌ 错误：无法访问

// let 不会变量提升
// console.log(hoisted); // ❌ 错误：在声明前无法使用
let hoisted = "声明后可用";
```

#### const 声明

```typescript
// const 声明的变量不能重新赋值
const PI = 3.14159;
// PI = 3.14; // ❌ 错误：无法重新赋值

// const 对象可以修改属性
const user = {
  name: "张三",
  age: 25
};
user.age = 26; // ✅ 允许修改属性
// user = {}; // ❌ 错误：无法重新赋值整个对象

// const 数组可以修改元素
const numbers = [1, 2, 3];
numbers.push(4); // ✅ 允许
numbers[0] = 10; // ✅ 允许
// numbers = []; // ❌ 错误：无法重新赋值整个数组
```

#### var 声明（不推荐）

```typescript
// var 具有函数作用域，没有块级作用域
function example() {
  if (true) {
    var functionScoped = "函数作用域";
  }
  console.log(functionScoped); // ✅ 可以访问（不推荐）
}

// var 会变量提升
console.log(hoisted); // undefined（不会报错，但不推荐）
var hoisted = "已提升";
```

**使用场景对比**：

```typescript
// ✅ 推荐：使用 const 作为默认选择
const API_URL = "https://api.example.com";
const config = { timeout: 5000 };

// ✅ 推荐：需要重新赋值时使用 let
let currentUser = null;
let retryCount = 0;

// ❌ 不推荐：避免使用 var
// var oldStyle = "不要使用";
```

## 3. 函数

### 函数类型

```typescript
// 函数声明
function multiply(a: number, b: number): number {
  return a * b;
}

// 函数表达式
const divide = function(a: number, b: number): number {
  return a / b;
};

// 箭头函数
const subtract = (a: number, b: number): number => {
  return a - b;
};

// 箭头函数简写（单表达式）
const add = (a: number, b: number): number => a + b;

// 函数类型注解
let calculate: (x: number, y: number) => number;
calculate = multiply; // ✅ 类型匹配
// calculate = "string"; // ❌ 错误：类型不匹配
```

### 可选参数

```typescript
// 使用 ? 标记可选参数
function greet(name: string, title?: string): string {
  if (title) {
    return `你好，${title} ${name}`;
  }
  return `你好，${name}`;
}

greet("张三"); // ✅ "你好，张三"
greet("李四", "先生"); // ✅ "你好，先生 李四"

// 可选参数必须在必需参数之后
function createUser(name: string, age?: number, email?: string) {
  // ...
}
```

**实际应用场景**：

```typescript
// API 请求函数
function fetchUser(id: number, includeProfile?: boolean) {
  const url = includeProfile 
    ? `/api/users/${id}?include=profile`
    : `/api/users/${id}`;
  // 发送请求...
}

// 配置对象函数
function createLogger(level: string, format?: string) {
  // format 是可选的日志格式
}
```

### 默认参数

```typescript
// 使用 = 提供默认值
function createGreeting(name: string, greeting: string = "你好"): string {
  return `${greeting}，${name}`;
}

createGreeting("张三"); // "你好，张三"
createGreeting("李四", "欢迎"); // "欢迎，李四"

// 默认参数可以是表达式
function getTimestamp(date: Date = new Date()): number {
  return date.getTime();
}

// 默认参数可以使用前面的参数
function createURL(path: string, base: string = "https://api.example.com"): string {
  return `${base}${path}`;
}
```

**实际应用场景**：

```typescript
// 分页查询
function getUsers(page: number = 1, pageSize: number = 10) {
  return fetch(`/api/users?page=${page}&size=${pageSize}`);
}

// 日志函数
function log(message: string, level: string = "info") {
  console.log(`[${level.toUpperCase()}] ${message}`);
}
```

### 剩余参数

```typescript
// 使用 ... 收集剩余参数
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

sum(1, 2, 3); // 6
sum(1, 2, 3, 4, 5); // 15

// 剩余参数必须放在最后
function introduce(name: string, ...hobbies: string[]): string {
  const hobbyList = hobbies.length > 0 
    ? `，爱好：${hobbies.join("、")}`
    : "";
  return `我是${name}${hobbyList}`;
}

introduce("张三", "阅读", "编程", "旅行");
```

**实际应用场景**：

```typescript
// 事件监听器
function addEventListeners(
  element: HTMLElement,
  ...events: string[]
): void {
  events.forEach(event => {
    element.addEventListener(event, () => {
      console.log(`事件 ${event} 被触发`);
    });
  });
}

// 工具函数
function formatDate(format: string, ...values: (string | number)[]): string {
  // 格式化日期逻辑...
  return "";
}
```

### 函数重载

函数重载允许一个函数有多个类型签名。

```typescript
// 函数重载声明
function process(value: string): string;
function process(value: number): number;
function process(value: boolean): boolean;
// 实现签名（必须兼容所有重载）
function process(value: string | number | boolean): string | number | boolean {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else if (typeof value === "number") {
    return value * 2;
  } else {
    return !value;
  }
}

// 使用
const str = process("hello"); // 类型：string
const num = process(5); // 类型：number
const bool = process(true); // 类型：boolean
```

**实际应用场景**：

```typescript
// API 响应处理
function handleResponse(data: string): string;
function handleResponse(data: object): object;
function handleResponse(data: string | object): string | object {
  if (typeof data === "string") {
    return JSON.parse(data);
  }
  return JSON.stringify(data);
}

// DOM 元素查询
function querySelector(selector: string): HTMLElement | null;
function querySelector(selector: string, all: true): NodeListOf<HTMLElement>;
function querySelector(
  selector: string,
  all?: boolean
): HTMLElement | null | NodeListOf<HTMLElement> {
  return all 
    ? document.querySelectorAll(selector)
    : document.querySelector(selector);
}
```

### 函数作为参数和返回值

```typescript
// 函数作为参数
function executeOperation(
  operation: (a: number, b: number) => number,
  a: number,
  b: number
): number {
  return operation(a, b);
}

const result = executeOperation((x, y) => x + y, 5, 3); // 8

// 函数作为返回值
function createMultiplier(factor: number): (value: number) => number {
  return (value: number) => value * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

**实际应用场景**：

```typescript
// 数组操作
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n: number) => n * 2);
const filtered = numbers.filter((n: number) => n > 2);

// 事件处理
function createEventHandler(callback: (event: Event) => void) {
  return (event: Event) => {
    console.log("事件触发");
    callback(event);
  };
}
```

## 总结

- **类型系统**：使用类型注解和类型推断确保类型安全
- **变量声明**：优先使用 `const`，需要重新赋值时使用 `let`，避免使用 `var`
- **函数**：合理使用可选参数、默认参数、剩余参数和函数重载，提高代码灵活性

