

import VIPSArrayList from './VIPSArrayList';
import VisionBlock from './VisionBlock';
import NodePool from './NodePool';
import Splitter from './Splitter';
import CHTMLNode from './CHTMLNode';
import HeapSort from './HeapSort';


export default function SplitterPool(something ){

  if(something instanceof CHTMLNode ) {
    let node = something;
    this.removeList = null;
    this.newAddList = null;
    this.verticalSplitterList = null;
    this.horizontalSplitterList = null;
    this.validSplitterDirection = 0;
    this.marginalTop = 0;
    this.marginalButtom = 0;
    this.marginalLeft = 0;
    this.marginalRight = 0;
    this.verticalSplitterList = new VIPSArrayList();
    this.horizontalSplitterList = new VIPSArrayList();
    this.removeList = new VIPSArrayList();
    this.newAddList = new VIPSArrayList();
    let spVertical = new Splitter(node, true);
    let spHorizontal = new Splitter(node, false);
    spVertical.setSplitterPool(this);
    spHorizontal.setSplitterPool(this);
    this.verticalSplitterList.Add(spVertical);
    this.horizontalSplitterList.Add(spHorizontal);
    this.validSplitterDirection = -1;
    this.marginalTop = node.offsetTop;
    this.marginalButtom = node.offsetButtom;
    this.marginalLeft = node.offsetLeft;
    this.marginalRight = node.offsetRight;
  }

  if (something instanceof VisionBlock) {
    let block = something;
    this.removeList = null;
    this.newAddList = null;
    this.verticalSplitterList = null;
    this.horizontalSplitterList = null;
    this.validSplitterDirection = 0;
    this.marginalTop = 0;
    this.marginalButtom = 0;
    this.marginalLeft = 0;
    this.marginalRight = 0;
    this.verticalSplitterList = new VIPSArrayList();
    this.horizontalSplitterList = new VIPSArrayList();
    this.removeList = new VIPSArrayList();
    this.newAddList = new VIPSArrayList();
    let spVertical = new Splitter(block, true);
    let spHorizontal = new Splitter(block, false);
    spVertical.setSplitterPool(this);
    spHorizontal.setSplitterPool(this);
    this.verticalSplitterList.Add(spVertical);
    this.horizontalSplitterList.Add(spHorizontal);
    this.validSplitterDirection = -1;
    this.marginalTop = block.blockTop;
    this.marginalButtom = block.blockButtom;
    this.marginalLeft = block.blockLeft;
    this.marginalRight = block.blockRight;
  }

  if (something instanceof NodePool) {
    let pool = something;
    this.removeList = null;
    this.newAddList = null;
    this.verticalSplitterList = null;
    this.horizontalSplitterList = null;
    this.validSplitterDirection = 0;
    this.marginalTop = 0;
    this.marginalButtom = 0;
    this.marginalLeft = 0;
    this.marginalRight = 0;
    this.verticalSplitterList = new VIPSArrayList();
    this.horizontalSplitterList = new VIPSArrayList();
    this.removeList = new VIPSArrayList();
    this.newAddList = new VIPSArrayList();
    this.marginalTop = pool.elementAt(0).offsetTop;
    this.marginalLeft = pool.elementAt(0).offsetLeft;
    this.marginalRight = pool.elementAt(0).offsetRight;
    this.marginalButtom = pool.elementAt(0).offsetButtom;
    for (let i = 1; i < pool.getCount(); i++){
        if (pool.elementAt(i).offsetTop <= this.marginalTop){
            this.marginalTop = pool.elementAt(i).offsetTop;
	}
        if (pool.elementAt(i).offsetButtom >= this.marginalButtom){
            this.marginalButtom = pool.elementAt(i).offsetButtom;
	}
        if (pool.elementAt(i).offsetLeft <= this.marginalLeft){
            this.marginalLeft = pool.elementAt(i).offsetLeft;
	}
        if (pool.elementAt(i).offsetRight >= this.marginalRight){
            this.marginalRight = pool.elementAt(i).offsetRight;
	}
    }
    let spVertical = new Splitter(this.marginalLeft, this.marginalTop, 
		                  this.marginalRight, this.marginalButtom, true);
    let spHorizontal = new Splitter(this.marginalLeft, this.marginalTop, 
		                    this.marginalRight, this.marginalButtom, false);
    spVertical.setSplitterPool(this);
    spHorizontal.setSplitterPool(this);
    this.verticalSplitterList.Add(spVertical);
    this.horizontalSplitterList.Add(spHorizontal);
  }

}


