

import VIPSArrayList from './VIPSArrayList';
import TableDividePolicy from './TableDividePolicy';
import TdDividePolicy from './TdDividePolicy';
import NonVisualDividePolicy from './NonVisualDividePolicy';
import OtherDividePolicy from './OtherDividePolicy';


export default function CHTMLNode () {
   if (arguments.length === 1 ) {

      if (arguments[0] instanceof HTMLElement ) {
          this.init_innode(arguments[0]);
      }else if (arguments[0] instanceof String ) {
          this.init_string (arguments[0]);
      }
   }
   else if ( arguments.length === 4 ) {
      this.init_top_buttom_left_right (arguments[0], arguments[1], arguments[2], arguments[3]);
   }
}


CHTMLNode.prototype.init_string = function (textString){
    this.innerHTML = textString ;
    this.innerText = textString ;
    this.textNode = true ;
    this.tagName = "#text" ;
};

CHTMLNode.prototype.init_top_buttom_left_right  = function (inTop, inButtom, inLeft, inRight ){
    this.innerHTML = null;
    this.outerHTML = null;
    this.innerText = null;
    this.outerText = null;
    this.tagName = "";
    this.offsetTop = inTop;
    this.offsetLeft = inLeft;
    this.offsetRight = inRight;
    this.offsetButtom = inButtom;
    this.offsetWidth = this.offsetRight - this.offsetLeft;
    this.offsetHeight = this.offsetButtom - this.offsetTop;
    this.htmlElement = null;
    this.behaviorID = 0;
    this.nodePool = null;
    this.nodeBehaviorList = null;
    this.heightList = null;
    this.isTRNode = false;
    this.DOC = 0;
    this.spLeft = null;
    this.spUp = null;
    this.spRight = null;
    this.spButtom = null;
    this.explicitSpList = null;
    this.textNode = false;
    this.nodePool = null;
    this.spLeft = null;
    this.spRight = null;
    this.spUp = null;
    this.spButtom = null;
};


CHTMLNode.prototype.init_innode = function (inNode){
    this.innerHTML = null;
    this.outerHTML = null;
    this.innerText = null;
    this.outerText = null;

    //null => "", 
    this.tagName = "";
    this.offsetTop = 0;
    this.offsetLeft = 0;
    this.offsetRight = 0;
    this.offsetButtom = 0;
    this.offsetWidth = 0;
    this.offsetHeight = 0;
    this.htmlElement = null;
    this.behaviorID = 0;
    this.nodePool = null;
    this.nodeBehaviorList = null;
    this.heightList = null;
    this.isTRNode = false;
    this.DOC = 0;
    this.spLeft = null;
    this.spUp = null;
    this.spRight = null;
    this.spButtom = null;
    this.explicitSpList = null;
    this.textNode = false;
    this.nodePool = null;
    this.spLeft = null;
    this.spRight = null;
    this.spUp = null;
    this.spButtom = null;
    this.nodeBehaviorList = new VIPSArrayList();
    this.explicitSpList = new VIPSArrayList();
    this.htmlElement = inNode;
    this.innerHTML = inNode.innerHTML;
    this.outerHTML = inNode.outerHTML;
    this.innerText = inNode.textContent;  
    this.outerText = inNode.textContent;  

    var bodyNode = inNode;

    while (bodyNode.offsetParent !== null) {
        bodyNode = bodyNode.offsetParent;
    }

    var currentNode = inNode;
    if (currentNode.offsetParent !== null){
        if (currentNode.offsetParent === bodyNode){
            this.offsetTop = currentNode.offsetParent.offsetTop + currentNode.offsetTop;
            this.offsetLeft = currentNode.offsetParent.offsetLeft + currentNode.offsetLeft;
        }
        else {
            while (currentNode.offsetParent !== null){
                this.offsetTop = this.offsetTop + currentNode.offsetTop;
                this.offsetLeft = this.offsetLeft + currentNode.offsetLeft;
                currentNode = currentNode.offsetParent;
            }
            this.offsetTop = bodyNode.offsetTop + this.offsetTop;
            this.offsetLeft = bodyNode.offsetLeft + this.offsetLeft;
        }
    }
    else {
        this.offsetTop = inNode.offsetTop;
        this.offsetLeft = inNode.offsetLeft;
    }


    //this.offsetWidth = inNode.offsetWidth;
    //this.offsetHeight = inNode.offsetHeight;

    if (inNode === bodyNode) {
        this.offsetWidth = inNode.scrollWidth;
        this.offsetHeight = inNode.scrollHeight;
    }else {
        this.offsetWidth = inNode.offsetWidth;
        this.offsetHeight = inNode.offsetHeight;
    }

    this.offsetRight = this.offsetLeft + this.offsetWidth;
    this.offsetButtom = this.offsetTop + this.offsetHeight;


    this.tagName = inNode.tagName;
    if (inNode.tagName === "TR"){
        //this.heightList = new System.Collections.ArrayList.ctor$$Int32(1);
        this.heightList = new VIPSArrayList(1);	
        this.htmlElement = inNode;
        this.isTRNode = true;
    }
    else {
        this.isTRNode = false;
    }

    this.textNode = false;
};

