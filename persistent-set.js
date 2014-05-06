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

}(PSet));