SplitterPool.prototype.getVerticalSplitter = function (){
    return this.verticalSplitterList;
};
SplitterPool.prototype.getHorizontalSplitter = function (){
    return this.horizontalSplitterList;
};
SplitterPool.prototype.addToPool = function (sp){
    if (sp.vertical === true) {
        this.verticalSplitterList.Add(sp);
    }
    else {
        this.horizontalSplitterList.Add(sp);
    }
};
SplitterPool.prototype.setRemoveFlag = function (sp){
    this.removeList.Add(sp);
};
SplitterPool.prototype.setNewAddFlag = function (sp){
    this.newAddList.Add(sp);
};
SplitterPool.prototype.removeSplitter = function (sp){
    if (sp.vertical === true) {
        this.verticalSplitterList.Remove(sp);
    }	
    else {
        this.horizontalSplitterList.Remove(sp); 
    }
};
SplitterPool.prototype.removeNeighbourSplitter = function (node, sp){
    if (node.spLeft === sp){
        node.spLeft = null;
        return true;
    }
    else if (node.spRight === sp){
        node.spRight = null;
        return true;
    }
    else if (node.spUp === sp){
        node.spUp = null;
        return true;
    }
    else if (node.spButtom === sp){
        node.spButtom = null;
        return true;
    }
    else {
        return false;
    }
};
SplitterPool.prototype.removeSpFromNeighbour = function (pool, sp){
    for (var i = 0; i < pool.getCount(); i++){
        this.removeNeighbourSplitter(pool.elementAt(i), sp);
    }
};
SplitterPool.prototype.nodeIsExisit = function (pool, node){
    for (var i = 0; i < pool.getCount(); i++){
        if (pool.elementAt(i) === node) {
            return true;
	}
        continue;
    }
    return false;
};
SplitterPool.prototype.getHorizontalSplitterAround = function (node){
    this.sortHorizontalSplitter("top");
    var minDistance = node.offsetTop - (this.horizontalSplitterList.get_Item$$Int32(0)).buttom;
    var i;
    for (i = 1; i < this.horizontalSplitterList.get_Count(); i++){
        let sp = this.horizontalSplitterList.get_Item$$Int32(i);
        if (minDistance > node.offsetTop - sp.buttom && node.offsetTop - sp.buttom >= 0) {
            minDistance = node.offsetTop - sp.buttom;
	}
        else {
            break;
	}
    }

    let hSplitterTemp1 = this.horizontalSplitterList.get_Item$$Int32(i - 1); 

    node.setNeighbourSplitter(hSplitterTemp1, 0);
    hSplitterTemp1.rightButtomBlock.addToPool(node);
    if ( ( i - 2 ) >= 0 ){
        let hSplitterTemp2 = this.horizontalSplitterList.get_Item$$Int32(i - 2); 
        for (let j = 0; j< hSplitterTemp2.rightButtomBlock.getCount(); j++ ){

            let nodeTemp = hSplitterTemp2.rightButtomBlock.elementAt(j);
            if (!this.nodeIsExisit( hSplitterTemp1.leftUpBlock, nodeTemp)) {
                hSplitterTemp1.leftUpBlock.addToPool(nodeTemp);
	    }
            nodeTemp.setNeighbourSplitter( hSplitterTemp1, 1);
        }
    }

    if (i < this.horizontalSplitterList.get_Count()) {

    let hSplitterTemp3 = this.horizontalSplitterList.get_Item$$Int32(i); 

    node.setNeighbourSplitter(hSplitterTemp3, 1);
    hSplitterTemp3.leftUpBlock.addToPool(node);
    if (i <= ( this.horizontalSplitterList.get_Count() - 2 ) ){
        let hSplitterTemp4 = this.horizontalSplitterList.get_Item$$Int32(i + 1); 
        for (let j = 0; j < hSplitterTemp4.leftUpBlock.getCount(); j++){
            let nodeTemp = hSplitterTemp4.leftUpBlock.elementAt(j);
            if (!this.nodeIsExisit(hSplitterTemp3.rightButtomBlock, nodeTemp)) {
                hSplitterTemp3.rightButtomBlock.addToPool(nodeTemp);
	    }
            nodeTemp.setNeighbourSplitter(hSplitterTemp3, 0);
        }
    }
    }
};