CHTMLNode.prototype.checkRight = function (heightList){
    /*
    var enumer = heightList.GetEnumerator();
    var i = 0;
    enumer.MoveNext();
    var firstHeight = enumer.get_Current();
    for (; enumer.MoveNext();){
        if (firstHeight === enumer.get_Current()){
            i++;
            continue;
        }
        break;
    }
    */

    var firstHeight = heightList.get_Item$$Int32(0);

    var j = 0 ;
    for (let i = 0; i< heightList.get_Count(); i++ ) {
        if (firstHeight === heightList.get_Item$$Int32(i)){
            j++;
            continue;
        }
        break;
    }

    if (j === heightList.get_Count() - 1) {
        return true;
    }

    return false;
};

CHTMLNode.prototype.getAllSubNode = function (){
    var blockList = new VIPSArrayList();
    if (this.isRectangular()){
        blockList.Add(this);
    }
    else {
        var allChild = this.htmlElement.children;
        var i, l, child;
        for(i=0, l= allChild.length; i<l; i++){
            child = allChild[i];

            var node = new CHTMLNode(child);
            if (node.isValidNode()){
                blockList.Add(node);
            }
            else {
                continue;
	    }
        }
    }
    return blockList;
};
CHTMLNode.prototype.isRectangular = function (){
    if (this.isTRNode === true){
        var allChild = this.htmlElement.children;
        var i, l, child;
        for(i=0, l= allChild.length; i<l; i++){
            child = allChild[i];

            this.heightList.Add(child.offsetTop + child.offsetHeight);
        }
        return this.checkRight(this.heightList);
    }
    else {
        return true;
    }
};
CHTMLNode.prototype.isInlineNode = function (){
    if (this.htmlElement === null) {
       return false;
    }

    if (this.htmlElement.tagName === "B" ||
	 this.htmlElement.tagName === "BIG" ||
	 this.htmlElement.tagName === "#text" ||
	 this.htmlElement.tagName === "EM" ||
	 this.htmlElement.tagName === "STRONG" ||
	 this.htmlElement.tagName === "FONT" ||
	 this.htmlElement.tagName === "I" ||
	 this.htmlElement.tagName === "U" ||
	 this.htmlElement.tagName === "SMALL" ||
	 this.htmlElement.tagName === "STRIKE" ||
	 this.htmlElement.tagName === "TT" ||
	 this.htmlElement.tagName === "CODE" ||
	 this.htmlElement.tagName === "SUB" ||
	 this.htmlElement.tagName === "SUP" ||
	 this.htmlElement.tagName === "ADDRESS" ||
	 this.htmlElement.tagName === "BLOCKQUOTE" ||
	 this.htmlElement.tagName === "DFN" ||
	 this.htmlElement.tagName === "SPAN" ||
	 this.htmlElement.tagName === "IMG" ||
	 this.htmlElement.tagName === "A" ||
	 this.htmlElement.tagName === "LI" ||
	 this.htmlElement.tagName === "VAR" ||
	 this.htmlElement.tagName === "KBD" ||
	 this.htmlElement.tagName === "SAMP" ||
	 this.htmlElement.tagName === "CITE" ||
		 this.htmlElement.tagName === "H1" ||
		 this.htmlElement.tagName === "H2" ||
		 this.htmlElement.tagName === "H3" ||
		 this.htmlElement.tagName === "H4" ||
		 this.htmlElement.tagName === "H5" ||
		 this.htmlElement.tagName === "H6" ||
	 this.htmlElement.tagName === "BASE") {
        return true;
    }
    else {
        return false;
    }
};
CHTMLNode.prototype.isLineBreakNode = function (){
    return !this.isInlineNode();
};
CHTMLNode.prototype.hasLineBreakNodeInChildrens = function (){
    var allChild = this.htmlElement.children;
    var i, l, child;
    for(i=0, l= allChild.length; i<l; i++){
        child = allChild[i];

        var node = new CHTMLNode(child);
        if (node.isLineBreakNode()) {
            return true;
	}
    }
    return false;
};
CHTMLNode.prototype.hasHRNodeInChildrens = function (){
    var allChild = this.htmlElement.children;
    var i, l, child;
    for(i=0, l= allChild.length; i<l; i++){
        child = allChild[i];

        if (child.tagName === "HR") {
            return true;
	}
    }
    return false;
};
CHTMLNode.prototype.isVirtual = function (node){
    var isVirtualNode = false;
    if (!node.isInlineNode()) {
        return false;
    }
    var allChild = node.htmlElement.children;
    var i, l, child;
    for(i=0, l= allChild.length; i<l; i++){
        child = allChild[i];

        var cnode = new CHTMLNode(child);
        isVirtualNode = this.isVirtual(cnode);
        if (isVirtualNode === false) {
            return false;
	}    
        if (isVirtualNode === true) {
            continue;
	}
    }
    return true;
};
CHTMLNode.prototype.hasImgInChilds = function (node){
    var hasImage = false;

    if (node === null) {
	return false;
    }
    if (node.htmlElement === null) {
        return false;
    }

    if (node.tagName === "IMG"){
        hasImage = true;
    }

    var allChild = node.htmlElement.children;
    var i,l,child;
    for (i=0, l=allChild.length; i<l; i++){
        child = allChild[i];

        var cnode = new CHTMLNode(child);
        hasImage = this.hasImgInChilds(cnode);
        if (hasImage === false) {
            continue;
	}
        if (hasImage === true) {
            return true;
	}
    }
    return hasImage;
};
CHTMLNode.prototype.isRNChar = function (inStr){
    if (inStr === null){
        return true;
    }
    inStr = inStr.trim();
    if (inStr === "") {
        return true;
    }

    return false;
};
CHTMLNode.prototype.isSplitterNode = function (){

    if (this.tagName === undefined) {
	return true;
    }

    if (this.tagName === "HR") {
        return true;
    }
    if (this.tagName === "#comment"){
        return false;
    }
    if (this.tagName === "") {
        return true;
    }
    if (this.tagName.length > 0 && this.tagName.charAt(0) === "/") {
        return false;
    }
    if (this.tagName === "FORM" && this.innerText !== null  && this.innerText.trim() !== "") {
        return false;
    }
    if (this.offsetHeight <= 10 || this.offsetWidth <= 10){
        return true;
    }
    return false;
};
CHTMLNode.prototype.isValidNode = function (){
    if (this.offsetHeight === 0 || this.offsetWidth === 0){
        if (this.tagName === "FORM" && this.innerText.trim() !== "") {
            return true;
	}
        return false;
    }
    if (this.htmlElement.tagName === "SCRIPT") {
        return false;
    }
    if (this.isRNChar(this.htmlElement.textContent)){ 
        if (this.htmlElement.tagName === "IMG") {
            return true;
	}
        if (this.hasImgInChilds(this)) {
            return true;
	}
        return false;
    }
    else if (this.htmlElement.textContent.trim() === "" ) { 
        return false;
    }

    return true;
};
CHTMLNode.prototype.isTextNode = function (){
    if (this.htmlElement.tagName === "#text") {
        return true;
    }
    else {
        return false;
    }
};
CHTMLNode.prototype.isRealVirtualTextNode = function (node){
    var allChild = node.htmlElement.children;
    var i, l, child;
    for(i=0, l= allChild.length; i<l; i++){
        child = allChild[i];

        var cnode = new CHTMLNode(child);
        if (this.isVirtual(cnode) === false) {
            return false;
	}
        continue;
    }
    return true;
};
CHTMLNode.prototype.isVirtualTextNode = function (){
    if (this.tagName === "LI" ||
	this.tagName === "SELECT" ||
	this.tagName === "MARQUEE"  ||
	this.tagName === "FORM") {
        return true;
    }
    if (this.tagName === "UL" ||
	this.tagName === "OL") {
        return false;
    }
    if (this.isRealVirtualTextNode(this)) {
        return true;
    }
    var tmpNode = this.getNonOneChildNode(this);
    if (this.isRealVirtualTextNode(tmpNode)) {
        return true;
    }
    return false;
};
CHTMLNode.prototype.getChildrenNum = function (){
    var allChild = this.htmlElement.childNodes;
    return allChild.length;
};
CHTMLNode.prototype.hasOnlyOneNoneText = function (node){
    if (node.getChildrenNum() === 1){
        return true;
    }
    return false;
};
CHTMLNode.prototype.getBgColor = function (){
    var bgColor = getComputedStyle(this.htmlElement,null).getPropertyValue('background-color');
    return bgColor;
};
CHTMLNode.prototype.getFgColor = function (){
    return this.htmlElement.currentStyle.color;
};
CHTMLNode.prototype.getFontSize = function (){
    return this.htmlElement.currentStyle.fontSize;
};
CHTMLNode.prototype.getFontWeight = function (){
    return this.htmlElement.currentStyle.fontWeight;
};
CHTMLNode.prototype.getFontFamily = function (){
    return this.htmlElement.currentStyle.fontFamily;
};
CHTMLNode.prototype.isSameBgColor = function (){
    var bgColor = this.getBgColor();
    var allChild = this.htmlElement.children ;
    var i, l, child;
    for(i=0, l= allChild.length; i<l; i++){
        child = allChild[i];

        var node = new CHTMLNode(child);
        if (bgColor !== node.getBgColor()){
            return false;
        }
    }
    return true;
};
CHTMLNode.prototype.isSameFontWeight = function (){
    var fontWeight = this.getFontWeight();
    var allChild = this.htmlElement.children;
    var i, l, child;
    for(i=0, l= allChild.length; i<l; i++){
        child = allChild[i];

        var node = new CHTMLNode(child);
        if (fontWeight !== node.getFontWeight()) {
            return false;
	}
    }
    return true;
};
CHTMLNode.prototype.isSameFontSize = function (){
    var fontSize = this.getFontSize();
    var allChild = this.htmlElement.children;
    var i, l, child;
    for(i=0, l= allChild.length; i<l; i++){
        child = allChild[i];

        var node = new CHTMLNode(child);
        if (fontSize !== node.getFontSize()) {
            return false;
	}
    }
    return true;
};
CHTMLNode.prototype.isSameForeColor = function (){
    var foreColor = this.getFgColor();
    var allChild = this.htmlElement.children;
    var i, l, child;
    for(i=0, l= allChild.length; i<l; i++){
        child = allChild[i];

        var node = new CHTMLNode(child);
        if (foreColor !== node.getFgColor()) {
            return false;
	}
    }
    return true;
};
CHTMLNode.prototype.isSameFontFamily = function (){
    var fontFamily = this.getFontFamily();
    var allChild = this.htmlElement.children;
    var i, l, child;
    for(i=0, l= allChild.length; i<l; i++){
        child = allChild[i];

        var node = new CHTMLNode(child);
        if (fontFamily !== node.getFontFamily()){
            return false;
	}
    }
    return true;
};
CHTMLNode.prototype.isEndNode = function (){
    return false;
};
CHTMLNode.prototype.isSameTypeNode = function (){
    return false;
};
CHTMLNode.prototype.isDividable = function (currentLevel, pDOC){
    if (currentLevel === pDOC) {
        return false;
    }
    if (!this.isRectangular()){
        return true;
    }
    if (this.hasOnlyOneNoneText(this)){
        return true;
    }
    if (this.isVirtualTextNode()){
        return false;
    }
    if (this.hasLineBreakNodeInChildrens()){
        return true;
    }
    if (this.hasHRNodeInChildrens()){
        return true;
    }
    if (!this.isSameBgColor()){
        return true;
    }
    return false;
};
CHTMLNode.prototype.getFirstChildNode = function (){
    var allChild = this.htmlElement.children;
    if (allChild.length > 0) {
        return new CHTMLNode(allChild[0]);
    }	
    else {
        return null;
    }
};
CHTMLNode.prototype.getNonOneChildNode = function (node){
    var childNode = node;
    while (this.hasOnlyOneNoneText(childNode)){
        childNode = childNode.getFirstChildNode();
        if (childNode.isVirtualTextNode()) {
            break;
	}
    }
    return childNode;
};

