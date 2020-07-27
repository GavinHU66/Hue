class Manager {
  /**
   * @description constructor
   */
  constructor () {
    this.subs = [] // 是保存watcher的数组
  }
  /**
   * @description 添加一个订阅者watcher
   * @param {*} sub 订阅者watcher
   */
  addSub (sub) {
    this.subs.push(sub)
  }

  /**
   * @description 通知所有订阅者
   */
  notify () {
    this.subs.forEach(sub => sub.update())
  }
}