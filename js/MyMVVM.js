class MyMVVM {
  /**
   * @description MyMVVM实例的构造函数, 即模拟的Vue实例
   * @param {Object} options 
   */
  constructor(options) {
    // 赋值
    this.el = options.el;
    this.data = options.data;
    this.methods = options.methods;

    // 设置proxy，方便数据读写
    // 从vm.data[key]简化为vm[key]
    this.setDataProxy()

    // 当视图存在时
    if (this.el) {
      // 以遍历data所有属性及子属性的方式解析vm.data
      // 1. 为每一个数据设置 getter/setter，和一个Manager实例
      // 2. 在get时添加Watcher订阅者（如有）
      // 3. 在set时通知所有Watcher
      new Observer(this.data);

      // 以遍历所有节点的方式解析当前DOM
      // 1. 将所有依赖于data的相关的DOM节点实例化为一个Watcher订阅者
      // 2. 为节点注册用户事件，使之可以触发 vm.methods 里面的函数
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