SplitterPool.prototype.getVerticalSplitterAround = function (node){
    this.sortVerticalSplitter("left");
    var minDistance = node.offsetLeft - (this.verticalSplitterList.get_Item$$Int32(0)).right;
    var i;
    for (i = 1; i < this.verticalSplitterList.get_Count(); i++){
        let sp = this.verticalSplitterList.get_Item$$Int32(i);
        if (minDistance > node.offsetLeft - sp.right && node.offsetLeft - sp.right >= 0) {
            minDistance = node.offsetLeft - sp.right;
	}    
        else {
            break;
	}    
    }

    let vSplitterTemp1 = this.verticalSplitterList.get_Item$$Int32(i - 1);

    node.setNeighbourSplitter(vSplitterTemp1, 2);
    vSplitterTemp1.rightButtomBlock.addToPool(node);
    if ( ( i - 2 ) >= 0){
        let vSplitterTemp2 = this.verticalSplitterList.get_Item$$Int32(i - 2);
        for (let j = 0; j < vSplitterTemp2.rightButtomBlock.getCount(); j++){
            let nodeTemp = vSplitterTemp2.rightButtomBlock.elementAt(j);
            if (!this.nodeIsExisit(vSplitterTemp1.leftUpBlock, nodeTemp)) {
                vSplitterTemp1.leftUpBlock.addToPool(nodeTemp);
	    }
            nodeTemp.setNeighbourSplitter(vSplitterTemp1, 2);
        }
    }

    if (i < this.verticalSplitterList.get_Count() ) {

    let vSplitterTemp3 = this.verticalSplitterList.get_Item$$Int32(i);

    node.setNeighbourSplitter(vSplitterTemp3, 3);
    vSplitterTemp3.leftUpBlock.addToPool(node);
    if (i <= ( this.verticalSplitterList.get_Count() - 2 ) ){
        let vSplitterTemp4 = this.verticalSplitterList.get_Item$$Int32(i + 1);
        for (let j = 0; j < vSplitterTemp4.leftUpBlock.getCount(); j++){
            let nodeTemp = vSplitterTemp4.leftUpBlock.elementAt(j);
            if (!this.nodeIsExisit(vSplitterTemp3.rightButtomBlock, nodeTemp)) {
                vSplitterTemp3.rightButtomBlock.addToPool(nodeTemp);
	    }
            nodeTemp.setNeighbourSplitter(vSplitterTemp3, 3);
        }
    }
    }
};

SplitterPool.prototype.detectHorizontalWithTree = function (tree, 
				inTop, inButtom, inLeft, inRight ){
    
    if (tree.cnode1 === undefined || tree.cnode2 === undefined ) {
        this.detectHorizontal(tree.canonical);
        return true;
    }

    // if blank erea between children is splitter
    if (tree.canonical.offsetLeft === inLeft && 
        tree.canonical.offsetRight === inRight && 
        (tree.cnode2.canonical.offsetTop>tree.cnode1.canonical.offsetButtom || 
	 tree.cnode1.canonical.offsetTop>tree.cnode2.canonical.offsetButtom)) {

	 // check if children node can produce splitter 
	 let hasSplitterInCNode1 = this.detectHorizontalWithTree(tree.cnode1, 
			                            inTop, inButtom, inLeft, inRight) ;
         let hasSplitterInCNode2 = this.detectHorizontalWithTree(tree.cnode2,
			                            inTop, inButtom, inLeft, inRight) ;

	 if (hasSplitterInCNode1 === false && hasSplitterInCNode2 === false ) {
             this.detectHorizontal(tree.canonical);
	 }

	 return true;

    }

    return false;

};

