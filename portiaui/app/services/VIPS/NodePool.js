import VIPSArrayList from './VIPSArrayList';
import CHTMLNode from './CHTMLNode';



export default function NodePool () {
   if (arguments.length === 0 ) {
      this.init_zero();
   }
   else if ( arguments.length === 4 ) {
      this.init_top_buttom_left_right (arguments[0], arguments[1], arguments[2], arguments[3]);
   }
}

NodePool.prototype.init_zero = function (){
    this.nodeList = null;
    this.nodeList = new VIPSArrayList(); 

    this.inNode = null; 
};

NodePool.prototype.init_top_buttom_left_right = function ( inTop, inButtom, inLeft, inRight ){
    this.nodeList = null;
    this.nodeList = new VIPSArrayList(); 
    
    this.inNode = new CHTMLNode(inTop, inButtom, inLeft, inRight ); 
};

NodePool.prototype.addToPool = function (node){
    if ( this.checkAndUpdate(node) === true ) {
        //console.log("addToPool, insert this node to pool ");
        this.nodeList.Add(node);
        node.nodePool = this;
    }
};

NodePool.prototype.elementAt = function (index){
    return this.nodeList.get_Item$$Int32(index);
};
NodePool.prototype.removeNode = function (node){
    this.nodeList.Remove(node);
};
NodePool.prototype.removeAll = function (){
    this.nodeList.removeAll();
};
NodePool.prototype.getCount = function (){
    return this.nodeList.get_Count();
};

NodePool.prototype.checkAndUpdate = function ( node ) {

    if ( this.inNode != null && !this.inNode.isInclude(node)) {

        // have no relationship with this. 
        if ( this.inNode.offsetButtom <= node.offsetTop ||
            this.inNode.offsetTop >= node.offsetButtom   ||
            this.inNode.offsetRight <= node.offsetLeft  ||
            this.inNode.offsetLeft >= node.offsetRight ) {
            console.log("NodePool::checkAndUpdate(25), return false ");
            return false;
        }

        if (this.inNode.isAcross(node) || node.isAcross(this.inNode) ) {
            //don't insert this node into pool. 
            console.log("NodePool::checkAndUpdate(30), return false ");
            return false;
        }

        let result = this.inNode.isIntersect(node) ;
        if (result === 1){
            console.log("NodePool::checkAndUpdate(31) ");
            node.adjust(node.offsetLeft, 
			node.offsetTop, 
			node.offsetRight, 
			this.inNode.offsetButtom );
        }
        else if (result === 2){
            console.log("NodePool::checkAndUpdate(32) ");
            node.adjust(node.offsetLeft, 
			this.inNode.offsetTop, 
			node.offsetRight, 
			node.offsetButtom );
        }
        else if (result === 3){
            console.log("NodePool::checkAndUpdate(33) ");
            node.adjust(node.offsetLeft, 
			node.offsetTop, 
			this.inNode.offsetRight, 
			node.offsetButtom );
        }
        else if (result === 4){
            console.log("NodePool::checkAndUpdate(34) ");
            node.adjust(this.inNode.offsetLeft, 
			node.offsetTop, 
			node.offsetRight, 
			node.offsetButtom );
        }else {
            console.log("NodePool::checkAndUpdate(35), return false ");
            return false;
        }

    } 

    
    for (let i = 0; i < this.nodeList.get_Count(); i++){
        var tmp = this.nodeList.get_Item$$Int32(i) ;


        // have no relationship with this. 
        if (tmp.offsetButtom <= node.offsetTop ||
            tmp.offsetTop >= node.offsetButtom  ||
            tmp.offsetRight <= node.offsetLeft ||
            tmp.offsetLeft >= node.offsetRight ) {
            continue;
        }

        /*
        if (tmp.isInclude(node)) {
            console.log("NodePool::checkAndUpdate(40), remove previous node from node ");
            removeList.Add(tmp);
            continue;
        }
        */

        if ( tmp.isInclude(node) ||  node.isInclude(tmp)) {
            console.log("NodePool::checkAndUpdate(45), return false ");
            return false;
        }
      
        if (tmp.isAcross(node) || node.isAcross(tmp)) {
            //don't insert this node into pool. 
            console.log("NodePool::checkAndUpdate(50), return false ");
            return false;
        }

        let result = tmp.isIntersect(node) ;
        if (result === 1){
            console.log("NodePool::checkAndUpdate(51)");
            node.adjust(node.offsetLeft, 
			tmp.offsetButtom, 
			node.offsetRight, 
			node.offsetButtom );
        }
        else if (result === 2){
            console.log("NodePool::checkAndUpdate(52)");
            node.adjust(node.offsetLeft, 
			    node.offsetTop, 
			    node.offsetRight, 
			    tmp.offsetTop );
        }
        else if (result === 3){
            console.log("NodePool::checkAndUpdate(53)");
            node.adjust(tmp.offsetRight, 
			    node.offsetTop, 
			    node.offsetRight, 
			    node.offsetButtom );
        }
        else if (result === 4){
            console.log("NodePool::checkAndUpdate(54)");
            node.adjust(node.offsetLeft, 
			    node.offsetTop, 
			    tmp.offsetLeft, 
			    node.offsetButtom );
        }

    }

    if( node.offsetTop >= node.offsetButtom ||
        node.offsetLeft >= node.offsetRight ) {
        console.log("NodePool::checkAndUpdate(20), return false ");
        console.log("NodePool::checkAndUpdate, node.offsetTop = ", node.offsetTop );
        console.log("NodePool::checkAndUpdate, node.offsetButtom = ", node.offsetButtom );
        console.log("NodePool::checkAndUpdate, node.offsetLeft = ", node.offsetLeft );
        console.log("NodePool::checkAndUpdate, node.offsetRight  = ", node.offsetRight  );
        return false;
    }

    return true;

};

