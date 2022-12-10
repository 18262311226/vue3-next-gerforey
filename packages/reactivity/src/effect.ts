import { isArray } from "@vue/shared"
import { computedRefImpl } from "./computed"
import { createDep, Dep } from "./dep"

type KetToDepMap = Map<any , Dep>
const targetMap = new WeakMap<any , KetToDepMap>()

export function effect<T = any> (fn: () => T) {
    const _effect = new ReactiveEffect(fn) 
    _effect.run()
}

export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
    computed?: computedRefImpl<T>

    constructor(public fn: () => T){}

    run(){
        activeEffect = this
        return this.fn()
    }
}

/**
 * 收集依赖
 * 
 * @param target 
 * @param key 
 */
export function track (target: object, key: unknown) {
    if(!activeEffect) return

    let depsMap = targetMap.get(target)
    if(!depsMap){
        targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)
    if(!dep){
        depsMap.set(key, (dep = createDep()))
    }

    trackEffects(dep)
}

/**
 * 
 * @param dep 
 */
export function trackEffects (dep: Dep) {
    dep.add(activeEffect!)
}
/**
 * 触发依赖
 * 
 * @param target 
 * @param key 
 * @param newValue 
 */
export function trigger (target: object, key: unknown, newValue: unknown) {
    const depsMap = targetMap.get(target)

    if(!depsMap) return

    const dep: Dep | undefined = depsMap.get(key)

    if(!dep) return

    triggerEffects(dep)
}

/**
 * 
 * @param dep 
 */
export function triggerEffects (dep: Dep) {
    const effects = isArray(dep) ? [...dep] : dep

    for(const effect of effects){
        triggerEffect(effect)
    }
}

export function triggerEffect (effect: ReactiveEffect) {
    effect && effect.run()
}