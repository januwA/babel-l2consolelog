## babel-l2consolelog

- [参考](https://itnext.io/introduction-to-custom-babel-plugins-98a62dad16ee)
- [video](https://www.youtube.com/watch?v=VBscbcm2Mok)

## 处理所有`program`
```js
module.exports = function(babel) {
  const { types: t } = babel;

  return {
    name: "ast-transform", // not required
    visitor: {
      Identifier(path) {
        path.node.name = path.node.name
          .split("")
          .reverse()
          .join("");
      },

      // or
      Identifier: {
        enter(path) {
        },
        exit() {
        }
      }
    }
  };
};
```

## 只处理函数
```js
module.exports = function(babel) {
  const { types: t } = babel;

  return {
    name: "ast-transform", // not required
    visitor: {
      FunctionDeclaration: {
        enter(path) {
          path.node.id.name = path.node.id.name
            .split("")
            .reverse()
            .join("");
        },
        exit(path) {
          // ...
        }
      }
    }
  };
};
```

## 将`l`重写为`console.log`

before: 
```js
const x = {
  l: l,
  [l]: l,
  a() {
    l(this.l);
    l(this[l]);
  }
};


function a(l) {
  l();
}


if(l = "x"){
  l()
}

for (const l of object) {
  for (const iterator of object) {
    l();
  }
  l();
}
```

after: 
```js
"use strict";

const x = {
  l: console.log,
  [console.log]: console.log,

  a() {
    console.log(this.l);
    console.log(this[console.log]);
  }

};

function a(l) {
  l();
}

if (console.log = "x") {
  console.log();
}

for (const l of object) {
  for (const iterator of object) {
    l();
  }

  l();
}
```