CHTMLNode.prototype.isNonVisualNode = function (){
    if (this.isVirtualTextNode()) {
        return false;
    }
    if (this.tagName === "CENTER" ||
	this.tagName === "DIV" ||
	this.tagName === "TR" ||
	this.tagName === "P" ||
		this.tagName === "UL" ||
                this.tagName === "OL" ||
                this.tagName === 'SECTION' ||
                this.tagName === 'ARTICLE') {
        return true;
    }
    return false;
};


CHTMLNode.prototype.divideDOMTree = function (pool, pDOC){
    //var list = new VIPSArrayList();
    //var spNodeList = new VIPSArrayList();
    
    if (this.tagName === "TABLE"){
        var tablePolicy = new TableDividePolicy();
        return tablePolicy.divideNode(this, pool, pDOC);
    }
    else if (this.tagName === "TD"){
        var tdPolicy = new TdDividePolicy();
        return tdPolicy.divideNode(this, pool, pDOC);
    }
    else if (this.isNonVisualNode()){
        var nonVisualPolicy = new NonVisualDividePolicy();
        return nonVisualPolicy.divideNode(this, pool, pDOC);
    }
    else {
        var otherPolicy = new OtherDividePolicy();
        return otherPolicy.divideNode(this, pool, pDOC);
    }
};
CHTMLNode.prototype.setNeighbourSplitter = function (sp, direction){
    if (direction === 0) {
        this.spUp = sp;
    }
    else if (direction === 1) {
        this.spButtom = sp;
    }
    else if (direction === 2) {
        this.spLeft = sp;
    }
    else {
        this.spRight = sp;
    }
};
CHTMLNode.prototype.getParent = function (){
    return new CHTMLNode(this.htmlElement.parentElement);
};


