# TypeScript 高级类型

## 1. 联合类型（Union Types）

联合类型表示一个值可以是多种类型中的一种，使用 `|` 符号连接。

### 基本用法

```typescript
// 联合类型：可以是 string 或 number
type StringOrNumber = string | number;

function printId(id: StringOrNumber): void {
  console.log(`ID: ${id}`);
}

printId(101); // ✅ "ID: 101"
printId("202"); // ✅ "ID: 202"
// printId(true); // ❌ 错误：boolean 不在联合类型中
```

### 实际应用场景

```typescript
// API 响应类型
type ApiResponse = 
  | { success: true; data: any }
  | { success: false; error: string };

function handleResponse(response: ApiResponse): void {
  if (response.success) {
    console.log("数据：", response.data);
  } else {
    console.error("错误：", response.error);
  }
}

// 状态类型
type LoadingState = 
  | { status: "loading" }
  | { status: "success"; data: any }
  | { status: "error"; message: string };

function render(state: LoadingState): void {
  switch (state.status) {
    case "loading":
      console.log("加载中...");
      break;
    case "success":
      console.log("数据：", state.data);
      break;
    case "error":
      console.error("错误：", state.message);
      break;
  }
}
```

### 类型收窄（Type Narrowing）

在使用联合类型时，TypeScript 需要确定具体是哪种类型，这个过程叫做类型收窄。

```typescript
function processValue(value: string | number): void {
  // 使用 typeof 进行类型收窄
  if (typeof value === "string") {
    // 在这个分支中，value 的类型被收窄为 string
    console.log(value.toUpperCase()); // ✅ 可以使用 string 的方法
  } else {
    // 在这个分支中，value 的类型被收窄为 number
    console.log(value.toFixed(2)); // ✅ 可以使用 number 的方法
  }
}

// 使用 instanceof 收窄类类型
class Dog {
  bark(): void {
    console.log("汪汪！");
  }
}

class Cat {
  meow(): void {
    console.log("喵喵！");
  }
}

function makeSound(animal: Dog | Cat): void {
  if (animal instanceof Dog) {
    animal.bark(); // ✅ 类型收窄为 Dog
  } else {
    animal.meow(); // ✅ 类型收窄为 Cat
  }
}
```

## 2. 交叉类型（Intersection Types）

交叉类型使用 `&` 符号，表示一个值必须同时满足多个类型。

### 基本用法

```typescript
// 交叉类型：同时具有两个类型的属性
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: number;
  department: string;
};

type EmployeePerson = Person & Employee;

const employee: EmployeePerson = {
  name: "张三",
  age: 30,
  employeeId: 1001,
  department: "技术部"
};
```

### 实际应用场景

```typescript
// 扩展对象类型
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type User = {
  id: number;
  name: string;
  email: string;
};

type UserWithTimestamp = User & Timestamped;

const user: UserWithTimestamp = {
  id: 1,
  name: "张三",
  email: "zhangsan@example.com",
  createdAt: new Date(),
  updatedAt: new Date()
};

// 合并多个接口
interface Loggable {
  log(): void;
}

interface Serializable {
  serialize(): string;
}

type LoggableSerializable = Loggable & Serializable;

class MyClass implements LoggableSerializable {
  log(): void {
    console.log("记录日志");
  }

  serialize(): string {
    return JSON.stringify(this);
  }
}
```

### 函数类型交叉

```typescript
// 函数类型交叉：必须同时满足两个函数签名
type Increment = (x: number) => number;
type Double = (x: number) => number;

// 交叉类型要求函数同时满足两个签名（实际上就是更严格的类型）
type IncrementAndDouble = Increment & Double;

const fn: IncrementAndDouble = (x: number) => x * 2 + 1;
```

## 3. 字面量类型

字面量类型是具体的值作为类型，而不是值的范围。

### 字符串字面量类型

```typescript
// 字符串字面量类型
type Direction = "up" | "down" | "left" | "right";

function move(direction: Direction): void {
  console.log(`向${direction}移动`);
}

move("up"); // ✅
move("down"); // ✅
// move("north"); // ❌ 错误：不在字面量类型中

// 实际应用：HTTP 方法
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

function makeRequest(method: HttpMethod, url: string): void {
  console.log(`${method} ${url}`);
}

makeRequest("GET", "/api/users");
```

### 数字字面量类型

```typescript
// 数字字面量类型
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

function rollDice(): DiceRoll {
  return (Math.floor(Math.random() * 6) + 1) as DiceRoll;
}

// 实际应用：状态码
type SuccessCode = 200 | 201 | 204;
type ErrorCode = 400 | 401 | 403 | 404 | 500;

type StatusCode = SuccessCode | ErrorCode;

function handleStatus(code: StatusCode): void {
  if (code >= 200 && code < 300) {
    console.log("成功");
  } else {
    console.log("错误");
  }
}
```

### 布尔字面量类型

```typescript
// 布尔字面量类型（通常与联合类型一起使用）
type TrueOnly = true;
type FalseOnly = false;

// 实际应用：配置选项
type Config = {
  debug: true | false; // 等同于 boolean
  strict: true; // 只能是 true
  optional: false; // 只能是 false
};
```

### 对象字面量类型

