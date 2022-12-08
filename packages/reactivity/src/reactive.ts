import { isObject } from "@vue/shared";
import { mutableHandlers } from "./baseHandlers";
export const reactiveMap = new WeakMap<Object, any>()

export function reactive (target: Object) {
    return createReactiveObject (target, mutableHandlers, reactiveMap)
}

function createReactiveObject (target, baseHandlers:ProxyHandler<any>, proxyMap:WeakMap<Object, any>) {
    const existingProxy = proxyMap.get(target)

    if(existingProxy){
        return existingProxy
    }

    const proxy = new Proxy(target, baseHandlers)

    proxyMap.set(target, proxy)

    return proxy
}

export function toReactive<T extends unknown> (value: T): T {
    return isObject(value) ? reactive(value as Object) : value
}