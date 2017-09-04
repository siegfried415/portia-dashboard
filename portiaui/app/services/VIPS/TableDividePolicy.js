import VIPSArrayList from './VIPSArrayList';
import CHTMLNode from './CHTMLNode';


export default function TableDividePolicy (){
    this.explicitSpList = null;
    this.explicitSpList = new VIPSArrayList();
}

TableDividePolicy.prototype.getTDNode = function (node, pool){
    if (node.tagName === "TD" || node.tagName === "TH"){
        pool.addToPool(node);
        return;
    }

    var allChild1 = node.htmlElement.childNodes;
    var i, l, child; 


    for ( i = 0, l = allChild1.length; i < l; i++){
        child = allChild1[i];

	//tagName => nodeName
        if (child.nodeName === "#text"){

            var textNode = new CHTMLNode(child.nodeValue.toString());

            pool.addToPool(textNode);
            continue;
        }
        else {
            var childNode = new CHTMLNode(child);

            if (childNode.isSplitterNode()){
                this.explicitSpList.Add(childNode);
                continue;
            }
            if (childNode.isValidNode()){
                if (childNode.tagName === "TR" || childNode.tagName === "TBODY") {
                    this.getTDNode(childNode, pool);
		}    
                else {
                    pool.addToPool(childNode);
		}
            }
            else {
                continue;
	    }
        }
    }
};

TableDividePolicy.prototype.divideNode = function (node, pool, pDOC){
    this.getTDNode(node, pool);
    if (pool.getCount() === 1){
        var tdNode = pool.elementAt(0);
        pool.removeAll();
        return tdNode.divideDOMTree(pool, pDOC);
    }
    return this.explicitSpList;
};

