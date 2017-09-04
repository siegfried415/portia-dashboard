import NodePool  from './NodePool';
import VisionBlock from './VisionBlock';


export default function Splitter () {

   if (arguments.length === 0 ) {
      this.init0();
   }

   if (arguments.length === 2 ) {
     if (arguments[0] instanceof VisionBlock) {
	this.init2_block_isVertical (arguments[0], arguments[1]);
     }

     if (arguments[0] instanceof HTMLElement) {
	this.init2_beginNode_isVertical (arguments[0], arguments[1]);
     }
   }

   if (arguments.length === 5) {
     this.init5_inleft_intop_inright_inbuttom_isVertical ( arguments[0], 
	     arguments[1], arguments[2], arguments[3], arguments[4]);
   }

}

Splitter.prototype.init0 = function (){
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.buttom = 0;
    this.width = 0;
    this.height = 0;
    this.weight = 0;
    this.vertical = false;
    this.leftUpBlock = null;
    this.rightButtomBlock = null;
    this.isExplicit = false;
    this.pool = null;
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.buttom = 0;
    this.vertical = true;
    this.leftUpBlock = new NodePool();
    this.rightButtomBlock = new NodePool();
    this.isExplicit = false;
};
Splitter.prototype.init2_block_isVertical = function (block, isVertical){
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.buttom = 0;
    this.width = 0;
    this.height = 0;
    this.weight = 0;
    this.vertical = false;
    this.leftUpBlock = null;
    this.rightButtomBlock = null;
    this.isExplicit = false;
    this.pool = null;
    this.left = block.blockLeft;
    this.right = block.blockRight;
    this.top = block.blockTop;
    this.buttom = block.blockButtom;
    this.width = this.right - this.left;
    this.height = this.buttom - this.top;
    this.vertical = isVertical;
    this.leftUpBlock = new NodePool();
    this.rightButtomBlock = new NodePool();
    this.isExplicit = false;
};


Splitter.prototype.init2_beginNode_isVertical = function (beginNode, isVertical){
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.buttom = 0;
    this.width = 0;
    this.height = 0;
    this.weight = 0;
    this.vertical = false;
    this.leftUpBlock = null;
    this.rightButtomBlock = null;
    this.isExplicit = false;
    this.pool = null;
    this.left = beginNode.offsetLeft;
    this.top = beginNode.offsetTop;
    this.right = beginNode.offsetRight;
    this.buttom = beginNode.offsetButtom;
    this.width = this.right - this.left;
    this.height = this.buttom - this.top;
    this.vertical = isVertical;
    this.leftUpBlock = new NodePool();
    this.rightButtomBlock = new NodePool();
    this.isExplicit = false;
};
Splitter.prototype.init5_inleft_intop_inright_inbuttom_isVertical = function (inleft, 
			                          intop, inright, inbuttom, isVertical){
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.buttom = 0;
    this.width = 0;
    this.height = 0;
    this.weight = 0;
    this.vertical = false;
    this.leftUpBlock = null;
    this.rightButtomBlock = null;
    this.isExplicit = false;
    this.pool = null;
    this.left = inleft;
    this.top = intop;
    this.right = inright;
    this.buttom = inbuttom;
    this.width = this.right - this.left;
    this.height = this.buttom - this.top;
    this.vertical = isVertical;
    this.leftUpBlock = new NodePool();
    this.rightButtomBlock = new NodePool();
    this.isExplicit = false;
};

Splitter.prototype.setSplitterPool = function (inPool){
    this.pool = inPool;
};