CHTMLNode.prototype.isIntersect = function (node){
    if ( node.offsetButtom >= this.offsetButtom &&
         node.offsetTop >= this.offsetTop &&
         node.offsetTop <= this.offsetButtom ) {
        return 1;
    }

    if ( node.offsetTop <= this.offsetTop  && 
         node.offsetButtom >= this.offsetTop  &&
         node.offsetButtom <=  this.offsetButtom) {
        return 2;
    }

    if ( node.offsetRight >= this.offsetRight &&
         node.offsetLeft >= this.offsetLeft &&
         node.offsetLeft <= this.offsetRight ) {
        return 3;
    }

    if ( node.offsetLeft <= this.offsetLeft &&
         node.offsetRight >= this.offsetLeft &&
         node.offsetRight <= this.offsetRight ) {
        return 4;
    }

    return -1;
};

CHTMLNode.prototype.isInclude = function (node){

    if (this.offsetButtom >= node.offsetButtom &&
        this.offsetTop <= node.offsetTop &&
        this.offsetRight >= node.offsetRight  &&
        this.offsetLeft <= node.offsetLeft ) {
        return true;
    }
    else {
        return false;
    }
};

CHTMLNode.prototype.isAcross = function (node){
    if (this.offsetTop < node.offsetTop &&
        this.offsetButtom > node.offsetButtom &&
        this.offsetLeft > node.offsetLeft &&
        this.offsetRight < node.offsetRight ) {
        return true;
    }
    if (this.offsetLeft < node.offsetLeft &&
        this.offsetRight > node.offsetRight &&
        this.offsetTop > node.offsetTop &&
        this.offsetButtom < node.offsetButtom ) {
        return true;
    }

    return false;
};

CHTMLNode.prototype.adjust = function (inleft, intop, inright, inbuttom){
    this.offsetLeft = inleft;
    this.offsetTop= intop;
    this.offsetRight= inright;
    this.offsetButtom = inbuttom;
    this.offsetWidth = this.offsetRight- this.offsetLeft ;
    this.offsetHeight = this.offsetButtom - this.offsetTop;
};


