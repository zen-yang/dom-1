// window.dom = {
//   create(tagName) {
//     return document.createElement(tagName)
//   }
// }
window.dom = {
  create(string) {
    // div 下不能放 ul 标签，改用 template
    const container = document.createElement("template")
    // 防止左右空格 firstChild 获取的是文本
    container.innerHTML = string.trim()
    return container.content.firstChild
  },
  // 把 node2 插入到 node 的下一个兄弟节点前面
  after(node, node2) {
    node.parentNode.insertBefore(node2, node.nextSibling)
  },
  before(node, node2){
    node.parentNode.insertBefore(node2, node)
  },
  append(parent, node){
    parent.appendChild(node)
  },
  wrap(node, parent){
    dom.before(node, parent)
    // 如果你插入到别的地方，就会从原来地方离开
    // div1 div2 变成 div1 div3 div2
    dom.append(parent, node)
  },
  remove(node){
    node.parentNode.removeChild(node)
    return node
  },
  empty(node){
    // node.innerHTML = ''
    // const childeNodes = node.childNodes 等价于下面
    // const {childNodes} = node
    const array = []
    // for(let i = 0; i < childNodes.length; i++){
    //   // remove 后 childNodes 的 length 会不断变化
    //   console.log(childNodes.length)
    //   dom.remove(childNodes[i])
    //   array.push(childNodes[i])
    // }
    let x = node.firstChild
    while(x){
      // 会有文本节点移除
      array.push(dom.remove(node.firstChild))
      // 移除第一个后，x 重新指向
      x = node.firstChild
    }
    return array
  },
  attr(node, name, value){ // 重载
    if(arguments.length === 3){
      node.setAttribute(name, value)
    }else if(arguments.length === 2){
      return node.getAttribute(name)
    }
  },
  text(node, string){ // 适配
    if(arguments.length ===2){
      if('innerText' in node){
        node.innerText = string // ie
      }else{
        node.textContent = string // firefox chrome
      }
    }else if(arguments.length ===1){
      if('innerText' in node){
        return node.innerText
      }else{
        return node.textContent
      }
    }
  },
  html(node, string){
    if(arguments.length === 2){
      node.innerHTML = string
    }else if(arguments.length === 1){
      return node.innerHTML
    }
  },
  style(node, name, value){
    if(arguments.length === 3){
      // dom.style(div, 'color', 'red')
      node.style[name] = value
    }else if(arguments.length === 2){
      if(typeof name === 'string'){
        // dom.style(div, 'color')
        return node.style[name]
      }else if(name instanceof Object){
        // dom.style(div, {color: 'red'})
        const object = name
        for(let key in object){
          // key: border / color
          // node.style.border = ...
          // node.style.color = ...
          node.style[key] = object[key]
        }
      }
    }
  },
  class: {
    add(node, className){
      node.classList.add(className)
    },
    remove(node, className){
      node.classList.remove(className)
    },
    has(node, className){
      return node.classList.contains(className)
    }
  },
  on(node, eventName, fn){
    node.addEventListener(eventName, fn)
  },
  off(node, eventName, fn){
    node.removeEventListener(eventName, fn)
  },
  find(selector, scope){
    // 如果有 scope 就 scope.qu... 如果没有scope 就 document.qu...
    return (scope || document).querySelectorAll(selector)
  },
  parent(node){
    return node.parentNode
  },
  children(node){
    return node.children
  },
  siblings(node){
    return Array.from(node.parentNode.children)
    .filter(n => n!==node)
  },
  next(node){
    let x = node.next
    // 3 是文本
    while(x && x.nodeType === 3){
      x = x.nextSibling
    }
    return x
  },
  previous(node){
    let x = node.previousSibling
    // 3 是文本
    while(x && x.nodeType === 3){
      x = x.previousSibling
    }
    return x
  },
  each(nodeList, fn){
    for(let i = 0; i < nodeList.length; i++){
      fn.call(null, nodeList[i])
    }
  },
  index(node){
    const list = dom.children(node.parentNode)
    let i
    for(i = 0; i < list.length; i++){
      if(list[i] === node){
        break
      }
    }
    return i
  }

  
}
