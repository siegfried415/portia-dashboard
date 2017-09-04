
import VIPSArrayList from './VIPSArrayList';
import HeapSort from './HeapSort';
import NodePool from './NodePool';
import SplitterPool from './SplitterPool';
import CHTMLNode from './CHTMLNode';

export default function VisionBlock(){
    this.blockLeft = 0;
    this.blockTop = 0;
    this.blockRight = 0;
    this.blockButtom = 0;
    this.blockWidth = 0;
    this.blockHeight = 0;
    this.upSplitter = null;
    this.downSplitter = null;
    this.leftSplitter = null;
    this.rightSplitter = null;
    this.leftVisionBlock = null;
    this.topVisionBlock = null;
    this.rightVisionBlock = null;
    this.buttomVisionBlock = null;
    this.containedVisionBlockList = null;
    this.containedHTMLNodeList = null;
    this.nodeSplitterList = null;
    this.DOC = 0;
    this.blockName = null;
    this.blockType = 0;
    this.parentBlock = null;
    this.blockDirection = 0;
    this.divideDirection = 0;
    this.isTextBlock = 0;
    this.childNums = 0;
    this.blockLeft = 0;
    this.blockRight = 0;
    this.blockTop = 0;
    this.blockButtom = 0;
    this.blockHeight = 0;
    this.blockWidth = 0;
    this.leftVisionBlock = new VIPSArrayList();
    this.topVisionBlock = new VIPSArrayList();
    this.rightVisionBlock = new VIPSArrayList();
    this.buttomVisionBlock = new VIPSArrayList();
    this.containedVisionBlockList = new VIPSArrayList();
    this.containedHTMLNodeList = new VIPSArrayList();
    this.nodeSplitterList = new VIPSArrayList();
    this.upSplitter = null;
    this.downSplitter = null;
    this.leftSplitter = null;
    this.rightSplitter = null;
    this.parentBlock = null;
    this.DOC = 0;
    this.blockDirection = 0;
    this.isTextBlock = 0;
    this.childNums = 0;
}


VisionBlock.prototype.getBgColor = function () {
    var node = this.containedHTMLNodeList.get_Item$$Int32(0);
    return node.getBgColor();
};

VisionBlock.prototype.getBlockType = function() {
    return this.blockType; 
};

VisionBlock.prototype.getContainedVisionBlockList = function (){
    return this.containedVisionBlockList;
};

VisionBlock.prototype.getContainedHTMLNodeList = function (){
    return this.containedHTMLNodeList;
};
VisionBlock.prototype.getLeftVisionBlock = function (){
    return this.leftVisionBlock;
};
VisionBlock.prototype.getRightVisionBlock = function (){
    return this.rightVisionBlock;
};
VisionBlock.prototype.getTopVisionBlock = function (){
    return this.topVisionBlock;
};
VisionBlock.prototype.getButtomVisionBlock = function (){
    return this.buttomVisionBlock;
};
VisionBlock.prototype.addContainedVisionBlock = function (block){
    this.containedVisionBlockList.Add(block);
    block.parentBlock = this;
};
VisionBlock.prototype.addContainedHTMLNode = function (node){
    this.containedHTMLNodeList.Add(node);
};
VisionBlock.prototype.getBlockByIndex = function (index){
    return this.containedVisionBlockList.get_Item$$Int32(index);
};
VisionBlock.prototype.getHTMLNodeByIndex = function (index){
    return this.containedHTMLNodeList.get_Item$$Int32(index);
};


VisionBlock.prototype.indexInList = function (){
    if (this.parentBlock != null){
        var i = 0;
        for (var j = 0; j < this.parentBlock.getContainedVisionBlockList().get_Count(); j++){
            if ( this.parentBlock.getContainedVisionBlockList().get_Item$$Int32(j) === this){
                break;
	    }
            else {
                i++;
	    }
        }
        return i;
    }
    return 0;
};
VisionBlock.prototype.getNextSibingBlock = function (){
    var parentBlock = null;
    if (this.parentBlock != null){
        parentBlock = this.parentBlock;
    }
    if (parentBlock != null){
        if (this.indexInList() === parentBlock.getContainedVisionBlockList().get_Count() - 1){
            return null;
	}
        return parentBlock.getContainedVisionBlockList().get_Item$$Int32(this.indexInList() + 1);
    }
    return null;
};
VisionBlock.prototype.getBlockName = function (){
    if (this.parentBlock === null){
        this.blockName = "VB1";
    }	
    else {
        this.blockName = this.parentBlock.getBlockName() + "_" +
		                            (this.indexInList() + 1).toString();
    }
    return this.blockName;
};
VisionBlock.prototype.removeBlock = function (block){
    this.containedVisionBlockList.Remove(block);
};
VisionBlock.prototype.removeHTMLNode = function (node){
    this.containedHTMLNodeList.Remove(node);
};
VisionBlock.prototype.hasSubBlocks = function (){
    if (this.containedVisionBlockList.get_Count() === 0){
        return false;
    }
    else {
        return true;
    }
};


