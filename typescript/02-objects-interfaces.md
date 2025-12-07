# TypeScript 对象和接口

## 1. 接口（Interface）

接口是 TypeScript 中定义对象形状的主要方式，它描述了一个对象应该具有哪些属性和方法。

### 基本接口定义

```typescript
// 定义用户接口
interface User {
  name: string;
  age: number;
  email: string;
}

// 使用接口
const user: User = {
  name: "张三",
  age: 25,
  email: "zhangsan@example.com"
};

// ❌ 错误：缺少必需的属性
// const incompleteUser: User = {
//   name: "李四"
// };
```

### 可选属性

使用 `?` 标记可选属性，表示该属性可以存在也可以不存在。

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  description?: string; // 可选属性
  category?: string;    // 可选属性
}

// ✅ 可以只提供必需属性
const product1: Product = {
  id: 1,
  name: "商品A",
  price: 99.99
};

// ✅ 也可以提供可选属性
const product2: Product = {
  id: 2,
  name: "商品B",
  price: 199.99,
  description: "这是一个很好的商品",
  category: "电子产品"
};
```

**实际应用场景**：

```typescript
// API 响应接口
interface ApiResponse {
  code: number;
  message: string;
  data?: any; // 可选的数据字段
  timestamp?: number; // 可选的时间戳
}

// 表单数据接口
interface FormData {
  username: string;
  password: string;
  rememberMe?: boolean; // 可选的记住我选项
  captcha?: string;     // 可选的验证码
}
```

### 只读属性

使用 `readonly` 关键字标记只读属性，初始化后不能修改。

```typescript
interface Config {
  readonly apiUrl: string;
  readonly version: string;
  timeout: number; // 普通属性可以修改
}

const config: Config = {
  apiUrl: "https://api.example.com",
  version: "1.0.0",
  timeout: 5000
};

// config.apiUrl = "https://other.com"; // ❌ 错误：只读属性不能修改
config.timeout = 10000; // ✅ 允许：普通属性可以修改
```

**实际应用场景**：

```typescript
// 用户ID和创建时间应该是只读的
interface User {
  readonly id: number;
  name: string;
  readonly createdAt: Date;
  updatedAt: Date;
}

// 常量配置
interface AppConstants {
  readonly MAX_RETRY_COUNT: number;
  readonly DEFAULT_TIMEOUT: number;
}
```

### 索引签名

索引签名允许对象具有任意数量的属性，只要键和值的类型匹配。

```typescript
// 字符串索引签名
interface StringDictionary {
  [key: string]: string;
}

const dictionary: StringDictionary = {
  hello: "你好",
  world: "世界",
  // 可以添加任意字符串键值对
  custom: "自定义"
};

// 数字索引签名
interface NumberArray {
  [index: number]: string;
}

const array: NumberArray = {
  0: "第一项",
  1: "第二项",
  2: "第三项"
};
```

**实际应用场景**：

```typescript
// 动态配置对象
interface ConfigMap {
  [key: string]: string | number | boolean;
}

const appConfig: ConfigMap = {
  theme: "dark",
  fontSize: 14,
  enableNotifications: true,
  apiEndpoint: "https://api.example.com"
};

// 缓存对象
interface Cache {
  [key: string]: any;
}

const cache: Cache = {
  user: { id: 1, name: "张三" },
  settings: { theme: "dark" },
  data: [1, 2, 3]
};
```

### 函数类型接口

接口可以描述函数类型。

```typescript
// 函数接口
interface SearchFunc {
  (source: string, subString: string): boolean;
}

// 实现函数接口
const mySearch: SearchFunc = function(src: string, sub: string): boolean {
  return src.indexOf(sub) > -1;
};

// 箭头函数实现
const mySearch2: SearchFunc = (src, sub) => src.includes(sub);
```

**实际应用场景**：

```typescript
// 事件处理器接口
interface EventHandler {
  (event: Event): void;
}

