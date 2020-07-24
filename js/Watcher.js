class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;           // data中的key值
    this.cb = cb;
    Manager.target = this;   // 缓存自己,就是这个Watcher实例
    this.value = this.vm[this.key];  // 触发执行Observer中的get函数
    Manager.target = null;   // 释放自己
  }
  update() {
    // 值更新后，Observer的setter就会触发，就会执行dep.notify()，即通过Dep容器通知watcher根据callback去更新视图
    let newValue = this.vm[this.key];
    let oldValue = this.value;
    if (newValue !== oldValue) { // 新老值不一致，执行回调
      this.cb(newValue);
    }
  }
}