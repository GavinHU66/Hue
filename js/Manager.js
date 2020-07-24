class Manager {
  /**
   * @description constructor
   */
  constructor () {
    this.subs = [];
  }
  /**
   * @description 添加一个订阅者
   * @param {*} sub 订阅者
   */
  addSub (sub) {
    this.subs.push(sub);
  }

  /**
   * @description 通知所有订阅者
   */
  notify () {
    this.subs.forEach(sub => sub.update())
  }
}