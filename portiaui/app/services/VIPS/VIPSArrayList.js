
/**********************************************************
* JavaScript ArrayList
* 
* @author {yangl}
* @version $Revision: 0.5 $ $Date: 2008/04/02 15:00:00 $
* @description
* Method:
* add(element);
* addElementAt(index, element);
* contains(element);
* get(index);
* isEmpty(index);
* indexOf(element);
* lastIndexOf(element);
* remove()
* setElementAt(index, element);
* size();
* toString();
* @example
* var arrList = new ArrayList();
* //var arrList = new ArrayList(10);
* arrList.add("000");
* arrList.add("001");
* arrList.add("002");
*
*********************************************************/
// JavaScript ArrayList
/**
Method:
        add(element);
        addElementAt(index, element);
        contains(element);
        get(index);
        isEmpty(index);
        indexOf(element);
        lastIndexOf(element);
        remove(index);
        setElementAt(index, element);
        size();
        toString();
*/
/**
Example:
        var arrList = new ArrayList();
        //var arrList = new ArrayList(10);
        arrList.add("000");
        arrList.add("001");
        arrList.add("002");
*/



    export default function VIPSArrayList (capacity = 10 ){
        if (capacity < 10) {
		capacity = 10;
	}
        this.elementData = new Array(capacity);
        this.elementCount = 0;
    }
 

    VIPSArrayList.prototype.size = function () {
        return this.elementCount;
    };
    
    VIPSArrayList.prototype.getCount = function () {
        return this.size();
    };

    VIPSArrayList.prototype.get_Count = function () {
        return this.size();
    };

    VIPSArrayList.prototype.add = function (element) {
        //alert("add");
        this.ensureCapacity(this.elementCount + 1);
        this.elementData[this.elementCount++] = element;
        return true;
    };
    

    VIPSArrayList.prototype.Add = function (element) {
        //alert("Add");
        return this.add( element );
    };


    VIPSArrayList.prototype.addList = function (list) {
        //alert("addList");
        for (var i = 0; i < list.size(); i++) {
            this.add(list.get(i));
        }
        return i;
    };

    VIPSArrayList.prototype.addElementAt = function (index, element) {
        //alert("addElementAt");
        if (index > this.elementCount || index < 0) {
            alert("IndexOutOfBoundsException, Index: " + index + ", Size: " + this.elementCount);
            return;
        }
        this.ensureCapacity(this.elementCount + 1);
        for (var i = this.elementCount + 1; i > index; i--) {
            this.elementData[i] = this.elementData[i - 1];
        }
        this.elementData[index] = element;
        this.elementCount++;
    };
    
    VIPSArrayList.prototype.setElementAt = function (index, element) {
        //alert("setElementAt");
        if (index > this.elementCount || index < 0) {
            alert("IndexOutOfBoundsException, Index: " + index + ", Size: " + this.elementCount);
            return;
        }
        this.elementData[index] = element;
    };
    
    VIPSArrayList.prototype.set_Item$$Int32 = function(index, element) {
        return this.setElementAt(index, element);
    };

    VIPSArrayList.prototype.toString = function () {
        //alert("toString()");
        var str = "{";
        for (var i = 0; i < this.elementCount; i++) {
            if (i > 0) {
                str += ",";
            }
            str += this.elementData[i];
        }
        str += "}";
        return str;
    };
    
    VIPSArrayList.prototype.get = function (index) {
        //alert("elementAt");
        if (index >= this.elementCount) {
            alert("ArrayIndexOutOfBoundsException, " + index + " >= " + this.elementCount);
            return;
        }
        return this.elementData[index];
    };
    
    VIPSArrayList.prototype.getElementAt = function (index) {
        //alert("elementAt");
        return this.get(index);
    };
    
    VIPSArrayList.prototype.get_Item$$Int32 = function (index) {
        //alert("elementAt");
        return this.get(index);
    };

    VIPSArrayList.prototype.remove = function (index) {
        if (this.elementCount < 1 ||
	    index < 0  ||        
	    index >= this.elementCount) {
            return;
        }
        var oldData = this.elementData[index];
        for (var i = index; i < this.elementCount - 1; i++) {
            this.elementData[i] = this.elementData[i + 1];
        }
        this.elementData[this.elementCount - 1] = null;
        this.elementCount--;
        return oldData;
    };
    
    VIPSArrayList.prototype.Remove = function (elem) {
        return this.remove(this.indexOf(elem));
    };

    VIPSArrayList.prototype.removeAll = function () {
        for (var i = this.elementCount - 1; i >= 0; i--) {
            this.remove(i);
        }
        return i;
    };
    
    VIPSArrayList.prototype.isEmpty = function () {
        return this.elementCount === 0;
    };
    
    VIPSArrayList.prototype.indexOf = function (elem) {
        //alert("indexOf");
        for (var i = 0; i < this.elementCount; i++) {
            if (this.elementData[i] === elem) {
                return i;
            }
        }
        return -1;
    };
    
    VIPSArrayList.prototype.lastIndexOf = function (elem) {
        for (var i = this.elementCount - 1; i >= 0; i--) {
            if (this.elementData[i] === elem) {
                return i;
            }
        }
        return -1;
    };
    
    VIPSArrayList.prototype.contains = function (elem) {
        return this.indexOf(elem) >= 0;
    };
    
    VIPSArrayList.prototype.ensureCapacity = function (minCapacity) {
        var oldCapacity = this.elementData.length;
        if (minCapacity > oldCapacity) {
            var oldData = this.elementData;
            var newCapacity = parseInt((oldCapacity * 3) / 2 + 1);
            if (newCapacity < minCapacity) {
                newCapacity = minCapacity;
            }
            this.elementData = new Array(newCapacity);
            for (var i = 0; i < oldCapacity; i++) {
                this.elementData[i] = oldData[i];
            }
        }
    };
