/**
 * @description 订阅者
 */
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;           // data中的key值
    this.cb = cb;
    Manager.target = this;   // 缓存自己,就是这个Watcher实例
    this.val = this.vm[this.key];  // 触发执行Observer中的get函数
    Manager.target = null;   // 释放自己
  }
  /**
   * @description 更新模板
   */
  update() {
    // 值更新后，Observer的setter就会触发，就会执行dep.notify()，即通过Dep容器通知watcher根据callback去更新视图
    // 调用this.get来获取修改之后的value值
    let newVal = this.vm[this.key]
    let oldVal = this.val
    if (newVal !== oldVal) { // 新老值不一致，执行回调
      this.cb(newVal)
    }
  }
}