Splitter.prototype.blockIsInSplitter = function (node){
    if (node.offsetLeft >= this.left &&
	node.offsetTop >= this.top  &&
	node.offsetLeft + node.offsetWidth <= this.right  &&
	node.offsetTop + node.offsetHeight <= this.buttom) {
        return true;
    }
    else {
        return false;
    }
};
Splitter.prototype.splitterIsInBlock = function (node){
    if (this.left >= node.offsetLeft &&
	this.top >= node.offsetTop  &&
	this.right <= node.offsetLeft + node.offsetWidth  &&
	this.buttom <= node.offsetTop + node.offsetHeight) {
        return true;
    }
    else {
        return false;
    }
};
Splitter.prototype.blockIsAcrossSplitter = function (node){
    if (this.top > node.offsetTop &&
	this.top < node.offsetButtom && 
	this.buttom > node.offsetTop &&
	this.buttom < node.offsetButtom) {
        return true;
    }	
    if (this.left > node.offsetLeft &&
	this.left < node.offsetRight &&
	this.right > node.offsetLeft &&
	this.right < node.offsetRight) {
        return true;
    }
    return false;
};
Splitter.prototype.isBetween = function (num, begin, end){
    if (num >= begin && num <= end) {
        return true;
    }
    else {
        return false;
    }
};
Splitter.prototype.isInRect = function (x, y, left, top, right, buttom){
    if (this.isBetween(x, left, right) && 
	this.isBetween(y, top, buttom)) {
        return true;
    }
    else{
        return false;
    }
};
Splitter.prototype.isIntersectWithBlock = function (node){
    var nodeLeft = node.offsetLeft;
    var nodeTop = node.offsetTop;
    var nodeRight = node.offsetLeft + node.offsetWidth;
    var nodeButtom = node.offsetTop + node.offsetHeight;
    if (this.isInRect(nodeLeft, nodeTop, this.left, this.top, this.right, this.buttom) &&
	this.isInRect(nodeRight, nodeTop, this.left, this.top, this.right, this.buttom ) &&
	this.isBetween(this.buttom, nodeTop, nodeButtom)) {
        return 1;
    }
    if (this.isInRect(nodeLeft, nodeButtom, this.left, this.top, this.right, this.buttom) &&
	this.isInRect(nodeRight, nodeButtom, this.left, this.top, this.right, this.buttom) &&
	this.isBetween(this.top, nodeTop, nodeButtom)) {
        return 2;
    }

    if (this.isInRect(nodeLeft, nodeTop, this.left, this.top, this.right, this.buttom) &&
	this.isInRect(nodeLeft, nodeButtom, this.left, this.top, this.right, this.buttom) &&
	this.isBetween(this.right, nodeLeft, nodeRight)) {
        return 3;
    }

    if (this.isInRect(nodeRight, nodeTop, this.left, this.top, this.right, this.buttom) &&
	this.isInRect(nodeRight, nodeButtom, this.left, this.top, this.right, this.buttom) && 
	this.isBetween(this.left, nodeLeft, nodeRight)) {
        return 4;
    }

    return -1;
};

