
import VIPSArrayList from './VIPSArrayList';
import CHTMLNode from './CHTMLNode';

export default function NonVisualDividePolicy (){
    this.explicitSpList = null;
    this.explicitSpList = new VIPSArrayList();
}

NonVisualDividePolicy.prototype.divideNode = function (node, pool, pDOC){
    if (node.isVirtualTextNode()){
        pool.addToPool(node);
        return null;
    }

    //children => childNodes, 
    var allChild1 = node.htmlElement.childNodes;
    var i, l, child; 


    for ( i = 0, l = allChild1.length; i < l; i++){
        child = allChild1[i];

	//tagName => nodeName
        if (child.nodeName === "#text"){

	    //child => child.nodeValue.toString()
            var textNode = new CHTMLNode(child.nodeValue.toString() );

            pool.addToPool(textNode);
            continue;
        }
        else {
            var cnode = new CHTMLNode(child);

            if (cnode.tagName === "SCRIPT") {
                continue;
	    }
            if (cnode.isSplitterNode()){
                this.explicitSpList.Add(cnode);
                continue;
            }
            if (cnode.isVirtualTextNode()){
                pool.addToPool(cnode);
                continue;
            }
            if (cnode.isValidNode()){
                if (!cnode.isNonVisualNode()) {
                    pool.addToPool(cnode);
		}
                else {
                    this.divideNode(cnode, pool, pDOC);
		}
            }
            continue;
        }
    }
    return this.explicitSpList;
};