VisionBlock.prototype.convertFromNode = function (node){
    this.blockLeft = node.offsetLeft;
    this.blockTop = node.offsetTop;
    this.blockRight = node.offsetLeft + node.offsetWidth;
    this.blockButtom = node.offsetTop + node.offsetHeight;
};

VisionBlock.prototype.isNodeInBlock = function (node){
    for (var i = 0; i < this.containedHTMLNodeList.get_Count(); i++){
        if ( node === this.containedHTMLNodeList.get_Item$$Int32(i)  ) {
            return true;
	}
    }
    return false;
};

VisionBlock.prototype.max = function (first, second){
    if (first >= second) {
        return first;
    }
    else {
        return second;
    }
};
VisionBlock.prototype.min = function (first, second){
    if (first < second) {
        return first;
    }
    else {
        return second;
    }
};

VisionBlock.prototype.nodeIsInBlock = function (pool){
    var node = pool.elementAt(0);
    for (var i = 0; i < this.containedHTMLNodeList.get_Count(); i++){
        if ( node === this.containedHTMLNodeList.get_Item$$Int32(i)  ) {
            return true;
	}
    }
    return false;
};

VisionBlock.prototype.nodeIsInVisionBlock = function (pool){
    if (pool.getCount() === 0 ) {
        return null;
    }

    for (var i = 0; i < this.containedVisionBlockList.getCount(); i++){
        if ((this.containedVisionBlockList.getElementAt(i)).nodeIsInBlock(pool)) {
            return this.containedVisionBlockList.getElementAt(i)  ;
	}
        else {
            continue;
	}
    }
    return null;
};

VisionBlock.prototype.mergeBlockBetweenHorizontalSp = function (sp, splitterLimit){

    var merged = 0; 

    var removeList = new VIPSArrayList();
    var upPool = sp.leftUpBlock;
    var downPool = sp.rightButtomBlock;
    var upBlock = this.nodeIsInVisionBlock(upPool);
    var downBlock = this.nodeIsInVisionBlock(downPool);
    if (upBlock === null && downBlock !== null){

        if (sp.isRealHorizontalSp(splitterLimit)){
            let newBlock = new VisionBlock();
            newBlock.blockDirection = 0;
            newBlock.parentBlock = this;
            for (let j = 0; j < upPool.getCount(); j++){
                newBlock.containedHTMLNodeList.Add(upPool.elementAt(j));
	    }
            newBlock.downSplitter = sp;
            downBlock.upSplitter = sp;
            this.containedVisionBlockList.Add(newBlock);
        }
        else {
            for (let j = 0; j < upPool.getCount(); j++) {
                downBlock.containedHTMLNodeList.Add(upPool.elementAt(j));
	    }

	    if (upPool.getCount() > 0 ) {
                downBlock.upSplitter = upPool.elementAt(0).spUp;
	    }
        }
    }
    if (upBlock !== null && downBlock === null){

        if (sp.isRealHorizontalSp(splitterLimit)){
            let newBlock = new VisionBlock();
            newBlock.blockDirection = 0;
            newBlock.parentBlock = this;
            for (let j = 0; j < downPool.getCount(); j++) {
                newBlock.containedHTMLNodeList.Add(downPool.elementAt(j));
	    }
            newBlock.upSplitter = sp;
            upBlock.downSplitter = sp;
            this.containedVisionBlockList.Add(newBlock);
        }
        else {
            for (let j = 0; j < downPool.getCount(); j++) {
                upBlock.containedHTMLNodeList.Add(downPool.elementAt(j));
	    }

	    if (downPool.getCount() > 0 ) {
                upBlock.downSplitter = downPool.elementAt(0).spButtom;
	    }
        }
    }
    if (upBlock === null && downBlock === null){

        if (sp.isRealHorizontalSp(splitterLimit)){
            let upNewBlock = new VisionBlock();
            let downNewBlock = new VisionBlock();
            upNewBlock.blockDirection = 0;
            downNewBlock.blockDirection = 0;
            upNewBlock.parentBlock = this;
            downNewBlock.parentBlock = this;
            for (let j = 0; j < upPool.getCount(); j++) {
                upNewBlock.containedHTMLNodeList.Add(upPool.elementAt(j));
	    }
            for (let j = 0; j < downPool.getCount(); j++) {
                downNewBlock.containedHTMLNodeList.Add(downPool.elementAt(j));
	    }
            upNewBlock.downSplitter = sp;
            downNewBlock.upSplitter = sp;
            this.containedVisionBlockList.Add(upNewBlock);
            this.containedVisionBlockList.Add(downNewBlock);
        }
        else {
            let newBlock = new VisionBlock();
            newBlock.blockDirection = 0;
            newBlock.parentBlock = this;
            for (let j = 0; j < upPool.getCount(); j++) {
                newBlock.containedHTMLNodeList.Add(upPool.elementAt(j));
	    }
            for (let j = 0; j < downPool.getCount(); j++) {
                newBlock.containedHTMLNodeList.Add(downPool.elementAt(j));
	    }

	    if (upPool.getCount() > 0) {
                newBlock.upSplitter = upPool.elementAt(0).spUp;
	    }

	    if (downPool.getCount() > 0 ) {
                newBlock.downSplitter = downPool.elementAt(0).spButtom;
	    }

            this.containedVisionBlockList.Add(newBlock);
        }
    }
    if (upBlock != null && downBlock != null){

        if (sp.isRealHorizontalSp(splitterLimit)){
            upBlock.downSplitter = sp;
            downBlock.upSplitter = sp;
        }
        else {
            for (let j = 0; j < downBlock.getContainedHTMLNodeList().getCount(); j++) {
                upBlock.containedHTMLNodeList.Add(
					downBlock.getContainedHTMLNodeList().getElementAt(j)
				);
	    }
            upBlock.downSplitter = downBlock.downSplitter;
            removeList.Add(downBlock);

            merged = 1;

        }
    }


    for (let i = 0; i < removeList.get_Count(); i++) {
        this.containedVisionBlockList.Remove( removeList.get_Item$$Int32(i));
    }
    removeList.removeAll();

    return merged;
};