// 比较函数接口
interface CompareFunc<T> {
  (a: T, b: T): number;
}

const numberCompare: CompareFunc<number> = (a, b) => a - b;
const stringCompare: CompareFunc<string> = (a, b) => a.localeCompare(b);
```

### 接口继承

接口可以继承其他接口，实现接口的组合。

```typescript
// 基础接口
interface Animal {
  name: string;
  age: number;
}

// 继承接口
interface Dog extends Animal {
  breed: string;
  bark(): void;
}

// 多重继承
interface Cat extends Animal {
  color: string;
  meow(): void;
}

// 实现接口
const myDog: Dog = {
  name: "旺财",
  age: 3,
  breed: "金毛",
  bark: () => console.log("汪汪！")
};
```

**实际应用场景**：

```typescript
// 基础实体接口
interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// 用户接口继承基础实体
interface User extends BaseEntity {
  username: string;
  email: string;
}

// 文章接口继承基础实体
interface Article extends BaseEntity {
  title: string;
  content: string;
  authorId: number;
}
```

### 接口合并

TypeScript 允许同名接口自动合并。

```typescript
// 第一次声明
interface Window {
  title: string;
}

// 第二次声明（自动合并）
interface Window {
  width: number;
  height: number;
}

// 合并后的接口包含所有属性
const window: Window = {
  title: "我的窗口",
  width: 800,
  height: 600
};
```

**实际应用场景**：

```typescript
// 扩展全局对象
interface Window {
  myCustomProperty: string;
}

// 扩展第三方库类型
interface JQuery {
  myPlugin(): void;
}
```

## 2. 类型别名（Type）

类型别名使用 `type` 关键字创建类型的别名，可以用于任何类型。

### 基本类型别名

```typescript
// 为基本类型创建别名
type ID = number;
type Name = string;
type Status = boolean;

// 使用类型别名
const userId: ID = 1001;
const userName: Name = "张三";
const isActive: Status = true;
```

### 对象类型别名

```typescript
// 对象类型别名
type Point = {
  x: number;
  y: number;
};

type User = {
  id: number;
  name: string;
  email: string;
};

const point: Point = { x: 10, y: 20 };
const user: User = {
  id: 1,
  name: "张三",
  email: "zhangsan@example.com"
};
```

### 联合类型别名

```typescript
// 联合类型别名
type Status = "pending" | "approved" | "rejected";
type ID = string | number;
type NullableString = string | null;

const orderStatus: Status = "pending";
const userId: ID = 1001; // 或 "user-1001"
const description: NullableString = null;
```

### 函数类型别名

```typescript
// 函数类型别名
type Calculator = (a: number, b: number) => number;
type EventHandler = (event: Event) => void;
type Validator = (value: string) => boolean;

const add: Calculator = (a, b) => a + b;
const handleClick: EventHandler = (e) => console.log("点击了");
const validateEmail: Validator = (email) => email.includes("@");
```

### 复杂类型别名

```typescript
// 复杂类型组合
type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
  timestamp: number;
};

type UserResponse = ApiResponse<{
  id: number;
  name: string;
  email: string;
}>;

// 使用
const response: UserResponse = {
  code: 200,
  message: "成功",
  data: {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com"
  },
  timestamp: Date.now()
};
```

## 3. 接口 vs 类型别名

### 主要区别

| 特性 | 接口（Interface） | 类型别名（Type） |
|------|------------------|-----------------|
| 扩展方式 | 使用 `extends` | 使用 `&`（交叉类型） |
| 合并 | 支持声明合并 | 不支持声明合并 |
| 适用场景 | 对象形状定义 | 任何类型定义 |
| 计算属性 | 不支持 | 支持（映射类型等） |

### 接口示例

```typescript
// 接口扩展
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// 接口合并
interface Config {
  apiUrl: string;
}

interface Config {
  timeout: number;
}

