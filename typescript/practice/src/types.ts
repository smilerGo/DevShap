interface StringDictionary {
    [key: string]: string;
}

interface EventHandler {
    (event: Event): void;
}

interface CompareFunc<T> {
    (a: T, b: T): number;
}

type Status = "pending" | "approved" | "rejected";

class CTUtils {
    name:  string;
    age: number;
    city: string;

    constructor(name: string, age: number, city: string) {
        this.name = name;
        this.age = age;
        this.city = city;
    }

    getName(): string {
        return this.name;
    }

    getAge(): number {
        return this.age;
    }

    getCity(): string {
        return this.city;
    }

    getInfo(): string {
        return `Name: ${this.name}, Age: ${this.age}, City: ${this.city}`;
    }


}


class C1 {
    _id: number;
    constructor(_id: number, public name: string) {
        this._id = _id;
    }
    get id(): number {
        return this._id;
    }
}


// 基础接口示例
interface User {
    id: number;
    name: string;
    email: string;
    age?: number;  // 可选属性
    city?: string; // 可选属性
}

// ============================================
// P in keyof T 详解
// ============================================
// 
// 这是 TypeScript 的映射类型（Mapped Types）语法
// 
// 语法分解：
// 1. keyof T - 获取类型 T 的所有键（属性名）组成的联合类型
// 2. P in ... - 遍历联合类型中的每个成员，P 是循环变量
// 3. [P in keyof T] - 为每个键 P 创建一个新的属性
// 
// 示例理解：
// 假设 T = { id: number; name: string; email: string; }
// 
// keyof T = "id" | "name" | "email"  (所有键的联合类型)
// 
// [P in keyof T] 会遍历这三个键：
// - P = "id"   → 创建属性 id
// - P = "name" → 创建属性 name  
// - P = "email" → 创建属性 email
// 
// T[P] 表示类型 T 中键 P 对应的值的类型
// - T["id"] = number
// - T["name"] = string
// - T["email"] = string

// keyof 操作符示例
type UserKeys = keyof User;
// 结果: "id" | "name" | "email" | "age" | "city"
// 解释: 获取 User 接口中所有属性名的联合类型
const key1: UserKeys = "id";     // ✅
const key2: UserKeys = "name";   // ✅
const key3: UserKeys = "email";  // ✅
// const key4: UserKeys = "phone"; // ❌ 错误：phone 不是 User 的属性

// 使用 keyof 访问属性类型
type UserIdType = User["id"];        // 结果: number
type UserNameType = User["name"];    // 结果: string
type UserAgeType = User["age"];      // 结果: number | undefined (因为 age 是可选的)

// P in keyof T 完整示例
// 手动实现一个简单的映射类型来理解
type SimpleMapped<T> = {
    [P in keyof T]: T[P];
};
// 这个类型实际上就是原类型 T 的副本

type MappedUser = SimpleMapped<User>;
// 结果: { id: number; name: string; email: string; age?: number; city?: string; }
// 解释: 遍历 User 的每个键，保持原类型不变

// 更复杂的映射类型示例
type ReadonlyKeys<T> = {
    readonly [P in keyof T]: T[P];
};
// 解释: 遍历 T 的每个键 P，将对应的值类型设为只读

type OptionalKeys<T> = {
    [P in keyof T]?: T[P];
};
// 解释: 遍历 T 的每个键 P，将对应的值类型设为可选

// 实际应用：创建一个类型，将所有属性名转为大写字符串
type UppercaseKeys<T> = {
    [P in keyof T as Uppercase<string & P>]: T[P];
};
// 注意: 这里使用了 as 子句来重命名键（TypeScript 4.1+）

// Partial<T> - 所有属性变为可选（使用 P in keyof T）
type Partial<T> = {
    [P in keyof T]?: T[P];
};

// Partial 使用示例
type PartialUser = Partial<User>;
// 结果: { id?: number; name?: string; email?: string; age?: number; city?: string; }
const partialUser1: PartialUser = {}; // ✅ 所有属性都是可选的
const partialUser2: PartialUser = { name: "张三" }; // ✅ 可以只提供部分属性
const partialUser3: PartialUser = { id: 1, name: "李四", email: "li@example.com" }; // ✅ 也可以提供全部

// Required<T> - 所有属性变为必需（移除可选标记）
type Required<T> = {
    [P in keyof T]-?: T[P];
};

// Required 使用示例
type RequiredUser = Required<User>;
// 结果: { id: number; name: string; email: string; age: number; city: string; }
const requiredUser1: RequiredUser = {
    id: 1,
    name: "王五",
    email: "wang@example.com",
    age: 25,
    city: "北京"
}; // ✅ 所有属性都必须提供
// const requiredUser2: RequiredUser = { id: 1, name: "王五" }; // ❌ 错误：缺少必需属性

// Readonly<T> - 所有属性变为只读
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