VisionBlock.prototype.mergeBlockBetweenVerticalSp = function (sp, splitterLimit){

    var removeList = new VIPSArrayList();
    var leftPool = sp.leftUpBlock;
    var rightPool = sp.rightButtomBlock;
    var leftBlock = this.nodeIsInVisionBlock(leftPool);
    var rightBlock = this.nodeIsInVisionBlock(rightPool);
    if (leftBlock === null && rightBlock != null){
        if (sp.isRealVerticalSp(splitterLimit)){
            let newBlock = new VisionBlock();
            newBlock.blockDirection = 1;
            newBlock.parentBlock = this;
            for (let j = 0; j < leftPool.getCount(); j++) {
                newBlock.containedHTMLNodeList.Add(leftPool.elementAt(j));
	    }
            newBlock.rightSplitter = sp;
            rightBlock.leftSplitter = sp;
            this.containedVisionBlockList.Add(newBlock);
        }
        else {
            for (let j = 0; j < leftPool.getCount(); j++) {
                rightBlock.containedHTMLNodeList.Add(leftPool.elementAt(j));
            }
            rightBlock.leftSplitter = leftPool.elementAt(0).spLeft;
        }
    }
    if (leftBlock != null && rightBlock === null){
        if (sp.isRealVerticalSp(splitterLimit)){
            let newBlock = new VisionBlock();
            newBlock.blockDirection = 1;
            newBlock.parentBlock = this;
            for (let j = 0; j < rightPool.getCount(); j++) {
                newBlock.containedHTMLNodeList.Add(rightPool.elementAt(j));
	    }
            newBlock.leftSplitter = sp;
            leftBlock.rightSplitter = sp;
            this.containedVisionBlockList.Add(newBlock);
        }
        else {
            for (let j = 0; j < rightPool.getCount(); j++) {
                leftBlock.containedHTMLNodeList.Add(rightPool.elementAt(j));
	    }
            leftBlock.rightSplitter = rightPool.elementAt(0).spRight;
        }
    }
    if (leftBlock === null && rightBlock === null){
        if (sp.isRealVerticalSp(splitterLimit)){
            let leftNewBlock = new VisionBlock();
            let rightNewBlock = new VisionBlock();
            leftNewBlock.blockDirection = 1;
            rightNewBlock.blockDirection = 1;
            leftNewBlock.parentBlock = this;
            rightNewBlock.parentBlock = this;
            for (let j = 0; j < leftPool.getCount(); j++) {
                leftNewBlock.containedHTMLNodeList.Add(leftPool.elementAt(j));
	    }
            for (let j = 0; j < rightPool.getCount(); j++) {
                rightNewBlock.containedHTMLNodeList.Add(rightPool.elementAt(j));
	    }
            leftNewBlock.rightSplitter = sp;
            rightNewBlock.leftSplitter = sp;
            this.containedVisionBlockList.Add(leftNewBlock);
            this.containedVisionBlockList.Add(rightNewBlock);
        }
        else {
            let newBlock = new VisionBlock();
            newBlock.blockDirection = 1;
            newBlock.parentBlock = this;
            for (let j = 0; j < leftPool.getCount(); j++) {
                newBlock.containedHTMLNodeList.Add(leftPool.elementAt(j));
	    }
            for (let j = 0; j < rightPool.getCount(); j++) {
                newBlock.containedHTMLNodeList.Add(rightPool.elementAt(j));
	    }
            newBlock.leftSplitter = leftPool.elementAt(0).spUp;
            newBlock.rightSplitter = rightPool.elementAt(0).spButtom;

            this.containedVisionBlockList.Add(newBlock);
        }
    }
    if (leftBlock != null && rightBlock != null){
        if (sp.width >= splitterLimit){
            leftBlock.rightSplitter = sp;
            rightBlock.leftSplitter = sp;
        }
        else {
            for (let j = 0; j < rightBlock.getContainedHTMLNodeList().getCount(); j++) {
                leftBlock.containedHTMLNodeList.Add(
					rightBlock.getContainedHTMLNodeList().getElementAt(j)
				);
	    }
            leftBlock.rightSplitter = rightBlock.rightSplitter;
            removeList.Add(rightBlock);
        }
    }

    for (let i = 0; i < removeList.get_Count(); i++) {
        this.containedVisionBlockList.Remove( removeList.get_Item$$Int32(i));
    }
    removeList.removeAll();
};


