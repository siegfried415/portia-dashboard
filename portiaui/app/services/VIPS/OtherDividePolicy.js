
import VIPSArrayList from './VIPSArrayList';
import CHTMLNode from './CHTMLNode';

export default function OtherDividePolicy () {
    this.explicitSpList = null;
    this.explicitSpList = new VIPSArrayList();
}

OtherDividePolicy.prototype.divideNode = function (node, pool, pDOC){
    if (node.isVirtualTextNode()){
        pool.addToPool(node);
        return null;
    }
    if (node.isSplitterNode()){
        this.explicitSpList.Add(node);
        return null;
    }
    if (!node.isValidNode()) {
        return null;
    }
    if (node.getChildrenNum() === 1){
        let tmpNode = node;
        pool.removeNode(node);
        return tmpNode.getFirstChildNode().divideDOMTree(pool, pDOC);
    }

    var allChild1 = node.htmlElement.childNodes;
    var i, l, child; 


    for ( i = 0, l = allChild1.length; i < l; i++){
        child = allChild1[i];

	//tagName => nodeName
        if (child.nodeName === "#text"){
	
	    //child => child.nodeValue.toString()
            let textNode = new CHTMLNode(child.nodeValue.toString() );

            pool.addToPool(textNode);
            continue;
        }
        else {
            let cnode = new CHTMLNode(child);

            if (cnode.isSplitterNode()){
                this.explicitSpList.Add(cnode);
                continue;
            }
            if (cnode.isValidNode()){
                if (cnode.isNonVisualNode()) {
                    cnode.divideDOMTree(pool, pDOC);
		}
                else {
                    pool.addToPool(cnode);
		}
            }
            continue;
        }
    }
    if (pool.getCount() === 1){
        let cnode = pool.elementAt(0);
        if (cnode.tagName !== "#text"){
            pool.removeAll();
            return cnode.divideDOMTree(pool, pDOC);
        }
    }
    return this.explicitSpList;
};

