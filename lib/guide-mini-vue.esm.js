const TYPE_MAP = {
    string: '[object String]',
    number: '[object Number]',
    boolean: '[object Boolean]',
    null: '[object Null]',
    undefined: '[object Undefined]',
    object: '[object Object]',
    array: '[object Array]',
    function: '[object Function]',
    symbol: '[object Symbol]',
};
const getTypeString = (tar) => Object.prototype.toString.call(tar);
const isStr = (tar) => getTypeString(tar) === TYPE_MAP.string;
const isObj = (tar) => getTypeString(tar) === TYPE_MAP.object;
const isArr = (tar) => getTypeString(tar) === TYPE_MAP.array;
const isFun = (tar) => getTypeString(tar) === TYPE_MAP.function;
const extend = Object.assign;
const hasChanged = (val, newVal) => !Object.is(val, newVal);

// 全局的依赖收集对象
const targetMap = new Map();
// 当前执行的 effect fn
let activeEffect;
// 全局 track 开关 防止 obj.x ++ 会重新触发依赖收集 导致 stop 无效
let shouldTrack;
// 依赖工厂
class ReactiveEffect {
    constructor(fn, option = {}) {
        this.deps = [];
        // 标记用户是否多次调用 stop
        this.active = true;
        const { scheduler, onStop } = option;
        this._fn = isFun(fn) ? fn : () => { };
        this._scheduler = isFun(scheduler) ? scheduler : null;
        this._onStop = isFun(onStop) ? onStop : null;
    }
    run() {
        // 执行依赖
        // 执行的过程中 会触发数据劫持
        // 从而触发 trigger 来收集刚赋值的 activeEffect
        if (!this.active)
            return this._fn();
        // change state
        shouldTrack = true;
        // 将当前依赖保存到全局 用于收集
        activeEffect = this;
        const result = this._fn();
        // reset state
        shouldTrack = false;
        return result;
    }
    stop() {
        // 只清空一次 防止重复删除 浪费性能
        if (this.active) {
            // 删除掉 depsMap 里所有的 dep
            cleanupEffect(this);
            if (this._onStop)
                this._onStop();
            this.active = false;
        }
    }
}
function cleanupEffect(effect) {
    effect.deps.forEach((dep) => {
        // 因为 dep 是 Set 结构
        dep.delete(effect);
    });
}
// 收集依赖 - 入口
function track(target, key) {
    if (!isTracking())
        return;
    // 数据结构为
    // targetMap -> depsMap -> dep
    // 全局的 targetMap 最外层的大管家
    // 里面包含 depsMap 用于存储依赖 [key: target , value : effect Set]
    // deps 为所有的依赖的集合 [effect Set]
    let depsMap = targetMap.get(target);
    // 初始化的时候没有 depsMap
    // 创建 depsMap
    if (!depsMap) {
        depsMap = new Map();
        // 追加到全局的 依赖收集对象中
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    // 初始化时没有 deps
    if (!dep) {
        // 声明一个空集合
        dep = new Set();
        // 追加到 depsMap 中
        depsMap.set(key, dep);
    }
    trackEffects(dep);
}
// 收集依赖 - 执行
function trackEffects(dep) {
    // 如果没有重复的依赖
    if (dep.has(activeEffect))
        return;
    // 就进行依赖收集
    dep.add(activeEffect);
    // note
    // 想要实现 stop 功能
    // 需要将 dep 反向收集到 activeEffect 中
    // 在执行 stop 时 只需要将 deps 中的所有 dep 清空即可
    // 如果没有调用 effect 就不会有 activeEffect
    activeEffect.deps.push(dep);
}
// 是否可以被收集
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}
// 触发依赖
function trigger(target, key) {
    // 在全局依赖中取出 depsMap
    const depsMap = targetMap.get(target);
    // 拿到依赖的集合
    const dep = depsMap.get(key);
    triggerEffects(dep);
}
// 遍历集合 执行依赖
function triggerEffects(dep) {
    for (const effect of dep) {
        // 如果 options 中有 scheduler
        // 就调用 scheduler
        if (effect._scheduler) {
            effect._scheduler();
        }
        else {
            effect.run();
        }
    }
}
function effect(fn, options) {
    // 创建 effect 对象
    const _effect = new ReactiveEffect(fn, options);
    // 执行传入的 fn
    _effect.run();
    // 声明 runner
    const runner = _effect.run.bind(_effect);
    // 拓展 runner
    extend(runner, {
        effect: _effect,
    });
    return runner;
}
// 如果想取消通知 只需要删除 depsMap 中所有的 dep
function stop(runner) {
    if (runner.effect)
        runner.effect.stop();
}

// ref 的构造类
// 劫持这个 class 的
// get value 和 set value
class RefImpl {
    constructor(value) {
        this.__V_IS_REF = true;
        this._rawValue = value;
        this._value = convert(value);
        this.dep = new Set();
    }
    get value() {
        trackRefValue(this);
        return this._value;
    }
    set value(newValue) {
        // 防止 赋相同的值
        // 会导致重新 trigger
        if (!hasChanged(newValue, this._rawValue))
            return;
        // set
        this._value = convert(newValue);
        this._rawValue = newValue;
        // trigger
        triggerEffects(this.dep);
    }
}
function convert(value) {
    return isObj(value) ? reactive(value) : value;
}
// ref 函数入口
function ref(value) {
    return createRefImp(value);
}
function createRefImp(value) {
    return new RefImpl(value);
}
function trackRefValue(ref) {
    // 如果可以收集依赖
    // 防止没调用 effect 直接 get
    if (isTracking()) {
        trackEffects(ref.dep);
    }
}
function isRef(r) {
    return !!r.__V_IS_REF;
}
function unRef(raw) {
    return isRef(raw) ? raw._rawValue : raw;
}
// 为什么在 <template> 中读取 ref 不需要 ref.value
// 就是因为在这个函数中劫持了 get
function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs)
        ? objectWithRefs
        : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}

