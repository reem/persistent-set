var PSet = {};

(function () {

/**
 * The base constructor for a Persistent Set.
 */
var PSet = function () {};

/**
 * The Bin enum type of a Persistent Set.
 * @param {int}   size  the size of this branch
 * @param {value} a     the value at this node
 * @param {set a} left  the left branch of this set
 * @param {set a} right the right branch of this set
 */
PSet.Bin = function (size, a, left, right) {
  Pset.call(this);
  this.isBin = true;
  this.isTip = false;
  this.size = size;
  this.val = a;
  this.left = left;
  this.right = right; 
};

/**
 * The Tip constructor for a Persistent Set.
 * All instances of Tip point to the same object.
 */
PSet.Tip = (function () {
  Pset.call(this);
  this.isBin = false;
  this.isTip = true;
  return this;
}());

PSet.prototype.null = function () {
  return this.isTip;
};

PSet.prototype.size = function () {
  if (this.isBin) {
    return this.size;
  } else if (this.isTip) {
    return 0;
  }
};

PSet.prototype.contains = function (val) {
  if (this.isTip) {
    return false;
  } else {
    if (this.val === val) {
      return true;
    } else if (this.val > val) {
      return this.left.contains(val);
    } else if (this.val < val) {
      return this.right.contains(val);
    }
  }
};

PSet.prototype.notContains = Utility.not(PSet.prototype.contains);

PSet.prototype.findLessThan = function (val, best) {
  if (best) {
    if (this.isTip) {
      return best;
    } else if (this.isBin) {
      if (this.val >= val) {
        return this.left.findLessThan(val, best);
      } else {
        return this.right.findLessThan(val, this.val);
      }
    }
  } else {
    if (this.isTip) {
      return null;
    } else if (this.isBin) {
      if (this.val >= val) {
        return this.left.findLessThan(val);
      } else {
        return this.right.findLessThan(val, this.val);
      }
    }
  }
};

PSet.prototype.findGreaterThan = function (val, best) {
  if (best) {
    if (this.isTip) {
      return best;
    } else if (this.isBin) {
      if (this.val > val) {
        return this.left.findLessThan(val, this.val);
      } else {
        return this.right.findLessThan(val, best);
      }
    }
  } else {
    if (this.isTip) {
      return null;
    } else if (this.isBin) {
      if (this.val > val) {
        return this.left.findLessThan(val, this.val);
      } else {
        return this.right.findLessThan(val);
      }
    }
  }
};

PSet.prototype.findLessEqualThan = function (val, best) {
  if (best) {
    if (this.isTip) {
      return best;
    } else if (this.isBin) {
      if (this.val === val) {
        return this.val;
      } else if (val < this.val) {
        return this.left.findLessEqualThan(val, best);
      } else if (val > this.val) {
        return this.right.findLessEqualThan(val, this.val);
      }
    }
  } else {
    if (this.isTip) {
      return null;
    } else if (this.isBin) {
      if (this.val === val) {
        return this.val;
      } else if (val < this.val) {
        return this.left.findLessEqualThan(val);
      } else if (val > this.val) {
        return this.right.findLessEqualThan(val, this.val);
      }
    }
  }
};

PSet.prototype.findGreaterEqualThan = function (val, best) {
  if (best) {
    if (this.isTip) {
      return best;
    } else if (this.isBin) {
      if (this.val === val) {
        return this.val;
      } else if (val < this.val) {
        return this.left.findGreaterEqualThan(val, this.val);
      } else if (val > this.val) {
        return this.right.findGreaterEqualThan(val, best);
      }
    }
  } else {
    if (this.isTip) {
      return null;
    } else if (this.isBin) {
      if (this.val === val) {
        return this.val;
      } else if (val < this.val) {
        return this.left.findGreaterEqualThan(val, this.val);
      } else if (val > this.val) {
        return this.right.findGreaterEqualThan(val);
      }
    }
  }
};

PSet.Empty = function () { return PSet.Tip; };

PSet.Singleton = function (val) {
  return PSet.Bin(1, val, PSet.Tip, PSet.Tip);
};

exports.Empty = PSet.Empty;
exports.Singleton = PSet.Singleton;

PSet.prototype.insert = function (val) {
  if (this.isTip) {
    return PSet.Singleton(val);
  } else {
    if (val < this.val) {
      return balance(this.val, this.left.insert(val), this.right);
    } else if (val === this.val) {
      return PSet.Bin(this.size, val, this.left, this.right);
    } else if (val > this.val) {
      return balance(this.val, this.left, this.right.insert(val));
    }
  }
};

PSet.prototype.insertUnique = function (val) {
  if (this.isTip) {
    return PSet.Singleton(val);
  } else {
    if (val < this.val) {
      return balance(this.val, this.left.insertR(val), this.right);
    } else if (val === this.val) {
      return this;
    } else if (val > this.val) {
      return balance(this.val, this.left, this.right.insertR(val));
    }
  }
};

PSet.prototype.delete = function (val) {
  if (this.isTip) {
    return this;
  } else {
    if (val < this.val) {
      return balance(this.val, this.left.delete(val), this.right);
    } else if (val === this.val) {
      return glue(this.left, this.right);
    } else if (val > this.val) {
      return balance(this.val, this.left, this.right.delete(val));
    }
  }
};

}(PSet));
