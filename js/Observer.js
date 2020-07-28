/**
 * @description 观察者
 */
class Observer {
  constructor(data) {
    this.data = data
    this.manager = new Manager()
    if (Array.isArray(data)) {
      // handle array data
    }

    // handle object/primitive data
    this.walk(data)
  }

  walk(data) {
    Object.keys(data).forEach(key => this.defineReactive(data, key, data[key]))
  }

  /**
   * 为data创建一个Observer观察者实例，或者返回当前Observer实例如已有
   * @param {Object} data 
   */
  observe(data) {
    if (!data || typeof data !== 'object') {
      return false
    } 
    return new Observer(data)
  }

  /**
   * 为data的每个属性都执行一遍defineReactive方法，如果当前属性为对象，则通过递归进行深度遍历
   * @param {Object} obj 操作的对象
   * @param {String} key 键
   * @param {*} val 值
   */
  defineReactive(obj, key, val) {
    // 利用闭包存储每个属性关联的watcher队列，当setter触发时依然能访问到
    let manager = new Manager()
    let childObj = this.observe(val)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get: function getter () {
        if (Manager.target) {
          manager.addSub(Manager.target)  // 添加订阅者watcher, 应该是整个实例Watcher
          if (childObj && childObj.manager.target) {
            childObj.manager.addSub(childObj.manager.target)
          }
        }
        return val
      },
      set: function setter (newVal) {
        if (newVal === val) { return false }
        val = newVal
        manager.notify() // 数据变化，通知dep里所有的watcher
      }
    })
  }
}
Manager.target = null