/* 
VisionBlock.prototype.getNodePoolFromTree = function(tree) {
    var result = new NodePool(); 
    if(tree.left) {
        let leftPool = this.getNodePoolFromTree(tree.left); 
	for (let i = 0; i < leftPool.nodeList.get_Count(); i++){
	    let tmp = leftPool.nodeList.get_Item$$Int32(i) ;
	    result.addToPool(tmp);
	}
    }

    if(tree.right) {
        let rightPool = this.getNodePoolFromTree(tree.right); 
	for (let i = 0; i < rightPool.nodeList.get_Count(); i++){
	    let tmp = rightPool.nodeList.get_Item$$Int32(i) ;
	    result.addToPool(tmp);
	}
    }

    if(tree.canonical) {
        result.addToPool(tree.canonical) ;
    }

    return result ;
};


VisionBlock.prototype.constructVisionBlockWithTree = function ( tree ){

    if (tree !== null && 
	    tree.left !== null && tree.right !== null) {
        let upNewBlock = new VisionBlock();
        let downNewBlock = new VisionBlock();
        //upNewBlock.blockDirection = 0;
        //downNewBlock.blockDirection = 0;
        upNewBlock.parentBlock = this;
        downNewBlock.parentBlock = this;

        let upPool = this.getNodePoolFromTree(tree.left);
        for (let j = 0; j < upPool.getCount(); j++) {
            upNewBlock.containedHTMLNodeList.Add(upPool.elementAt(j));
        }

    
        let downPool = this.getNodePoolFromTree(tree.right);
        for (let j = 0; j < downPool.getCount(); j++) {
	    downNewBlock.containedHTMLNodeList.Add(downPool.elementAt(j));
        }

        //upNewBlock.downSplitter = sp;
        //downNewBlock.upSplitter = sp;
        this.containedVisionBlockList.Add(upNewBlock);
        this.containedVisionBlockList.Add(downNewBlock);	    
    }
};
*/


VisionBlock.prototype.constructVisionBlock = function (nPool, spPool, direction, splitterLimit){
    let spl = splitterLimit;
    spl = spl;


    console.log("constructVisionBlock, begin...");

    if (direction === 0){

        spPool.sortHorizontalSplitter("height");
        let lastSplitter  = spPool.horizontalSplitterAt(spPool.getHorizontalSplitterCount() -1 );
        let lastHeight = lastSplitter.height ;
   
        let i = 0;
        for (; i < spPool.getHorizontalSplitterCount() - 1 ; i++){
            let sp = spPool.horizontalSplitterAt(i);
            this.mergeBlockBetweenHorizontalSp(sp, lastHeight);
        }

        if (i < spPool.getHorizontalSplitterCount()){
            let lastSp = spPool.horizontalSplitterAt(i);
            if (this.containedVisionBlockList.get_Count() <= 2) {
                lastHeight = lastSp.height;
	    }
            this.mergeBlockBetweenHorizontalSp(lastSp, lastHeight);
        }
    }
    if (direction === 1){

        spPool.sortVerticalSplitter("width");
        let lastSplitter = spPool.verticalSplitterAt( spPool.getVerticalSplitterCount() -1 );
        let lastWidth  = lastSplitter.width ;

        let i = 0; 
        for (; i < spPool.getVerticalSplitterCount()-1 ; i++){
            let sp = spPool.verticalSplitterAt(i);
            this.mergeBlockBetweenVerticalSp(sp, lastWidth );
        }
 
        if (i < spPool.getVerticalSplitterCount()){
            let lastSp = spPool.verticalSplitterAt(i);
            if (this.containedVisionBlockList.get_Count() <= 2) {
                lastWidth = lastSp.width;
	    }
            this.mergeBlockBetweenVerticalSp(lastSp, lastWidth);
        }
    }
    for (let i = 0; i < this.containedVisionBlockList.get_Count(); i++){
        this.setDOC(this.containedVisionBlockList.get_Item$$Int32(i)  );
        this.calculateAreaOfBlock(this.containedVisionBlockList.get_Item$$Int32(i));
    }
    if (direction === 0){
        let hSort = new HeapSort();
        hSort.doSort(this.containedVisionBlockList, "blockTop");
    }
    if (direction === 1){
        let hSort = new HeapSort();
        hSort.doSort(this.containedVisionBlockList, "blockLeft");
    }
    for (let i = 0; i < nPool.getCount(); i++){
        let node = nPool.elementAt(i);
        if (node.tagName === "#text"){
            let textBlock = new VisionBlock(node.innerHTML);
            textBlock.parentBlock = this;
            this.containedVisionBlockList.Add(textBlock);
        }
    }

    console.log("constructVisionBlock, finished...");
};

