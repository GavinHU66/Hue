class MyMVVM {
  /**
   * @description MyMVVM实例的构造函数, 即模拟的Vue实例
   * @param {Object} options 
   */
  constructor(options) {
    this.el = options.el;
    this.data = options.data;
    this.methods = options.methods;
    this.setDataProxy()

    // 当视图存在时
    if (this.el) {
      // 将属性添加进Observer，劫持数据
      new Observer(this.data);
      new Compiler(this.el, this);
    }
  }

  /**
   * @description 用 this.xxx 代替 this.data.xxx 来访问数据
   */
  setDataProxy() {
    Object.keys(this.data).forEach(key => {
      // 给本MVVM实例添加属性key
      // 每次读/写该属性this[key]时，自动转为读/写 this.data[key] 的值
      Object.defineProperty(this, key, {
        enumerable: false,
        configurable: true,
        get: () => this.data[key],
        set: (val) => this.data[key] = val
      })
    })
  }
}