SplitterPool.prototype.detectHorizontal = function (node){
    for (var i = 0; i < this.horizontalSplitterList.get_Count(); i++){
        var sp = this.horizontalSplitterList.get_Item$$Int32(i);
        if (sp.blockIsAcrossSplitter(node)){
            this.setRemoveFlag(sp);
            this.removeSpFromNeighbour(node.nodePool, sp);
            continue;
        }
        if (sp.blockIsInSplitter(node)){
            var spUp = new Splitter();
            var spDown = new Splitter();
            spUp.left = sp.left;
            spUp.top = sp.top;
            spUp.right = sp.right;
            spUp.buttom = node.offsetTop;
            spUp.width = spUp.right - spUp.left;
            spUp.height = spUp.buttom - spUp.top;
            spUp.vertical = false;
            spUp.setSplitterPool(this);
            this.setNewAddFlag(spUp);
            spDown.left = sp.left;
            spDown.top = node.offsetTop + node.offsetHeight;
            spDown.right = sp.right;
            spDown.buttom = sp.buttom;
            spDown.width = spDown.right - spDown.left;
            spDown.height = spDown.buttom - spDown.top;
            spDown.vertical = false;
            spDown.setSplitterPool(this);
            this.setNewAddFlag(spDown);
            this.setRemoveFlag(sp);
            continue;
        }
        var result = sp.isIntersectWithBlock(node);
        if (result === 1){
            sp.adjust(sp.left, sp.top, sp.right, node.offsetTop);
        }
        else if (result === 2){
            sp.adjust(sp.left, node.offsetTop + node.offsetHeight, sp.right, sp.buttom);
        }
    }

    for (let i = 0; i < this.removeList.get_Count(); i++) {
        this.removeSplitter( this.removeList.get_Item$$Int32(i));
    }
    this.removeList.removeAll();

    for (let i = 0; i < this.newAddList.get_Count(); i++) {
        this.addToPool( this.newAddList.get_Item$$Int32(i));
    }	
    this.newAddList.removeAll();

    /* remove this to detectHorizontalSplitter 
    this.getHorizontalSplitterAround(node);
    */
};

SplitterPool.prototype.detectVerticalWithTree = function (tree, 
				inTop, inButtom, inLeft, inRight ){
    
    if (tree.cnode1 === undefined || tree.cnode2 === undefined ) {
        this.detectVertical(tree.canonical);
        return true;
    }

    // if blank erea between children is splitter
    if (tree.canonical.offsetTop === inTop && 
        tree.canonical.offsetButtom === inButtom && 
        (tree.cnode2.canonical.offsetLeft > tree.cnode1.canonical.offsetRight || 
	 tree.cnode1.canonical.offsetLeft > tree.cnode2.canonical.offsetRight )){

	 // check if children node can produce splitter 
	 let hasSplitterInCNode1 = this.detectVerticalWithTree(tree.cnode1, 
						 inTop, inButtom, inLeft, inRight) ;
         let hasSplitterInCNode2 = this.detectVerticalWithTree(tree.cnode2,
						 inTop, inButtom, inLeft, inRight) ;

	 if ( hasSplitterInCNode1 === false && hasSplitterInCNode2 === false ) {
             this.detectVertical(tree.canonical);
	 }

	 return true;
    }

    return false;

};

SplitterPool.prototype.detectVertical = function (node){
    for (var i = 0; i < this.verticalSplitterList.get_Count(); i++){
        var sp = this.verticalSplitterList.get_Item$$Int32(i);
        if (sp.vertical === true){
            if (sp.blockIsAcrossSplitter(node)){
                this.setRemoveFlag(sp);
                this.removeSpFromNeighbour(node.nodePool, sp);
                continue;
            }
            if (sp.blockIsInSplitter(node)){
                var spLeft = new Splitter();
                var spRight = new Splitter();
                spLeft.left = sp.left;
                spLeft.top = sp.top;
                spLeft.right = node.offsetLeft;
                spLeft.buttom = sp.buttom;
                spLeft.width = spLeft.right - spLeft.left;
                spLeft.height = spLeft.buttom - spLeft.top;
                spLeft.vertical = true;
                spLeft.setSplitterPool(this);
                this.setNewAddFlag(spLeft);
                spRight.left = node.offsetLeft + node.offsetWidth;
                spRight.top = sp.top;
                spRight.right = sp.right;
                spRight.buttom = sp.buttom;
                spRight.width = spRight.right - spRight.left;
                spRight.height = spRight.buttom - spRight.top;
                spRight.vertical = true;
                spRight.setSplitterPool(this);
                this.setNewAddFlag(spRight);
                this.setRemoveFlag(sp);
                continue;
            }
            var result = sp.isIntersectWithBlock(node);
            if (result === 3){
                sp.adjust(sp.left, sp.top, node.offsetLeft, sp.buttom);
            }
            else if (result === 4){
                sp.adjust(node.offsetLeft + node.offsetWidth, sp.top, sp.right, sp.buttom);
            }
        }
    }

    for (let i = 0; i < this.removeList.get_Count(); i++) {
        this.removeSplitter( this.removeList.get_Item$$Int32(i));
    }
    this.removeList.removeAll();

    for (let i = 0; i < this.newAddList.get_Count(); i++) {
        this.addToPool( this.newAddList.get_Item$$Int32(i));
    }
    this.newAddList.removeAll();

    /* move this to  detectVerticalSplitter 
    this.getVerticalSplitterAround(node);
    */
};

