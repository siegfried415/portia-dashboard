
export default function HeapSort (){

}


HeapSort.prototype.getValueByFieldNameAtIndex = function (list, index, fieldName){
    var item = list.get_Item$$Int32(index);
    var value = item[fieldName] ;
    return value;
};

HeapSort.prototype.heapify = function (list, arraynum, i, fieldName){
    var largest = 0;
    var left = 2 * i + 1;
    var right = 2 * i + 2;
    if (left < arraynum && this.getValueByFieldNameAtIndex(list, i, fieldName) < 
	    this.getValueByFieldNameAtIndex(list, left, fieldName)) {
        largest = left;
    }
    else {
        largest = i;
    }

    if (right < arraynum && this.getValueByFieldNameAtIndex(list, right, fieldName) > 
		    this.getValueByFieldNameAtIndex(list, largest, fieldName)) {
        largest = right;
    }

    if (i !== largest){
        var tmp = list.get_Item$$Int32(i);
        list.set_Item$$Int32(i, list.get_Item$$Int32(largest));
        list.set_Item$$Int32(largest, tmp);
        this.heapify(list, arraynum, largest, fieldName);
    }
};

HeapSort.prototype.buildHeap = function (list, fieldName){
    for (var i = Math.floor(list.get_Count() / 2); i >= 0; i--) {
        this.heapify(list, list.get_Count(), i, fieldName);
    }
};

HeapSort.prototype.doSort = function (/* obj */ sortList, fieldName){
    this.buildHeap(sortList, fieldName);
    var arrynum = sortList.get_Count();
    for (var i = 0; i < arrynum - 1; i++){
        var tmp = sortList.get_Item$$Int32(0);
        sortList.set_Item$$Int32(0, sortList.get_Item$$Int32(arrynum - i - 1));
        sortList.set_Item$$Int32(arrynum - i - 1, tmp);
        this.heapify(sortList, arrynum - 1 - i, 0, fieldName);
    }
};

