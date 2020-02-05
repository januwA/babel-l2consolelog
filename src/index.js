const context = require("./context");
const from = "l";
const to = "console.log";

module.exports = function l2consolelog(babel) {
  // const { types: t } = babel;

  return {
    name: "l2consolelog", // not required
    visitor: {
      Identifier(path) {
        if (path.node.name === from && !context.hasL) {
          const parentType = path.parentPath.type;
          const parentNode = path.parentPath.node;
          /**
           * {
           *  l: l,   -> l: console.log,
           *  [l]: l, -> [console.log]: console.log,
           * }
           */
          if (
            parentType === "ObjectProperty" &&
            path.node === parentNode.key &&
            !parentNode.computed
          ) {
            return;
          }

          /**
           * l(this.l);  -> console.log(this.l);
           * l(this[l]); -> console.log(this[console.log]);
           */
          if (parentType === "MemberExpression" && !parentNode.computed) {
            return;
          }
          path.node.name = to;
        }
      },

      /**
       * 仅作为函数调用时转换
       * @param {*} path
       */
      // CallExpression(path) {
      //   if (path.node.callee.name === "l" && !context.hasL) {
      //     path.node.callee.name = "console.log";
      //   }
      // },

      /**
       * 创建变量的时候
       */
      VariableDeclarator: {
        enter(path) {
          if (path.node.id.name === from) {
            if (context.current >= 0) {
              // 在新的上下文创建了 l
              context.update(true);
            } else {
              // 在顶级context创建了 l
              context.enter(true);
            }
          }
        }
      },

      // 检查for-of context
      ForOfStatement: context.defaultContextHandle,

      // 检查for context
      ForStatement: context.defaultContextHandle,

      // 检查for-in context
      ForInStatement: context.defaultContextHandle,

      // 检查if context
      IfStatement: context.defaultContextHandle,

      // 检查while context
      WhileStatement: context.defaultContextHandle,

      // 检查block块
      BlockStatement: context.defaultContextHandle,

      // 检查函数的参数是否带有 l
      FunctionDeclaration: context.funcParamsHandle,
      ObjectMethod: context.funcParamsHandle
    }
  };
};