SplitterPool.prototype.spIsNodeSp = function (sp, spNodeList){
    if (spNodeList !== null){
        for (var i = 0; i < spNodeList.get_Count(); i++){
            var cnode = spNodeList.get_Item$$Int32(i);
            if (cnode.offsetTop >= sp.top && cnode.offsetLeft >= sp.left && 
	        cnode.offsetRight <= sp.right && cnode.offsetButtom <= sp.buttom) {
                return true;
	    }
        }
    }
    return false;
};

SplitterPool.prototype.detectHorizontalSplitterWithTree = function (elPool, tree,  spNodeList, 
							inTop, inButtom, inLeft, inRight){

    for (let i=0; i<tree.length; i++) {
        let hasSplitter = this.detectHorizontalWithTree(tree[i], inTop, inButtom, inLeft, inRight );
	if ( hasSplitter === false ) {
	    this.detectHorizontal(tree[i].canonical);
        }
    }

    for (let i = 0; i< elPool.nodeList.get_Count(); i++ ) {
        let node = elPool.nodeList.get_Item$$Int32(i);
        if (node.tagName !== "#text") {
            this.getHorizontalSplitterAround(node);
	}
        continue;
    }

    this.removeMarginalSplitter(0);
    for (let i = 0; i < this.horizontalSplitterList.get_Count(); i++){
        let sp = this.horizontalSplitterList.get_Item$$Int32(i);
        if (this.spIsNodeSp(sp, spNodeList)) {
            sp.isExplicit = true;
	}
    }
    return this.getHorizontalSplitterCount();
};

SplitterPool.prototype.detectHorizontalSplitter = function (elPool, spNodeList){
    for (let i = 0; i< elPool.nodeList.get_Count(); i++ ) {
        let node = elPool.nodeList.get_Item$$Int32(i);
        if (node.tagName !== "#text") {
            this.detectHorizontal(node);
	}
        continue;
    }

    for (let i = 0; i< elPool.nodeList.get_Count(); i++ ) {
        let node = elPool.nodeList.get_Item$$Int32(i);
        if (node.tagName !== "#text") {
            this.getHorizontalSplitterAround(node);
	}
        continue;
    }

    this.removeMarginalSplitter(0);
    for (let i = 0; i < this.horizontalSplitterList.get_Count(); i++){
        let sp = this.horizontalSplitterList.get_Item$$Int32(i);
        if (this.spIsNodeSp(sp, spNodeList)) {
            sp.isExplicit = true;
	}
    }
    return this.getHorizontalSplitterCount();
};

SplitterPool.prototype.detectVerticalSplitterWithTree = function (elPool,tree,  spNodeList, 
		                           inTop, inButtom, inLeft, inRight ){
    for (let i=0; i<tree.length; i++) {
        let hasSplitter = this.detectVerticalWithTree(tree[i], inTop, inButtom, inLeft, inRight );
	if ( hasSplitter === false ) {
	    this.detectVertical(tree[i].canonical);
        }
    }

    for (let i = 0; i < elPool.nodeList.get_Count(); i++){
        let node = elPool.nodeList.get_Item$$Int32(i);
        if (node.tagName !== "#text") {
            this.getVerticalSplitterAround(node);
	}
        continue;
    }

    this.removeMarginalSplitter(1);
    for (let i = 0; i < this.verticalSplitterList.get_Count(); i++){
        let sp = this.verticalSplitterList.get_Item$$Int32(i);
        if (this.spIsNodeSp(sp, spNodeList)) {
            sp.isExplicit = true;
	}
    }
    return this.getVerticalSplitterCount();
};