Splitter.prototype.adjust = function (inleft, intop, inright, inbuttom){
    this.left = inleft;
    this.top = intop;
    this.right = inright;
    this.buttom = inbuttom;
    this.width = this.right - this.left;
    this.height = this.buttom - this.top;
};
Splitter.prototype.getWeight = function (){
    return 10;
};
Splitter.prototype.minTop = function (upPool){
    if (upPool.getCount() === 0) {
        return -1;
    }
    if (upPool.getCount() === 1) {
        return (upPool.elementAt(0)).offsetTop;
    }
    var min = (upPool.elementAt(0)).offsetTop;
    for (var i = 1; i < upPool.getCount(); i++){
        if ((upPool.elementAt(i)).offsetTop <= min) {
            min = (upPool.elementAt(i)).offsetTop;
	}
    }
    return min;
};
Splitter.prototype.maxButtom = function (downPool){
    if (downPool.getCount() === 0) {
        return -1;
    }

    if (downPool.getCount() === 1) {
        return (downPool.elementAt(0)).offsetButtom;
    }

    var max = (downPool.elementAt(0)).offsetButtom;
    for (var i = 1; i < downPool.getCount(); i++){
        if ((downPool.elementAt(0)).offsetButtom >= max) {
            max = (downPool.elementAt(0)).offsetButtom;
	}
    }
    return max;
};
Splitter.prototype.minLeft = function (leftPool){
    if (leftPool.getCount() === 0) {
        return -1;
    }
    if (leftPool.getCount() === 1) {
        return (leftPool.elementAt(0)).offsetLeft;
    }
    var min = (leftPool.elementAt(0)).offsetLeft;
    for (var i = 1; i < leftPool.getCount(); i++){
        if ((leftPool.elementAt(i)).offsetLeft <= min) {
            min = (leftPool.elementAt(i)).offsetLeft;
	}
    }
    return min;
};
Splitter.prototype.maxRight = function (rightPool){
    if (rightPool.getCount() === 0) {
        return -1;
    }
    if (rightPool.getCount() === 1) {
        return (rightPool.elementAt(0)).offsetRight;
    }

    var max = (rightPool.elementAt(0)).offsetRight;
    for (var i = 1; i < rightPool.getCount(); i++){
        if ((rightPool.elementAt(0)).offsetRight >= max) {
            max = (rightPool.elementAt(0)).offsetRight;
	}
    }
    return max;
};
Splitter.prototype.isRealVerticalSp = function (splitterLimit){
    /* todo
    var leftPool = this.leftUpBlock;
    var rightPool = this.rightButtomBlock;
    var leftDistance = 0;
    var rightDistance = 0;
    if (!this.isExplicit && this.width < splitterLimit){
        var prevSp = (leftPool.nodeList.get_Item$$Int32(0)).spLeft;
        var nextSp = (rightPool.nodeList.get_Item$$Int32(0)).spRight;
        if (prevSp === null && nextSp != null){
            leftDistance = this.top - this.minLeft(leftPool);
            rightDistance = nextSp.left - this.right;
        }
        if (prevSp != null && nextSp != null){
            leftDistance = this.left - prevSp.right;
            rightDistance = nextSp.left - this.right;
        }
        if (prevSp != null && nextSp === null){
            leftDistance = this.left - prevSp.right;
            rightDistance = this.maxRight(rightPool) - this.right;
        }
        if (prevSp === null && nextSp === null){
            leftDistance = this.left - this.minLeft(leftPool);
            rightDistance = this.maxRight(rightPool) - this.right;
        }
        if (leftDistance >= 40 && rightDistance <= 40)
            return true;
        if (leftDistance <= 40 && rightDistance >= 40)
            return false;
    }
    */
    if (this.isExplicit || this.width >= splitterLimit) {
        return true;
    }

    return false;
};
Splitter.prototype.isRealHorizontalSp = function (splitterLimit){
    /* todo
    var upPool = this.leftUpBlock;
    var downPool = this.rightButtomBlock;
    var upDistance = 0;
    var downDistance = 0;
    if (!this.isExplicit && this.height < splitterLimit){
        var prevSp = (upPool.nodeList.get_Item$$Int32(0)).spUp;
        var nextSp = (downPool.nodeList.get_Item$$Int32(0)).spButtom;
        if (prevSp === null && nextSp != null){
            upDistance = this.top - this.minTop(upPool);
            downDistance = nextSp.top - this.buttom;
        }
        if (prevSp != null && nextSp != null){
            upDistance = this.top - prevSp.buttom;
            downDistance = nextSp.top - this.buttom;
        }
        if (prevSp != null && nextSp === null){
            upDistance = this.top - prevSp.buttom;
            downDistance = this.maxButtom(downPool) - this.buttom;
        }
        if (prevSp === null && nextSp === null){
            upDistance = this.top - this.minTop(upPool);
            downDistance = this.maxButtom(downPool) - this.buttom;
        }
        if (upDistance >= 40 && downDistance <= 40)
            return true;
        if (upDistance <= 40 && downDistance >= 40)
            return false;
    }
    */
    if (this.isExplicit || this.height >= splitterLimit) {
        return true;
    }
    return false;
};