VisionBlock.prototype.setDOC = function (block){
    block.DOC = block.parentBlock.DOC + 1;
    if (block.containedHTMLNodeList.get_Count() === 1){
        if ((block.containedHTMLNodeList.get_Item$$Int32(0)).isVirtualTextNode()) {
            block.DOC = 15;
	}
        else {
            block.DOC = block.DOC + 1;
	}
    }
    if (block.DOC >= 15) {
        return;
    }
};

VisionBlock.prototype.calculateAreaOfBlock = function (block){

    if (block.containedHTMLNodeList.getCount() > 0) {	
        block.blockLeft = (block.containedHTMLNodeList.get_Item$$Int32(0)).offsetLeft;
        block.blockTop = (block.containedHTMLNodeList.get_Item$$Int32(0)).offsetTop;
        for (let i = 0; i < block.containedHTMLNodeList.get_Count(); i++){
            var cnode = block.containedHTMLNodeList.get_Item$$Int32(i);
            if (cnode.offsetButtom > block.blockButtom) {
                block.blockButtom = cnode.offsetButtom;
	    }
            if (cnode.offsetRight > block.blockRight) {
                block.blockRight = cnode.offsetRight;
	    }
            if (cnode.offsetTop < block.blockTop) {
                block.blockTop = cnode.offsetTop;
	    }
            if (cnode.offsetLeft < block.blockLeft) {
                block.blockLeft = cnode.offsetLeft;
	    }
        }
        block.blockWidth = block.blockRight - block.blockLeft;
        block.blockHeight = block.blockButtom - block.blockTop;
    }
};

VisionBlock.prototype.getBlockDivideDirection = function (){
    if (this.hasSubBlocks()){
        var childBlock = this.getContainedVisionBlockList().get_Item$$Int32(0);
        return childBlock.blockDirection;
    }
    return -1;
};

VisionBlock.prototype.isInVerticalTop = function ( block ) {
    if ( ((this.blockTop + this.blockButtom) / 2 ) < 
           (((block.blockTop + block.blockButtom )/2)-
	        ((this.blockButtom - this.blockTop) / 2 ))){
        return true;
    }
    return false;
};

VisionBlock.prototype.isInVerticalCenter = function ( block ) {
    if ( ((this.blockTop + this.blockButtom) / 2 ) >= 
	    (((block.blockTop + block.blockButtom ) / 2 ) - 
	      ((this.blockButtom - this.blockTop) /2)) &&
         ((this.blockTop + this.blockButtom ) / 2 ) <= 
	    ((( block.blockTop + block.blockButtom )/2) + 
	      ((this.blockButtom - this.blockTop )/2))){ 
        return true;
    }
    return false;
};

VisionBlock.prototype.isInHorizontalCenter = function ( block ) {
    if ( ((this.blockLeft + this.blockRight) / 2 ) >= 
	    (((block.blockLeft + block.blockRight ) / 2 ) - 
	        ((this.blockRight - this.blockLeft) / 2 )) && 
         ((this.blockLeft + this.blockRight ) / 2 ) <= 
	    (( ( block.blockLeft + block.blockRight ) / 2 ) + 
	       ((this.blockRight - this.blockLeft ) / 2 )) ) { 
        return true;
    }
    return false;
};

VisionBlock.prototype.getLinkDensity = function() {
    return this.linkDensity;
};