```typescript
// 对象字面量类型
type Point = { x: number; y: number };

const origin: Point = { x: 0, y: 0 };

// 实际应用：事件类型
type ClickEvent = {
  type: "click";
  x: number;
  y: number;
};

type KeyPressEvent = {
  type: "keypress";
  key: string;
};

type AppEvent = ClickEvent | KeyPressEvent;

function handleEvent(event: AppEvent): void {
  if (event.type === "click") {
    console.log(`点击位置：(${event.x}, ${event.y})`);
  } else {
    console.log(`按键：${event.key}`);
  }
}
```

## 4. 类型断言

类型断言告诉 TypeScript 编译器，你比它更了解某个值的类型。

### as 语法

```typescript
// 使用 as 进行类型断言
const someValue: unknown = "这是一个字符串";

// 类型断言：告诉 TypeScript 这是 string 类型
const strLength = (someValue as string).length;

// 实际应用：DOM 操作
const inputElement = document.querySelector("input") as HTMLInputElement;
inputElement.value = "Hello";

// 实际应用：API 响应
interface User {
  id: number;
  name: string;
}

async function fetchUser(): Promise<User> {
  const response = await fetch("/api/user");
  const data = await response.json();
  return data as User; // 断言响应数据是 User 类型
}
```

### <> 语法（不推荐在 JSX 中使用）

```typescript
// 使用 <> 进行类型断言（不能在 JSX 中使用）
const someValue: unknown = "这是一个字符串";
const strLength = (<string>someValue).length;

// 在 .tsx 文件中，推荐使用 as 语法
```

### 双重断言

```typescript
// 双重断言：先断言为 any，再断言为目标类型
const value: string = "hello";

// 如果直接断言可能不兼容，可以使用双重断言
const element = value as any as HTMLElement;

// 注意：双重断言会绕过类型检查，应该谨慎使用
```

### 非空断言

```typescript
// 非空断言：使用 ! 告诉 TypeScript 值不是 null 或 undefined
function getElement(id: string): HTMLElement | null {
  return document.getElementById(id);
}

const element = getElement("myId")!; // 非空断言
element.innerHTML = "Hello"; // ✅ 假设 element 不是 null

// 实际应用：可选链与非空断言结合
interface User {
  name: string;
  address?: {
    street: string;
    city: string;
  };
}

const user: User = {
  name: "张三",
  address: {
    street: "中山路",
    city: "北京"
  }
};

// 使用非空断言（确保 address 存在）
const city = user.address!.city;

// 更安全的方式：使用可选链
const city2 = user.address?.city;
```

### 类型断言 vs 类型守卫

```typescript
// 类型断言：你告诉 TypeScript 类型是什么
function processValue1(value: unknown): void {
  const str = value as string; // 断言，但不进行运行时检查
  console.log(str.toUpperCase());
}

// 类型守卫：TypeScript 通过检查确定类型
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processValue2(value: unknown): void {
  if (isString(value)) {
    // TypeScript 知道 value 是 string
    console.log(value.toUpperCase()); // ✅ 类型安全
  }
}
```

## 5. 类型别名与联合/交叉类型结合

```typescript
// 复杂的类型组合
type ID = string | number;

type User = {
  id: ID;
  name: string;
  role: "admin" | "user" | "guest";
};

type AdminUser = User & {
  role: "admin";
  permissions: string[];
};

type RegularUser = User & {
  role: "user" | "guest";
};

type AppUser = AdminUser | RegularUser;

function getUserInfo(user: AppUser): string {
  if (user.role === "admin") {
    return `管理员 ${user.name}，权限：${user.permissions.join(", ")}`;
  } else {
    return `用户 ${user.name}`;
  }
}
```

## 6. 可辨识联合（Discriminated Unions）

可辨识联合是一种特殊的联合类型，通过一个共同的字面量属性来区分不同的类型。

```typescript
// 可辨识联合：使用 type 字段区分不同类型
type NetworkState =
  | { state: "loading" }
  | { state: "success"; response: string }
  | { state: "error"; error: string };

function handleNetworkState(state: NetworkState): void {
  switch (state.state) {
    case "loading":
      console.log("加载中...");
      break;
    case "success":
      console.log("响应：", state.response); // ✅ TypeScript 知道有 response
      break;
    case "error":
      console.error("错误：", state.error); // ✅ TypeScript 知道有 error
      break;
  }
}

// 实际应用：事件系统
type Event =
  | { type: "click"; x: number; y: number }
  | { type: "keydown"; key: string; ctrlKey: boolean }
  | { type: "scroll"; deltaX: number; deltaY: number };

function handleEvent(event: Event): void {
  switch (event.type) {
    case "click":
      console.log(`点击：(${event.x}, ${event.y})`);
      break;
    case "keydown":
      console.log(`按键：${event.key}，Ctrl: ${event.ctrlKey}`);
      break;
    case "scroll":
      console.log(`滚动：(${event.deltaX}, ${event.deltaY})`);
      break;
  }
}
```

## 总结

- **联合类型（|）**：表示值可以是多种类型之一，需要类型收窄来确定具体类型
- **交叉类型（&）**：表示值必须同时满足多个类型，用于组合类型
- **字面量类型**：使用具体的值作为类型，提供精确的类型约束
- **类型断言**：告诉 TypeScript 某个值的类型，使用 `as` 或 `<>` 语法
- **非空断言（!）**：断言值不是 null 或 undefined
- **可辨识联合**：使用共同属性区分联合类型的不同成员，提供更好的类型安全
- **最佳实践**：
  - 优先使用类型守卫而不是类型断言
  - 使用可辨识联合提高类型安全性
  - 谨慎使用非空断言和双重断言
  - 利用类型收窄减少类型错误


