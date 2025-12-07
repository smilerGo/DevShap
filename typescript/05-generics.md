# TypeScript 泛型

泛型（Generics）允许我们创建可重用的组件，这些组件可以处理多种类型而不是单一类型。

## 1. 泛型基础

### 为什么需要泛型

```typescript
// 不使用泛型：需要为每种类型创建函数
function identityNumber(arg: number): number {
  return arg;
}

function identityString(arg: string): string {
  return arg;
}

// 使用 any：失去类型检查
function identityAny(arg: any): any {
  return arg;
}

// 使用泛型：一个函数处理多种类型，保持类型安全
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42); // 类型：number
const str = identity<string>("hello"); // 类型：string
const bool = identity<boolean>(true); // 类型：boolean
```

### 泛型函数

```typescript
// 基本泛型函数
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

const numbers = [1, 2, 3];
const firstNumber = getFirst(numbers); // 类型：number | undefined

const strings = ["a", "b", "c"];
const firstString = getFirst(strings); // 类型：string | undefined

// 多个泛型参数
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const p = pair<string, number>("hello", 42); // 类型：[string, number]
```

### 泛型接口

```typescript
// 泛型接口
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 42 };
const stringBox: Box<string> = { value: "hello" };

// 实际应用：API 响应
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface User {
  id: number;
  name: string;
}

const userResponse: ApiResponse<User> = {
  code: 200,
  message: "成功",
  data: {
    id: 1,
    name: "张三"
  }
};
```

### 泛型类

```typescript
// 泛型类
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): T[] {
    return this.items;
  }
}

const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);
const num = numberContainer.get(0); // 类型：number | undefined

const stringContainer = new Container<string>();
stringContainer.add("hello");
stringContainer.add("world");
```

**实际应用场景**：

```typescript
// 缓存类
class Cache<T> {
  private data: Map<string, T> = new Map();

  set(key: string, value: T): void {
    this.data.set(key, value);
  }

  get(key: string): T | undefined {
    return this.data.get(key);
  }

  has(key: string): boolean {
    return this.data.has(key);
  }

  clear(): void {
    this.data.clear();
  }
}

const userCache = new Cache<User>();
userCache.set("user-1", { id: 1, name: "张三" });
const user = userCache.get("user-1");
```

## 2. 泛型约束

泛型约束使用 `extends` 关键字限制泛型参数必须满足某些条件。

### 基本约束

```typescript
// 约束泛型必须具有 length 属性
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello"); // ✅ string 有 length 属性
logLength([1, 2, 3]); // ✅ array 有 length 属性
// logLength(42); // ❌ number 没有 length 属性
```

### keyof 约束

```typescript
// 使用 keyof 约束泛型必须是对象的键
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  id: 1,
  name: "张三",
  email: "zhangsan@example.com"
};

const name = getProperty(user, "name"); // 类型：string
const id = getProperty(user, "id"); // 类型：number
// const invalid = getProperty(user, "age"); // ❌ 错误：age 不是 user 的键
```

### 实际应用场景

```typescript
// 确保对象具有特定属性
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

const users: User[] = [
  { id: 1, name: "张三" },
  { id: 2, name: "李四" }
];

const user = findById(users, 1); // 类型：User | undefined

// 确保函数类型
function callWithCallback<T extends () => any>(fn: T): ReturnType<T> {
  return fn();
}

const result = callWithCallback(() => "hello"); // 类型：string
```

## 3. 默认泛型参数

TypeScript 支持为泛型参数提供默认值。

```typescript
// 默认泛型参数
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 不指定类型时使用默认值 any
const response1: ApiResponse = {
  code: 200,
  message: "成功",
  data: { anything: "here" }
};

// 指定具体类型
const response2: ApiResponse<User> = {
  code: 200,
  message: "成功",
  data: { id: 1, name: "张三" }
};

// 多个默认参数
function createArray<T = string, U = number>(
  item1: T,
  item2: U
): [T, U] {
  return [item1, item2];
}

const arr1 = createArray("hello", 42); // [string, number]
const arr2 = createArray<boolean, string>(true, "world"); // [boolean, string]
```

## 4. 实际应用场景

### API 请求封装

```typescript
// API 请求函数
async function fetchData<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(url, options);
  const data: ApiResponse<T> = await response.json();
  return data;
}

// 使用
interface Product {
  id: number;
  name: string;
  price: number;
}

async function getProduct(id: number): Promise<Product> {
  const response = await response.json();
  return response.data;
}
```

### 数据转换工具

```typescript
// 数据映射函数
function mapArray<T, U>(
  array: T[],
  mapper: (item: T, index: number) => U
): U[] {
  return array.map(mapper);
}

const numbers = [1, 2, 3, 4, 5];
const doubled = mapArray(numbers, n => n * 2); // number[]
const strings = mapArray(numbers, n => n.toString()); // string[]

// 过滤函数
function filterArray<T>(
  array: T[],
  predicate: (item: T) => boolean
): T[] {
  return array.filter(predicate);
}

const evenNumbers = filterArray(numbers, n => n % 2 === 0);
```

### 状态管理

```typescript
// 状态管理类
class StateManager<T> {
  private state: T;
  private listeners: Array<(state: T) => void> = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(newState: T | ((prev: T) => T)): void {
    this.state = typeof newState === "function"
      ? (newState as (prev: T) => T)(this.state)
      : newState;
    this.notifyListeners();
  }

  subscribe(listener: (state: T) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// 使用
interface AppState {
  user: User | null;
  theme: "light" | "dark";
}

const stateManager = new StateManager<AppState>({
  user: null,
  theme: "light"
});

stateManager.subscribe(state => {
  console.log("状态更新：", state);
});
```

### 工厂模式

```typescript
// 工厂函数
interface Factory<T> {
  create(): T;
}

class UserFactory implements Factory<User> {
  create(): User {
    return {
      id: Math.random(),
      name: "新用户",
      email: ""
    };
  }
}

// 泛型工厂函数
function createFactory<T>(factoryFn: () => T): Factory<T> {
  return {
    create: factoryFn
  };
}

const userFactory = createFactory(() => ({
  id: 1,
  name: "张三",
  email: "zhangsan@example.com"
}));
```

### 工具函数

```typescript
// 深度克隆
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

// 合并对象
function merge<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  return { ...target, ...source };
}

const merged = merge({ a: 1 }, { b: 2 }); // { a: 1, b: 2 }
```

## 5. 条件类型与泛型

```typescript
// 条件类型：根据条件选择类型
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>; // string
type B = NonNullable<number | undefined>; // number

// 提取数组元素类型
type ArrayElementType<T> = T extends (infer U)[] ? U : never;

type Element = ArrayElementType<string[]>; // string
type NumberElement = ArrayElementType<number[]>; // number
```

## 6. 泛型工具类型

```typescript
// 部分类型（Partial）
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 必需类型（Required）
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// 只读类型（Readonly）
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 选择类型（Pick）
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// 排除类型（Omit）
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

## 总结

- **泛型基础**：使用 `<T>` 定义泛型，提高代码复用性和类型安全
- **泛型约束**：使用 `extends` 限制泛型参数必须满足的条件
- **keyof 约束**：确保泛型参数是对象的键
- **默认参数**：为泛型参数提供默认值，简化使用
- **实际应用**：
  - API 请求封装
  - 数据转换工具
  - 状态管理
  - 工厂模式
  - 工具函数
- **最佳实践**：
  - 优先使用泛型而不是 any
  - 使用约束确保类型安全
  - 合理使用默认泛型参数
  - 结合条件类型创建强大的类型工具


