
import VIPSArrayList from './VIPSArrayList';
import OtherDividePolicy from './OtherDividePolicy';

export default function TdDividePolicy (){
    this.explicitSpList = null;
    this.explicitSpList = new VIPSArrayList();
}

TdDividePolicy.prototype.getSplitterNodeList = function (){
    return this.explicitSpList;
};
TdDividePolicy.prototype.tdIsVirtualTextNode = function (tdNode){
    if (tdNode.isVirtualTextNode()) {
        return true;
    }
    return false;
};
TdDividePolicy.prototype.divideNode = function (node, pool, pDOC){
    if (node.isSplitterNode()){
        this.explicitSpList.Add(node);
        return this.explicitSpList;
    }
    if (this.tdIsVirtualTextNode(node)){
        pool.addToPool(node);
        return null;
    }
    var otherPolicy = new OtherDividePolicy();
    return otherPolicy.divideNode(node, pool, pDOC);
};

