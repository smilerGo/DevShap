# TypeScript 高级类型特性

## 1. 映射类型（Mapped Types）

映射类型允许基于旧类型创建新类型，通过映射现有类型的属性。

### 基本语法

```typescript
// 基本映射类型语法
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 使用
interface User {
  id: number;
  name: string;
  email: string;
}

type ReadonlyUser = Readonly<User>;
// 等同于：
// {
//   readonly id: number;
//   readonly name: string;
//   readonly email: string;
// }

type PartialUser = Partial<User>;
// 等同于：
// {
//   id?: number;
//   name?: string;
//   email?: string;
// }
```

### 内置映射类型实现

```typescript
// Partial<T> - 所有属性变为可选
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Required<T> - 所有属性变为必需（移除可选标记）
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Readonly<T> - 所有属性变为只读
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Pick<T, K> - 选择部分属性
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit<T, K> - 排除部分属性
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Record<K, T> - 创建记录类型
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

### 实际应用场景

```typescript
// 创建更新类型（所有属性可选，除了 id）
type UpdateUser = Omit<Partial<User>, "id"> & { id: number };

function updateUser(id: number, updates: UpdateUser): void {
  // 更新用户逻辑
}

// 创建只读配置
type Config = {
  apiUrl: string;
  timeout: number;
  retries: number;
};

type ReadonlyConfig = Readonly<Config>;

// 创建字段映射
type FieldMapping = Record<string, string>;

const mapping: FieldMapping = {
  userId: "user_id",
  userName: "user_name"
};

// 选择特定字段
type UserPreview = Pick<User, "id" | "name">;
```

### 自定义映射类型

```typescript
// 将属性值类型转换为字符串
type Stringify<T> = {
  [P in keyof T]: string;
};

type StringifiedUser = Stringify<User>;
// {
//   id: string;
//   name: string;
//   email: string;
// }

// 将属性值类型转换为可选且可为 null
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// 深度只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

// 深度部分
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};
```

## 2. 条件类型（Conditional Types）

条件类型根据条件表达式选择类型，使用 `extends` 关键字。

### 基本语法

```typescript
// 基本条件类型语法
type IsArray<T> = T extends any[] ? true : false;

type A = IsArray<string[]>; // true
type B = IsArray<number>; // false

// 提取数组元素类型
type ArrayElement<T> = T extends (infer U)[] ? U : never;

type Element = ArrayElement<string[]>; // string
type NumberElement = ArrayElement<number[]>; // number
```

### infer 关键字

`infer` 用于在条件类型中推断类型。

```typescript
// 推断函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser(): User {
  return { id: 1, name: "张三", email: "" };
}

type UserReturn = ReturnType<typeof getUser>; // User

// 推断函数参数类型
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function createUser(name: string, age: number): User {
  return { id: 1, name, email: "" };
}

type CreateUserParams = Parameters<typeof createUser>; // [string, number]

// 推断 Promise 类型
type Awaited<T> = T extends Promise<infer U> ? U : T;

type PromiseUser = Promise<User>;
type ResolvedUser = Awaited<PromiseUser>; // User
```

### 分布式条件类型

当条件类型作用于联合类型时，会进行分布式计算。

```typescript
// 分布式条件类型
type ToArray<T> = T extends any ? T[] : never;

type StrOrNumArray = ToArray<string | number>; // string[] | number[]

// 非分布式版本（使用元组包装）
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type StrOrNumArrayNonDist = ToArrayNonDist<string | number>; // (string | number)[]

// 实际应用：过滤类型
type Exclude<T, U> = T extends U ? never : T;

type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<string | number | boolean, number>; // string | boolean

// 提取类型
type Extract<T, U> = T extends U ? T : never;

type T2 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T3 = Extract<string | number | boolean, number>; // number
```

### 实际应用场景

```typescript
// 非空类型
type NonNullable<T> = T extends null | undefined ? never : T;

type T4 = NonNullable<string | null | undefined>; // string

// 函数重载返回类型
type OverloadReturnType<T> = T extends {
  (...args: any[]): infer R;
  (...args: any[]): infer R;
  (...args: any[]): infer R;
} ? R : T extends (...args: any[]) => infer R ? R : never;

// 检查是否为函数类型
type IsFunction<T> = T extends (...args: any[]) => any ? true : false;

type T5 = IsFunction<() => void>; // true
type T6 = IsFunction<string>; // false

// 获取对象值的类型
type ValueOf<T> = T[keyof T];

type UserValues = ValueOf<User>; // number | string
```

## 3. 模板字面量类型

模板字面量类型基于字符串字面量类型构建新类型。

### 基本用法

```typescript
// 基本模板字面量类型
type Greeting = `Hello, ${string}`;

const greeting: Greeting = "Hello, World"; // ✅
// const invalid: Greeting = "Hi, World"; // ❌ 错误

// 组合字面量类型
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<"click">; // "onClick"
type ChangeEvent = EventName<"change">; // "onChange"

// 实际应用：CSS 属性
type CSSProperty = `margin-${"top" | "right" | "bottom" | "left"}`;
// "margin-top" | "margin-right" | "margin-bottom" | "margin-left"
```

### 字符串操作类型

```typescript
// Uppercase - 转大写
type Uppercase<S extends string> = intrinsic;