// 合并后：{ apiUrl: string; timeout: number }
```

### 类型别名示例

```typescript
// 类型别名扩展（使用交叉类型）
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};

// 类型别名不支持合并
// type Config = { apiUrl: string; };
// type Config = { timeout: number; }; // ❌ 错误：重复声明

// 但可以使用联合类型
type Status = "active" | "inactive";
type ID = string | number;
```

### 选择建议

**使用接口的场景**：
- 定义对象的形状
- 需要声明合并
- 定义公共 API（可以被类实现）

```typescript
// ✅ 推荐使用接口
interface User {
  id: number;
  name: string;
}

class AdminUser implements User {
  id: number;
  name: string;
  role: string;
}
```

**使用类型别名的场景**：
- 联合类型、交叉类型
- 元组类型
- 映射类型
- 需要计算属性的类型

```typescript
// ✅ 推荐使用类型别名
type Status = "pending" | "approved" | "rejected";
type Point = [number, number];
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

## 4. 对象类型

### 内联对象类型

不通过接口或类型别名，直接定义对象类型。

```typescript
// 内联对象类型
function printUser(user: { name: string; age: number }): void {
  console.log(`${user.name} 今年 ${user.age} 岁`);
}

printUser({ name: "张三", age: 25 });

// 内联对象类型与可选属性
function createUser(data: {
  name: string;
  email: string;
  age?: number;
}): void {
  // ...
}
```

**使用场景**：
- 简单的、一次性使用的对象类型
- 函数参数类型
- 不需要复用的类型定义

### 对象解构类型

在函数参数中使用解构语法。

```typescript
// 对象解构参数
function greet({ name, age }: { name: string; age: number }): void {
  console.log(`你好，${name}，你今年${age}岁`);
}

greet({ name: "张三", age: 25 });

// 解构与默认值
function createUser({
  name,
  email,
  age = 18
}: {
  name: string;
  email: string;
  age?: number;
}): void {
  console.log(`创建用户：${name}, ${email}, ${age}岁`);
}

createUser({ name: "李四", email: "lisi@example.com" });
```

**实际应用场景**：

```typescript
// 配置对象
function initializeApp(config: {
  apiUrl: string;
  timeout: number;
  retries?: number;
}): void {
  // 初始化应用
}

// 事件对象
function handleEvent({
  type,
  target,
  data
}: {
  type: string;
  target: HTMLElement;
  data?: any;
}): void {
  // 处理事件
}
```

### 嵌套对象类型

```typescript
// 嵌套对象类型
interface Address {
  street: string;
  city: string;
  zipCode: string;
}

interface User {
  id: number;
  name: string;
  address: Address; // 嵌套对象
  contacts?: {
    email: string;
    phone: string;
  }; // 可选嵌套对象
}

const user: User = {
  id: 1,
  name: "张三",
  address: {
    street: "中山路123号",
    city: "北京",
    zipCode: "100000"
  },
  contacts: {
    email: "zhangsan@example.com",
    phone: "13800138000"
  }
};
```

### 只读对象类型

```typescript
// 只读对象类型
interface ReadonlyUser {
  readonly id: number;
  readonly name: string;
  readonly profile: {
    readonly avatar: string;
    readonly bio: string;
  };
}

const user: ReadonlyUser = {
  id: 1,
  name: "张三",
  profile: {
    avatar: "avatar.jpg",
    bio: "这是我的简介"
  }
};

// user.id = 2; // ❌ 错误：只读属性
// user.profile.avatar = "new.jpg"; // ❌ 错误：只读属性
```

## 总结

- **接口（Interface）**：适合定义对象形状，支持继承和声明合并
- **类型别名（Type）**：适合定义联合类型、交叉类型等复杂类型
- **对象类型**：可以直接内联定义，适合简单场景
- **选择原则**：对象形状用接口，复杂类型用类型别名，简单场景用内联类型