VisionBlock.prototype.hasLink = function () {
    var regex = new RegExp( [ '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}',
	  '([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?' ].join(''));

    for( let i=0; i< this.containedHTMLNodeList.get_Count() ; i++ ){
        var node = this.containedHTMLNodeList.get_Item$$Int32(i).htmlElement;

        var links  = node.getElementsByTagName("a");
        for(let j=0, jl=links.length; j<jl;j++) {
            var linkHref = links[j].href.replace(/#.*$/, '').replace(/\/$/, '');
  
            if(regex.test( linkHref )){
               return true;
            }
        }
    }
    return false;
};

VisionBlock.prototype.setLinkDensity = function () {

    var textLength = 0;
    var linkLength = 0;
    this.linkDensity = 1.0 ;

    for( let i=0; i< this.containedHTMLNodeList.get_Count() ; i++ ){
        var node = this.containedHTMLNodeList.get_Item$$Int32(i).htmlElement;
        textLength += node.textContent.replace(/\s{2,}/g, " " ).length; 

        var links      = node.getElementsByTagName("a");
        for(let j=0, jl=links.length; j<jl;j++) {
	    linkLength += links[j].textContent.replace(/\s{2,}/g, " ").length;
        }
    }

    if (textLength > 0 ) {
        this.linkDensity = linkLength / textLength;
    }

    return this.linkDensity;

};

VisionBlock.prototype.setContentScore = function() {
    var textLength = 0;
    this.contentScore = 1.0;

    for( let i=0; i< this.containedHTMLNodeList.get_Count() ; i++ ){
        var innerText = this.containedHTMLNodeList.get_Item$$Int32(i).innerText ;
        textLength += innerText.replace(/\s{2,}/g, " ").length;        

        /* Add points for any commas within this paragraph */
        this.contentScore += innerText.split(/,|，|。|、/).length;
    }

    /* For every 100 characters in this paragraph, add another point. Up to 3 points. */
    this.contentScore += Math.min(Math.floor( textLength / 100), 3);
 
    if (textLength === 0 ) {
        this.contentScore = 0.0;
        return 0.0;
    }

    this.setLinkDensity();
    this.contentScore *= 1 - this.getLinkDensity() ; 

    return this.contentScore ;
};


VisionBlock.prototype.getContentScore = function () {
    return this.contentScore;
};

VisionBlock.prototype.getProportion = function(rootBlock ) {
	if ((rootBlock.blockRight - rootBlock.blockLeft) > 0 &&
	     (rootBlock.blockButtom - rootBlock.blockTop) > 0 ) {
		var __left = Math.max(this.blockLeft, rootBlock.blockLeft ) ;
			var __right = Math.min(this.blockRight, rootBlock.blockRight ) ;
		var __top = Math.max(this.blockTop,  rootBlock.blockTop);
		var __buttom  = Math.min(this.blockButtom, rootBlock.blockButtom );
		return ( (__right - __left) * ( __buttom - __top ) ) /
			 ( (rootBlock.blockRight - rootBlock.blockLeft ) *
			 ( rootBlock.blockButtom - rootBlock.blockTop ) ) ;
	}
	return 0;
};

VisionBlock.prototype.getMainVisionBlock = function (rootBlock, pThreshold ) {
	var best_proportion = 0;
	var best_child = null;
	for (let i = 0; i < this.containedVisionBlockList.get_Count(); i++ ) {
		var child = this.containedVisionBlockList.get_Item$$Int32(i);
		var child_proportion = child.getProportion(rootBlock);
		if (child_proportion  > best_proportion ) {
			best_proportion = child_proportion ;
			best_child = child;
		}	
	}	

	if(best_child === null || best_proportion < pThreshold) {
		return this;
	}

	return best_child.getMainVisionBlock(rootBlock, pThreshold) ;
};


VisionBlock.prototype.hasChildBlock = function ( block ) {
    while (block) {
	if (this === block ) {
	    return 1;
	}
	block = block.parentBlock;
    }
    return 0;
};

VisionBlock.prototype._dist = function(node1y, node1x, node2y, node2x ) {
    var total = 0;
    total += Math.pow(node2y - node1y, 2);
    total += Math.pow(node2x - node1x, 2);
    return Math.sqrt(total);  
};    


VisionBlock.prototype.distance = function(node1, node2) {

    var d = Infinity ; 
    if (node1.offsetTop >= node2.offsetButtom ) {
        if (node1.offsetLeft > node2.offsetRight ) {
	    //topLeft of node1 and buttomRight of node2 
	    //d = 400 +  this._dist (node1.offsetTop, node1.offsetLeft, 
	    //		    node2.offsetButtom, node2.offsetRight);
	    d = Infinity; 
	} else if (node1.offsetRight <  node2.offsetLeft) {
            //topRight of node1 and buttomLeft of node2 	
	    //d = 400 +  this._dist (node1.offsetTop, node1.offsetRight, 
		//	    node2.offsetButtom, node2.offsetLeft);
	    d = Infinity; 
	} else if (node1.offsetLeft === node2.offsetLeft && 
		   node1.offsetRight === node2.offsetRight ) {
            d = node1.offsetTop - node2.offsetButtom; 	
	} else {
            //d =  200 +  node1.offsetTop - node2.offsetButtom; 	
	    d = Infinity; 
	}
    } else if (node1.offsetButtom <= node2.offsetTop ) {
        if (node1.offsetLeft > node2.offsetRight ) {
	    //buttomLeft of node1 and topRight of node2 
	    //d = 400 + this._dist (node1.offsetButtom, node1.offsetLeft, 
		//	    node2.offsetTop, node2.offsetRight);
	    d = Infinity; 
	} else if (node1.offsetRight <  node2.offsetLeft) {
            //buttomRight of node1 and topLeft of node2 	
	    //d = 400 + this._dist (node1.offsetButtom, node1.offsetRight, 
		//	    node2.offsetTop, node2.offsetLeft);
	    d = Infinity; 
	} else if (node1.offsetLeft === node2.offsetLeft && 
		   node1.offsetRight === node2.offsetRight ) {
            d = node2.offsetTop - node1.offsetButtom ; 	
	} else {
            //d =  200 +  node1.offsetTop - node2.offsetButtom; 	
	    d = Infinity; 
	}
    
    }else if (node1.offsetTop === node2.offsetTop && 
	      node1.offsetButtom === node2.offsetButtom) {
    
        if (node1.offsetLeft > node2.offsetRight ) {
	    d = node1.offsetLeft - node2.offsetRight ;
    
        } else if (node1.offsetRight < node2.offsetLeft) {
            d = node2.offsetLeft - node1.offsetRight; 
        } else  {
            d = 0 ; 
        }
    
    } 
    
    else if (node1.offsetLeft > node2.offsetRight ) {
	//d = 200 + node1.offsetLeft - node2.offsetRight ;
	d = Infinity; 
    } else if (node1.offsetRight < node2.offsetLeft) {
        //d = 200 + node2.offsetLeft - node1.offsetRight; 
	d = Infinity; 
    } else  {
        //d = 400 ; 
	d = Infinity; 
    }

    return d;
};

VisionBlock.prototype.mergeClosest = function(clusters, dists, mins, index) {

    if (clusters.length <= 1 ) {
      return false;
    }

    // find two closest clusters from cached mins
    var minKey = 0, min = Infinity;
    for(let i = 0; i < clusters.length; i++) {
      let key = clusters[i].key,
          dist = dists[key][mins[key]];
      if(dist < min) {
        minKey = key;
        min = dist;
      }
    }

    if ( min === Infinity ) {
	return false;
    }

    var c1 = index[minKey],
        c2 = index[mins[minKey]];
    

    //create new node
    var c1Node  = c1.canonical;
    var c2Node = c2.canonical; 
    var newNode = new CHTMLNode(
                   Math.min(c1Node.offsetTop, c2Node.offsetTop), 
		   Math.max(c1Node.offsetButtom, c2Node.offsetButtom),
		   Math.min(c1Node.offsetLeft, c2Node.offsetLeft),
		   Math.max(c1Node.offsetRight, c2Node.offsetRight) 
		);

    newNode.nodePool = c1Node.nodePool;


    // merge two closest clusters
    var merged = { canonical: newNode, 
                   cnode1: c1,
                   cnode2: c2,
                   key: c1.key,
                   size: c1.size + c2.size
                 };

    clusters[c1.index] = merged;
    clusters.splice(c2.index, 1);
    index[c1.key] = merged;


    // update distances with new merged cluster
    for(let i = 0; i < clusters.length; i++) {
      let ci = clusters[i];
      let dist;
      if(c1.key === ci.key) {
        dist = Infinity;
      }

      else {
	dist = this.distance(c1.canonical, ci.canonical);
      }

      dists[c1.key][ci.key] = dists[ci.key][c1.key] = dist;
    }

    
    // update cached mins
    for(let i = 0; i < clusters.length; i++) {
      let key1 = clusters[i].key;        
      if(mins[key1] === c1.key || mins[key1] === c2.key) {
        let min = key1;
        for(var j = 0; j < clusters.length; j++) {
          let key2 = clusters[j].key;
          if(dists[key1][key2] < dists[key1][min]) {
            min = key2;
	  }
        }
        mins[key1] = min;
      }
      clusters[i].index = i;
    }
    
     // clean up metadata used for clustering
    delete c1.key; delete c2.key;
    delete c1.index; delete c2.index;
    
    return true;
  };

VisionBlock.prototype.cluster = function(pool ) {
    var clusters = [];
    var dists = [];  // distances between each pair of clusters
    var mins = []; // closest cluster for each cluster
    var index = []; // keep a hash of all clusters by key
    for(let i = 0; i < pool.nodeList.get_Count(); i++) {

      let node = pool.nodeList.get_Item$$Int32(i);
      let cluster = { canonical: node, key: i, index: i, size: 1 };

      clusters[i] = cluster;
      index[i] = cluster;
      dists[i] = [];
      mins[i] = 0;
    }

    for(let i = 0; i < clusters.length; i++) {
      for(let j = 0; j <= i; j++) {
        let dist = (i === j) ? Infinity : 
          this.distance(clusters[i].canonical, clusters[j].canonical);
        dists[i][j] = dist;
        dists[j][i] = dist;

        if(dist < dists[i][mins[i]]) {
          mins[i] = j;
	}
      }
    }

    var merged = this.mergeClosest(clusters, dists, mins, index);
    //var i = 0;
    while(merged) {
      merged = this.mergeClosest(clusters, dists, mins, index);
      //i++;
    }
    
    clusters.forEach(function(cluster) {
      // clean up metadata used for clustering
      delete cluster.key;
      delete cluster.index;
    });

    return clusters;
  };
  

VisionBlock.prototype.divideBlock = function (pDOC){
    if (this.DOC < pDOC){
        if (this.containedHTMLNodeList.get_Count() > 1){
            let pool = new NodePool();
            for (var i = 0; i < this.containedHTMLNodeList.get_Count(); i++){
                var node = this.containedHTMLNodeList.get_Item$$Int32(i);
                pool.addToPool(node);
            }
            let spPool = new SplitterPool(this);
            let direction = spPool.detectAllSplitterFor(pool, null);
            spPool.sortHorizontalSplitter("top");
            spPool.sortVerticalSplitter("left");
            this.constructVisionBlock(pool, spPool, direction, 20);
            this.divideDirection = this.getBlockDivideDirection();
        }
        else {
            let spNodeList = null;
            let node = this.containedHTMLNodeList.get_Item$$Int32(0);
            let pool = new NodePool();
            spNodeList = node.divideDOMTree(pool, 2);
            if (pool.getCount() === 0) {
                return;
            }
            let spPool = new SplitterPool(pool);
            let direction = spPool.detectAllSplitterFor(pool, spNodeList);
            spPool.sortHorizontalSplitter("top");
            spPool.sortVerticalSplitter("left");
            this.constructVisionBlock(pool, spPool, direction, 20);
            this.divideDirection = this.getBlockDivideDirection();
        }

        for (let i = 0; i < this.containedVisionBlockList.get_Count(); i++){
            (this.containedVisionBlockList.get_Item$$Int32(i)).divideBlock(pDOC);
	}

    }

};

/*
VisionBlock.prototype.divideThisBlock = function ( inTop, inButtom, inLeft, inRight  ){
    console.log("divideThisBlock, being..." ) ;
        if (this.containedHTMLNodeList.get_Count() > 1){

            let pool = new NodePool( inTop, inButtom, inLeft, inRight );

            for (let i = 0; i < this.containedHTMLNodeList.get_Count(); i++){
                var node = this.containedHTMLNodeList.get_Item$$Int32(i);
                pool.addToPool(node);
            }
            console.log("divideThisBlock(1), pool count = ", pool.getCount() ) ;

            let spPool = new SplitterPool( this );
            let direction = spPool.detectAllSplitterFor(pool, null);
            console.log("divideThisBlock(1), direction = ", direction  ) ;

            spPool.sortHorizontalSplitter("top");
            spPool.sortVerticalSplitter("left");
            this.constructVisionBlock(pool, spPool, direction,  20 ); 
            this.divideDirection = this.getBlockDivideDirection();
            console.log("divideThisBlock(1), divide direction = ", this.divideDirection ) ;
        }
        else {
            let spNodeList = null;
            let node = this.containedHTMLNodeList.get_Item$$Int32(0);

            let pool = new NodePool( inTop, inButtom, inLeft, inRight );

            spNodeList = node.divideDOMTree(pool, 2);
            console.log("divideThisBlock(2), pool count = ", pool.getCount() ) ;
            if (pool.getCount() === 0) {
                return;
            }
            let spPool = new SplitterPool(pool);
            let direction = spPool.detectAllSplitterFor(pool, spNodeList);
            console.log("divideThisBlock(2), direction = ", direction  ) ;

            spPool.sortHorizontalSplitter("top");
            spPool.sortVerticalSplitter("left");
            this.constructVisionBlock(pool, spPool, direction, 20 ); 
            this.divideDirection = this.getBlockDivideDirection();
            console.log("divideThisBlock(2), divide direction = ", this.divideDirection ) ;
        }

    console.log("divideThisBlock, finished..." ) ;
};
*/


VisionBlock.prototype.divideThisBlock = function ( inTop, inButtom, inLeft, inRight  ){

    var spNodeList = null;
    var pool = new NodePool( inTop, inButtom, inLeft, inRight );

    if (this.containedHTMLNodeList.get_Count() === 1){
        let node = this.containedHTMLNodeList.get_Item$$Int32(0);
        spNodeList = node.divideDOMTree(pool, 2);

    }else {
        for (let i = 0; i < this.containedHTMLNodeList.get_Count(); i++){
            var node = this.containedHTMLNodeList.get_Item$$Int32(i);
            pool.addToPool(node);
        }
    }

    if (pool.getCount() === 0) {
        return;
    }

    //do cluster with hierarchical clustering, todo, shoud call this only once 
    //because this algorithm is slow. 
    var tree = this.cluster( pool) ;
    if (tree === null || tree.length === 0  ) {
        return ;
    }


    let spPool = new SplitterPool( this );


    //detect splitter by tree
    let direction = spPool.detectAllSplitterForWithTree(pool, tree,  spNodeList, 
			this.blockTop, this.blockButtom, this.blockLeft, this.blockRight );

    spPool.sortHorizontalSplitter("top");
    spPool.sortVerticalSplitter("left");
    this.constructVisionBlock(pool, spPool, direction,  20 ); 
    this.divideDirection = this.getBlockDivideDirection();

};