type T7 = Uppercase<"hello">; // "HELLO"

// Lowercase - 转小写
type Lowercase<S extends string> = intrinsic;

type T8 = Lowercase<"HELLO">; // "hello"

// Capitalize - 首字母大写
type Capitalize<S extends string> = intrinsic;

type T9 = Capitalize<"hello">; // "Hello"

// Uncapitalize - 首字母小写
type Uncapitalize<S extends string> = intrinsic;

type T10 = Uncapitalize<"Hello">; // "hello"
```

### 实际应用场景

```typescript
// API 路由类型
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiRoute = `/api/${string}`;
type FullRoute = `${HttpMethod} ${ApiRoute}`;

const route: FullRoute = "GET /api/users"; // ✅
// const invalid: FullRoute = "PATCH /api/users"; // ❌ 错误

// 事件处理器类型
type EventType = "click" | "change" | "submit";
type HandlerName<T extends EventType> = `handle${Capitalize<T>}`;

type ClickHandler = HandlerName<"click">; // "handleClick"
type ChangeHandler = HandlerName<"change">; // "handleChange"

// 创建事件映射类型
type EventHandlers = {
  [K in EventType as HandlerName<K>]: (event: Event) => void;
};

const handlers: EventHandlers = {
  handleClick: (e) => console.log("clicked"),
  handleChange: (e) => console.log("changed"),
  handleSubmit: (e) => console.log("submitted")
};

// CSS 类名生成
type BEM<B extends string, E extends string[], M extends string[]> = 
  `${B}__${E[number]}` | `${B}--${M[number]}`;

type ButtonClass = BEM<"button", ["icon", "text"], ["primary", "disabled"]>;
// "button__icon" | "button__text" | "button--primary" | "button--disabled"
```

## 4. 索引访问类型

索引访问类型通过索引获取类型的属性类型。

### 基本用法

```typescript
// 访问对象属性类型
type UserName = User["name"]; // string
type UserId = User["id"]; // number

// 访问多个属性类型
type UserInfo = User["id" | "name"]; // number | string

// 访问所有属性类型
type UserValues = User[keyof User]; // number | string

// 访问数组元素类型
type StringArray = string[];
type StringElement = StringArray[number]; // string

// 访问元组元素类型
type Tuple = [string, number, boolean];
type First = Tuple[0]; // string
type Second = Tuple[1]; // number
type All = Tuple[number]; // string | number | boolean
```

### 实际应用场景

```typescript
// 获取函数参数类型
function createUser(name: string, age: number, email: string): User {
  return { id: 1, name, email };
}

type CreateUserParams = Parameters<typeof createUser>; // [string, number, string]
type FirstParam = CreateUserParams[0]; // string
type SecondParam = CreateUserParams[1]; // number

// 获取函数返回类型
type CreateUserReturn = ReturnType<typeof createUser>; // User
type UserIdFromReturn = CreateUserReturn["id"]; // number

// 深度访问嵌套类型
interface ApiResponse {
  data: {
    user: User;
    metadata: {
      total: number;
      page: number;
    };
  };
}

type ApiUser = ApiResponse["data"]["user"]; // User
type ApiTotal = ApiResponse["data"]["metadata"]["total"]; // number

// 安全访问（使用条件类型）
type SafeAccess<T, K extends keyof T> = K extends keyof T ? T[K] : never;

type SafeUserName = SafeAccess<User, "name">; // string
type SafeUserAge = SafeAccess<User, "age">; // never（因为 User 没有 age 属性）
```

## 5. 递归类型

递归类型可以引用自身。

```typescript
// 递归类型：树结构
type TreeNode<T> = {
  value: T;
  children?: TreeNode<T>[];
};

const tree: TreeNode<string> = {
  value: "root",
  children: [
    {
      value: "child1",
      children: [
        { value: "grandchild1" }
      ]
    },
    { value: "child2" }
  ]
};

// 递归类型：JSON 值
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

const json: JSONValue = {
  name: "张三",
  age: 25,
  hobbies: ["阅读", "编程"],
  address: {
    city: "北京",
    coordinates: [39.9, 116.4]
  }
};
```

## 6. 类型操作组合

结合使用多种类型操作创建强大的类型工具。

```typescript
// 深度只读（递归）
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

// 深度部分（递归）
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

// 提取函数类型
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type UserFunctions = FunctionPropertyNames<User>; // 如果 User 有函数属性

// 排除函数属性
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type UserData = Pick<User, NonFunctionPropertyNames<User>>;
```

## 总结

- **映射类型**：基于现有类型创建新类型，通过 `[P in keyof T]` 语法
- **条件类型**：使用 `extends` 和 `infer` 根据条件选择类型
- **模板字面量类型**：基于字符串字面量构建新类型，支持字符串操作
- **索引访问类型**：通过索引获取类型的属性类型
- **递归类型**：类型可以引用自身，用于树形结构等场景
- **类型操作组合**：结合多种类型操作创建强大的类型工具
- **最佳实践**：
  - 使用映射类型创建工具类型
  - 利用条件类型实现类型推断
  - 使用模板字面量类型创建精确的字符串类型
  - 合理使用递归类型处理嵌套结构