// Readonly 使用示例
type ReadonlyUser = Readonly<User>;
const readonlyUser: ReadonlyUser = {
    id: 1,
    name: "赵六",
    email: "zhao@example.com",
    age: 30
};
// readonlyUser.id = 2; // ❌ 错误：无法赋值，因为属性是只读的
// readonlyUser.name = "新名字"; // ❌ 错误：无法赋值

// Pick<T, K> - 选择部分属性
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

// Pick 使用示例
type UserBasicInfo = Pick<User, "id" | "name" | "email">;
// 结果: { id: number; name: string; email: string; }
const basicInfo: UserBasicInfo = {
    id: 1,
    name: "孙七",
    email: "sun@example.com"
}; // ✅ 只包含选中的属性
// const basicInfo2: UserBasicInfo = { id: 1, name: "孙七", age: 25 }; // ❌ 错误：age 不在选中范围内

// Exclude<T, U> - 从类型 T 中排除可以赋值给类型 U 的类型
// 语法解析：
// - T extends U ? never : T 是一个条件类型
// - 如果 T 可以赋值给 U，返回 never（表示排除）
// - 否则返回 T（保留该类型）
// - 当 T 是联合类型时，会进行分布式条件类型计算（每个成员单独判断）
type Exclude<T, U> = T extends U ? never : T;

// Exclude 使用示例
type AllStatus = "pending" | "approved" | "rejected" | "cancelled";
type ActiveStatus = Exclude<AllStatus, "cancelled">;
// 结果: "pending" | "approved" | "rejected"
// 解释: 从 AllStatus 中排除了 "cancelled"，保留了其他三个状态
const active1: ActiveStatus = "pending";   // ✅
const active2: ActiveStatus = "approved";  // ✅
const active3: ActiveStatus = "rejected";  // ✅
// const active4: ActiveStatus = "cancelled"; // ❌ 错误：已被排除

// 排除多个类型
type NumberTypes = string | number | boolean | null | undefined;
type PrimitiveTypes = Exclude<NumberTypes, null | undefined>;
// 结果: string | number | boolean
// 解释: 排除了 null 和 undefined，保留了基本类型
const primitive1: PrimitiveTypes = "hello";  // ✅
const primitive2: PrimitiveTypes = 123;      // ✅
const primitive3: PrimitiveTypes = true;     // ✅
// const primitive4: PrimitiveTypes = null;    // ❌ 错误：已被排除

// 排除函数类型
type AllTypes = string | number | (() => void) | boolean;
type NonFunctionTypes = Exclude<AllTypes, Function>;
// 结果: string | number | boolean
// 解释: 排除了函数类型，保留了其他类型
const nonFunc1: NonFunctionTypes = "text";  // ✅
const nonFunc2: NonFunctionTypes = 42;      // ✅
const nonFunc3: NonFunctionTypes = false;   // ✅
// const nonFunc4: NonFunctionTypes = () => {}; // ❌ 错误：函数类型已被排除

// 分布式条件类型的工作原理
// 当 T 是联合类型 "a" | "b" | "c" 时：
// Exclude<"a" | "b" | "c", "b"> 
// = ("a" extends "b" ? never : "a") | ("b" extends "b" ? never : "b") | ("c" extends "b" ? never : "c")
// = "a" | never | "c"
// = "a" | "c"  (never 在联合类型中会被自动移除)

// Omit<T, K> - 排除部分属性（内部使用了 Exclude）
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Omit 使用示例
type UserWithoutId = Omit<User, "id">;
// 结果: { name: string; email: string; age?: number; city?: string; }
const userWithoutId: UserWithoutId = {
    name: "周八",
    email: "zhou@example.com",
    age: 28
}; // ✅ 不包含 id 属性
// const userWithoutId2: UserWithoutId = { id: 1, name: "周八" }; // ❌ 错误：不能包含 id

type UserContact = Omit<User, "id" | "age">;
// 结果: { name: string; email: string; city?: string; }
const contact: UserContact = {
    name: "吴九",
    email: "wu@example.com",
    city: "上海"
}; // ✅ 排除了 id 和 age

// Record<K, T> - 创建记录类型
type Record<K extends keyof any, T> = {
    [P in K]: T;
};

// Record 使用示例
type UserMap = Record<string, User>;
// 结果: { [key: string]: User; }
const userMap: UserMap = {
    "user1": { id: 1, name: "郑十", email: "zheng@example.com" },
    "user2": { id: 2, name: "钱一", email: "qian@example.com", age: 25 }
}; // ✅ 字符串键映射到 User 对象

type StatusMap = Record<"pending" | "approved" | "rejected", number>;
// 结果: { pending: number; approved: number; rejected: number; }
const statusCounts: StatusMap = {
    pending: 5,
    approved: 10,
    rejected: 2
}; // ✅ 特定键映射到数字

type NumberRecord = Record<number, string>;
// 结果: { [key: number]: string; }
const numberMap: NumberRecord = {
    1: "第一",
    2: "第二",
    3: "第三"
}; // ✅ 数字键映射到字符串


export type { StringDictionary, EventHandler, CompareFunc , Status};