// common getter && setter
// use for
// reactive
const get = createGetter();
const set = createSetter();
// readonly getter && setter
// use for
// readonly
const readonlyGet = createGetter(true);
// shallowReadonly getter && setter
//
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadOnly = false, shallow = false) {
    return function get(target, key) {
        // 处理 isReadOnly 和 isReactive
        // 触发 getter 时 如果 key 为
        // IS_REACTIVE || IS_READONLY
        // 则提前 return
        if (key === REACTIVE_FLAGS.IS_REACTIVE) {
            return !isReadOnly;
        }
        else if (key === REACTIVE_FLAGS.IS_READONLY) {
            return isReadOnly;
        }
        const res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        // 判断 res 是否是 Object
        // 如果是嵌套的结构
        if (isObj(res) || isArr(res)) {
            return isReadOnly ? readonly(res) : reactive(res);
        }
        if (!isReadOnly) {
            // 需要进行依赖的收集
            track(target, key);
        }
        return res;
    };
}
function createSetter(isReadOnly = false) {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        // 触发依赖
        trigger(target, key);
        return res;
    };
}
// 不可变的 proxy 处理器
const mutableHandler = {
    get,
    set,
};
// readonly 的 proxy 处理器
const readonlyHandlers = {
    get: readonlyGet,
    set(t, key) {
        // 给出警告
        console.warn(`key : ${key} set fail , because set target is a readonly object`);
        return true;
    },
};
// shallowReadonly 的 proxy 处理器
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});
const shallowUnwrapHandlers = {
    // 在 get 时调用 unRef 拆包
    get(target, key) {
        return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
        // 如果 set 的目标是 ref
        // 并且
        // set value 不是 ref
        // 就给目标 ref 直接 .value 赋值
        if (isRef(target[key]) && !isRef(value)) {
            return (target[key].value = value);
        }
        else {
            // 目标不是 ref
            // 或者
            // set value 是 ref
            return Reflect.set(target, key, value);
        }
    },
};

var REACTIVE_FLAGS;
(function (REACTIVE_FLAGS) {
    REACTIVE_FLAGS["IS_REACTIVE"] = "__V_REACTIVE";
    REACTIVE_FLAGS["IS_READONLY"] = "__V_READONLY";
})(REACTIVE_FLAGS || (REACTIVE_FLAGS = {}));
function reactive(raw) {
    return createActiveObject(raw, mutableHandler);
}
// readonly 只有 get
function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}
function createActiveObject(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}
function shallowReadonly(raw) {
    return new Proxy(raw, shallowReadonlyHandlers);
}
// isReactive 和 isReadOnly
// 思路为 : 触发 getter 根据 handler 中的 isReadOnly 判断
function isReactive(value) {
    return !!value[REACTIVE_FLAGS.IS_REACTIVE];
}
function isReadOnly(value) {
    return !!value[REACTIVE_FLAGS.IS_READONLY];
}
function isProxy(value) {
    return isReadOnly(value) || isReactive(value);
}

// computed 特点
// 1 : 不触发 get value 不执行 getter function
// 2 :
class ComputedImpl {
    constructor(getter) {
        // 全局的开关
        // 根据 _dirty 来控制缓存
        this._dirty = true;
        // NOTE
        // 这里需要借助 ReactiveEffect 这个类
        // 用来收集 getter 中的依赖
        // 如果触发了 setter 导致依赖更新
        // 就改变 _dirty 重新执行 getter 获取最新的值
        // 之后在 get value 的时候返回出去
        this._effect = new ReactiveEffect(getter, {
            scheduler: () => {
                if (!this._dirty)
                    this._dirty = true;
            },
        });
    }
    get value() {
        if (this._dirty) {
            this._dirty = false;
            // NOTE
            // 在 get value 时才调用 getter function
            this._value = this._effect.run();
        }
        return this._value;
    }
}
function computed(getter) {
    return new ComputedImpl(getter);
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    // TODO :
    // 1 : initProps()
    // 2 : initSlots()
    // 初始化 有状态的 component
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // TODO :
    // setup result is render function
    if (isFun(setupResult)) ;
    // 如果是对象
    // 当做 state 处理
    else if (isObj(setupResult)) {
        instance.setupResult = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    console.log(instance, Component, 'instance');
    instance.render = Component.render;
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

function render(vnode, container) {
    // 调用 patch
    patch(vnode);
}
function patch(vnode, container) {
    // 判断节点类型
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    // 1 : 创建组件实例
    const instance = createComponentInstance(vnode);
    // 2 : 安装组件
    setupComponent(instance);
    console.log(instance, 'instance222');
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    // 根节点下的 虚拟节点树
    const subTree = instance.render();
    // vnode -> patch element -> mount element
    patch(subTree);
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            if (isStr(rootContainer)) {
                rootContainer = document.querySelector(rootContainer);
            }
            // NOTE
            // 先将组件转换成 vnode
            // 所有的逻辑操作 都是基于 vnode 的
            const vnode = createVNode(rootComponent);
            render(vnode);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { REACTIVE_FLAGS, ReactiveEffect, computed, createApp, createComponentInstance, createVNode, effect, h, isProxy, isReactive, isReadOnly, isRef, isTracking, proxyRefs, reactive, readonly, ref, render, setupComponent, shallowReadonly, stop, track, trackEffects, trigger, triggerEffects, unRef };