SplitterPool.prototype.detectVerticalSplitter = function (elPool, spNodeList){

    for (let i = 0; i < elPool.nodeList.get_Count(); i++){
        let node = elPool.nodeList.get_Item$$Int32(i);
        if (node.tagName !== "#text") {
            this.detectVertical(node);
	}
        continue;
    }

    for (let i = 0; i < elPool.nodeList.get_Count(); i++){
        let node = elPool.nodeList.get_Item$$Int32(i);
        if (node.tagName !== "#text") {
            this.getVerticalSplitterAround(node);
	}
        continue;
    }

    this.removeMarginalSplitter(1);
    for (let i = 0; i < this.verticalSplitterList.get_Count(); i++){
        let sp = this.verticalSplitterList.get_Item$$Int32(i);
        if (this.spIsNodeSp(sp, spNodeList)) {
            sp.isExplicit = true;
	}
    }
    return this.getVerticalSplitterCount();
};

SplitterPool.prototype.detectAllSplitterForWithTree = function (elPool, tree, spNodeList, 
								inTop, inButtom, inLeft, inRight ){

    var horizontalCount = this.detectHorizontalSplitterWithTree(elPool, tree,  spNodeList, 
		    						inTop, inButtom, inLeft, inRight );

    var verticalCount = this.detectVerticalSplitterWithTree(elPool, tree,  spNodeList,
		    						inTop, inButtom, inLeft, inRight );

    if (horizontalCount === 0 && verticalCount === 0) {
        return -1;
    }
    else if (horizontalCount === 0 && verticalCount !== 0) {
        return 1;
    }
    else if (horizontalCount !== 0 && verticalCount === 0) {
        return 0;
    }
    else if (horizontalCount !== 0 && verticalCount !== 0){
        return 1;
    }
    return 0;
};

SplitterPool.prototype.detectAllSplitterFor = function (elPool, spNodeList){
    var horizontalCount = this.detectHorizontalSplitter(elPool, spNodeList);
    var verticalCount = this.detectVerticalSplitter(elPool, spNodeList);
    if (horizontalCount === 0 && verticalCount === 0) {
        return -1;
    }
    else if (horizontalCount === 0 && verticalCount !== 0) {
        return 1;
    }
    else if (horizontalCount !== 0 && verticalCount === 0) {
        return 0;
    }
    else if (horizontalCount !== 0 && verticalCount !== 0){
        return 1;
    }
    return 0;
};
SplitterPool.prototype.removeMarginalSplitter = function (direction){
    //var removeEnumer = null;
    if (direction === 1){
        for (let i = 0; i < this.verticalSplitterList.get_Count(); i++){
            let sp = this.verticalSplitterList.get_Item$$Int32(i);

            if (sp.left === this.marginalLeft){
                this.setRemoveFlag(sp);
                this.removeSpFromNeighbour(sp.leftUpBlock, sp);
            }
            if (sp.right === this.marginalRight){
                this.setRemoveFlag(sp);
                this.removeSpFromNeighbour(sp.rightButtomBlock, sp);
            }
        }


    }
    else {
        for (let i = 0; i < this.horizontalSplitterList.get_Count(); i++){
            let sp = this.horizontalSplitterList.get_Item$$Int32(i);
            if (sp.top === this.marginalTop){
                this.setRemoveFlag(sp);
                this.removeSpFromNeighbour(sp.rightButtomBlock, sp);
            }
            if (sp.buttom === this.marginalButtom){
                this.setRemoveFlag(sp);
                this.removeSpFromNeighbour(sp.leftUpBlock, sp);
            }
        }
    }

    for (let i = 0; i < this.removeList.get_Count(); i++) {
        this.removeSplitter ( this.removeList.get_Item$$Int32(i));
    }
    this.removeList.removeAll();
};
SplitterPool.prototype.getSplitterCount = function (){
    return this.verticalSplitterList.get_Count() + this.horizontalSplitterList.get_Count();
};
SplitterPool.prototype.getVerticalSplitterCount = function (){
    return this.verticalSplitterList.get_Count();
};
SplitterPool.prototype.getHorizontalSplitterCount = function (){
    return this.horizontalSplitterList.get_Count();
};
SplitterPool.prototype.sortVerticalSplitter = function (fieldName){
    var hSort = new HeapSort();
    hSort.doSort(this.verticalSplitterList, fieldName);
};
SplitterPool.prototype.sortHorizontalSplitter = function (fieldName){
    var hSort = new HeapSort();
    hSort.doSort(this.horizontalSplitterList, fieldName);
};
SplitterPool.prototype.verticalSplitterAt = function (index){
    return this.verticalSplitterList.get_Item$$Int32(index);
};
SplitterPool.prototype.horizontalSplitterAt = function (index){
    return this.horizontalSplitterList.get_Item$$Int32(index);
};

