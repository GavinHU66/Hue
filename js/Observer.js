class Observer {
  constructor(data) {
    this.observer(data);
  }
  observer(data) {
    if (!data || typeof data !== 'object') {
      return false;
    } 
    Object.keys(data).forEach(key => this.defineReactive(data, key, data[key]))
  }

  defineReactive(obj, key, value) {
    let manager = new Manager();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get () {
        if (Manager.target) {
          manager.addSub(Manager.target);    // 添加订阅者watcher,应该是整个实例Watcher
        }
        return value;
      },
      set (newValue) {
        if (newValue === value) { return false; }
        value = newValue;
        manager.notify(); // 数据变化，通知dep里所有的watcher
      }
    })
  }
}
Manager.target = null;