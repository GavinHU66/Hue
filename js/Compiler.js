class Compiler {

  /**
   * @description constructor
   * @param {String} el DOM 元素标识字符串 
   * @param {Object} vm 当前MVVM实例 
   */
  constructor(el, vm) {
    this.vm = vm;
    this.el = document.querySelector(el)
    var fragment = this.nodeToFragment(this.el)     // 使用fragment储存元素，这时候#app内就没有节点了，因为已经被frag删除完了
    this.compile(fragment)                          // 编译fragment
    this.el.appendChild(fragment)                   // 将fragment放回#app内
  }


  /**
   * @description 使用fragment储存元素
   * @param {Object} node 要转化为fragment片段的DOM树根节点
   */
  nodeToFragment(node) {
    var frag = document.createDocumentFragment()
    var child
    while (child = node.firstChild) { // fragment调用appendChild方法会删除node.firstChild节点
      frag.appendChild(child);
    }
    return frag
  }

  /**
   * @description 编译DOM节点、主要用于识别 {{}}, v-* 等一些指令
   * @param {Object} node DOM节点，一般为想要编译的DOM树的根节点
   */
  compile (node) {
    Array.from(node.childNodes).forEach(node => {

      // 解析本节点
      switch (node.nodeType) {
        case Node.ELEMENT_NODE: // 元素节点
          this.elementNodeCompiler(node)
          break
        case Node.TEXT_NODE: // 文字节点
          this.textNodeCompiler(node)
          break
      }

      // 解析本节点的子节点(如有)
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  /**
   * @description 元素节点编译器，处理属性v-model，v-text等
   * @param {Object} node 进行编译的DOM节点
   */
  elementNodeCompiler(node) {
    Array.from(node.attributes).forEach(attr => {

      var [attrName, attrVal] = [attr.name, attr.value]

      if (attrName.indexOf('v-') === 0) {

        // 取到'model/text/on:click', 即指令的类型
        var type = attrName.split('-')[1]    

        // v-[on:click] 等
        if (type.indexOf('on:') === 0) {
          var eventName = type.split(':')[1]
          this.handlers.on(node, this.vm, eventName, attrVal)
        }

        // v-[model], v-[text] 等
        if (this.handlers[type]) {
          this.handlers[type](node, this.vm, attrVal)
        }
      }
    })
  }

  /**
   * @description 文本节点编译器{{message}}, 跟v-text共用一个编译方法
   * @param {Object} node 进行编译的DOM节点
   */
  textNodeCompiler(node) {
    var reg = /\{\{(.+)\}\}/
    var text = node.textContent
    if (reg.test(text)) {
      this.handlers.text(node, this.vm, RegExp.$1);
    }
  }

  /**
   * @description 编译方法，为所编译的节点添加 Watcher
   */
  handlers = {
    model (node, vm, key) {
      // 初始化的时候取一次值填充，渲染页面数据
      node.value = vm[key]

      // 实例化watcher(调用watcher),将watcher添加到Manager中，同时定义好回调函数, 即数据变化后要干什么
      new Watcher(vm, key, newVal => node.textContent = newVal)

      // 监听input值的变化，从view到data
      node.addEventListener('input', event => vm[key] = event.target.value)
    },

    text (node, vm, key) {
      // 初始化的时候取一次值填充，渲染页面数据
      node.textContent = vm.data[key]
      // 实例化watcher(调用watcher),将watcher添加到Manager中，同时定义好回调函数, 即数据变化后要干什么
      new Watcher(vm, key, newVal => node.textContent = newVal)
    },

    on (node, vm, eventType, methodName) {
      if (vm.methods && vm.methods[methodName]) {
        node.addEventListener(eventType, vm.methods[methodName].bind(vm), false)
      }
    }
  }
}

