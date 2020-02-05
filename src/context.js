class Context {
  _context = /* (true|false)[] */ [];

  get current() {
    return this._context.length - 1;
  }

  get hasL() {
    return this._context.some(e => !!e);
  }

  enter(hasL) {
    this._context.push(hasL || this.hasL);
  }

  exit() {
    this._context.splice(this.current);
  }

  update(v) {
    this._context[this.current] = v;
  }

  defaultContextHandle = {
    enter: () => {
      this.enter();
    },
    exit: () => {
      this.exit();
    }
  };

  funcParamsHandle = {
    enter: path => {
      this.enter();
      const params = path.node.params;
      if (params && params.length) {
        for (const p of params) {
          if (p.name === "l") {
            this.update(true);
          }
        }
      }
    },
    exit: () => {
      this.exit();
    }
  };
}

module.exports = new Context();
