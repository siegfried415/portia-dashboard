import VisionBlock from './VisionBlock';
import CHTMLNode  from './CHTMLNode';
import VIPSArrayList from './VIPSArrayList';


export default function Article(doc) {
	this._doc =  doc;
	this._mainLinksBlock = null;
	this._titleBlock = null;
	this._mainBodyBlock = null;
	this._tagsBlock = null;
	this._authorBlock = null;
	this._dateBlock = null;

	this._mainBlock = null;
}


Article.prototype.getMainLinksElement = function () {
    var result = null;
    if (this._mainLinksBlock != null) {
        for ( var i=0; i< this._mainLinksBlock.containedHTMLNodeList.get_Count(); i++ ) {
            var node = this._mainLinksBlock.containedHTMLNodeList.get_Item$$Int32(i);
            result = this.getNearestCommonParent(result, node.htmlElement, this._doc.body);
        }    
    }
    return result;
};

//todo
Article.prototype.getMainLinksProbality = function() {
    return 1.0;
};

Article.prototype.getMainLinksBlock =  function() {
    return this._mainLinksBlock;
};


Article.prototype.setMainLinksBlock = function ( block ) {
    this._mainLinksBlock = block;
};

Article.prototype.isSimilar = function ( v1, v2, k ) {
    if ( v1 === v2 ) {
        return true;
    }
    else if ( v1 <  v2 ) {
        if ( v1 >= v2 * k ) { return true;}
    }
    else {
        if ( v1 <= v2 / k ) { return true ;}
    }
  
    return false;
};


Article.prototype.searchMainLinksBlock = function ( block, rootBlock, proportionThreshold ) {

    console.log("searchMainLinksBlock, begin...");
    //console.log("searchMainLinksBlock, rootBlock.htmlElement.offsetHeight = ", 
    //             rootBlock.containedHTMLNodeList.get_Item$$Int32(0).htmlElement.offsetHeight );

    if (block.getProportion(rootBlock) > proportionThreshold &&
       block.isInHorizontalCenter(rootBlock) 
       					     /*  &&
       (block.isInVerticalCenter(rootBlock) || block.isInVerticalTop(rootBlock)) */  ) {

        if (block.getContainedVisionBlockList().get_Count() === 0 ){
            block.divideThisBlock(rootBlock.blockTop, 
                                  rootBlock.blockButtom,
                                  rootBlock.blockLeft, 
                                  rootBlock.blockRight );
        }

        console.log("searchMainLinksBlock, sub block count = " , 
			             block.containedVisionBlockList.get_Count());

        for (let i = 0; i < block.containedVisionBlockList.get_Count(); i++ ) {
            let child = block.containedVisionBlockList.get_Item$$Int32(i);
            let resultBlock =  this.searchMainLinksBlock(child, rootBlock, proportionThreshold);
            if (resultBlock != null ) {
                return resultBlock;
            }
        }	

        // Mainlink must have 3 child
        if ( block.containedVisionBlockList.get_Count() <= 3 ) {
            return null;
        }

        console.log("searchMainLinksBlock, begin search links items " ); 
        // get childblocks set which have same splitter height the most. 
        let max_count = 0; 
        let max_start = 0; 
        let max_proportion = 0.0; 
        let max_spHeight;
        let i = 0;

        while ( i < block.containedVisionBlockList.get_Count()) {
            let firstChildBlock = block.containedVisionBlockList.get_Item$$Int32(i);

            if ( !firstChildBlock.hasLink() ||
                !firstChildBlock.isInHorizontalCenter(rootBlock) ) {
                i = i + 1 ;
                continue; 
            }

            let down_sp = firstChildBlock.downSplitter;
            if( down_sp === null ) {
                break;
            }
            let firstSpHeight = down_sp.height;
            let proportion = firstChildBlock.getProportion(rootBlock) ;

            let firstLinkDensity = firstChildBlock.setLinkDensity();

            for (var j = i+1; j < block.containedVisionBlockList.get_Count() ; j++ ) {
                let child = block.containedVisionBlockList.get_Item$$Int32(j);
                let up_sp = child.upSplitter;
                if( up_sp === null ) {
                    break;
                }
                let spHeight = up_sp.height ;
                proportion += child.getProportion(rootBlock); 

                let childLinkDensity = child.setLinkDensity();

                if ( !child.hasLink() ||
                    !this.isSimilar (spHeight, firstSpHeight, 0.8 ) ||

                    !this.isSimilar (childLinkDensity, firstLinkDensity, 0.2 ) ||

                    /* the following check is too strict, 
                      || !this.isSimilar(child.blockHeight, firstChildBlock.blockHeight ) */ 
                    !this.isSimilar(child.blockWidth, firstChildBlock.blockWidth, 0.8 ) ) {
                    if ( (j - i ) > max_count ) {
                        max_count = j - i ; 
                        max_start = i; 
                        max_proportion = proportion ; 
                        max_spHeight = firstSpHeight;
                    }
                    i = j ; 
                    break;
                }
            }
        
            if ( j === block.containedVisionBlockList.get_Count()) {
                if ( (j - i ) > max_count ) {
                    max_count = j - i  ; 
                    max_start = i; 
                    max_proportion = proportion ; 
                    max_spHeight = firstSpHeight;
                }
                break;
            }

        }

        // merge those child 
        if ( max_count > 3 && max_proportion > proportionThreshold) {
            let firstChildBlock = block.getBlockByIndex(max_start );
            let stopChildBlock = null;
            if ( max_start + max_count < block.containedVisionBlockList.get_Count() ) {
                stopChildBlock = block.getBlockByIndex(max_start + max_count );
            } 

            //while ( j < max_start + max_count ) {
            while(firstChildBlock.downSplitter ) {
                let sp = firstChildBlock.downSplitter;
                if ( sp === null) { 
			break; 
		}

                let downBlock = block.nodeIsInVisionBlock(sp.rightButtomBlock);
		if ( downBlock === stopChildBlock) { 
			break;
		}

                if (!block.mergeBlockBetweenHorizontalSp(sp, 
			(max_spHeight > 0 ) ?  max_spHeight * 1.2 : 10 ) ) {
                    break;
                }
            }

            //bugfix
            if (firstChildBlock.isInVerticalCenter(rootBlock ) || 
		firstChildBlock.isInVerticalTop(rootBlock) )  {
               console.log("searchMainLinksBlock, return firstChildBlock" ); 
               return firstChildBlock;
            } 
        }
    }
			
    console.log("searchMainLinksBlock, return null" ); 
    return null;
};

 /**
   * Get the article title as an H1.
   *
   * @return void
   **/
Article.prototype.getArticleTitle = function() {
    var doc = this._doc;
    var curTitle = "";
    var origTitle = "";

    try {
      curTitle = origTitle = doc.title;

      // If they had an element with id "title" in their HTML
      if (typeof curTitle !== "string") {
        //this._getInnerText(doc.getElementsByTagName('title')[0]);
        var element = doc.getElementsByTagName('title')[0];  
        if(element != null ) {
          curTitle = origTitle = element.textContent.trim(); 
        }
      }
    } catch (e) {/* ignore exceptions setting the title. */}


    if (curTitle.match(/[\|\-_:]/)) {
      var match = 0;
      var max_length = 0; 
      var max_start = -1 ;

      var headings = this.concatNodeLists(
        doc.getElementsByTagName('h1'), doc.getElementsByTagName('h2'),
        doc.getElementsByTagName('H1'), doc.getElementsByTagName('H2'),
        doc.getElementsByClassName('title')
      );

      for (var j = 0 ; j <headings.length ; j++) {
        var heading = headings[j];
        var headingText = heading.textContent.trim(); 
        var length = headingText.length;
 
        var start = curTitle.indexOf( headingText );
        if ( start >= 0 ) {
          if ( length > max_length ) {
              max_length = length;
              max_start = start ;
              match = 1;
          }
        }
      }

      // If we don't, let's extract the title out of the original title string.
      if (match) {
        if (max_start + max_length < curTitle.length) { 
          curTitle = origTitle.substring(max_start, max_start + max_length );
        }
      }else{
        curTitle = origTitle.replace(/([^\|\-_:]*)[\|\-_:].*/gi, '$1');
        if ( curTitle.length < 4 ) {
          curTitle = origTitle.replace(/[^\|\-_:]*[\|\-_:](.*)/gi, '$1');
        }
      }
    }

    else if (curTitle.length > 150 || curTitle.length < 15) {
      var hOnes = doc.getElementsByTagName('h1');

      if (hOnes.length === 1) {
        curTitle = hOnes[0].textContent ;
      }
    }


    curTitle = curTitle.trim();
    if (curTitle.length <= 4) {
      curTitle = origTitle;
    }

    return curTitle;
};


Article.prototype.getTitleElement = function() {
    var result = null;
    if ( this._titleBlock != null ) {
        for ( var i=0; i< this._titleBlock.containedHTMLNodeList.get_Count(); i++ ) {
            var node = this._titleBlock.containedHTMLNodeList.get_Item$$Int32(i);
            result = this.getNearestCommonParent(result, node.htmlElement, this._doc.body);
        }    
    }
    return result;
};

Article.prototype.getTitleProbality = function() {
    return 1.0;
};


Article.prototype.getTitleBlock = function() {
    return this._titleBlock;
};


Article.prototype.setTitleBlock = function ( block ) {
    this._titleBlock = block;
};

/**
* Concat all nodelists passed as arguments.
*
* @return ...NodeList
* @return Array
*/
Article.prototype.concatNodeLists = function() {
    var slice = Array.prototype.slice;
    var args = slice.call(arguments);
    var nodeLists = args.map(function(list) {
      return slice.call(list);
    });
    return Array.prototype.concat.apply([], nodeLists);
};


Article.prototype.isTitleElement = function( element, title ) {
    if (element.tagName === 'h1' || 
	element.tagName === 'h2' || 
	element.tagName === 'H1' || 
	element.tagName === 'H2' ) {
           if (element.textContent.indexOf( title ) !== -1 ) {
               return 1;
           }	
    }

    if( element.tagName ==='div' || 
	element.tagName === 'DIV') {
        var className = element.getAttribute("class");
        if (className != null && className.match(/title/) ) {
             if (element.textContent.indexOf(title) !== -1 ) {
                 return 1;
             }	
        }
    }

    return 0;
};


Article.prototype.searchTitleBlock = function( block, title, rootBlock ) {

    console.log("searchTitleBlock, begin...");

    //check this block
    if (block.containedHTMLNodeList.get_Count() === 1 ) {
        let node = block.containedHTMLNodeList.get_Item$$Int32(0);
        let element = node.htmlElement;
        if ( this.isTitleElement(element, title ) ) {
            return block;
        }
    }

    //if not, check html node of current block.
    var match = 0;
    for ( let i = 0; !match && i< block.containedHTMLNodeList.get_Count() ; i++ ) {
        let node = block.containedHTMLNodeList.get_Item$$Int32(i);
        let element = node.htmlElement;
		
        if ( this.isTitleElement(element, title ) ) {
            match = 1; 
            break; 
        }

        var headings = this.concatNodeLists(
            element.getElementsByTagName('h1'), element.getElementsByTagName('h2'),
            element.getElementsByTagName('H1'), element.getElementsByTagName('H2'),

            element.getElementsByClassName('title')
        );

        for (let j = 0 ; j <headings.length ; j++) {
            let heading = headings[j];
            if ( this.isTitleElement(heading, title ) ) {
                match = 1;
                break;
            }
        }
    }

    console.log("searchTitleBlock, match = " , match );

    if (match) {
        if (block.getContainedVisionBlockList().get_Count() === 0 ){
            block.divideThisBlock(rootBlock.blockTop,
                                  rootBlock.blockButtom, 
                                  rootBlock.blockLeft,
                                  rootBlock.blockRight );
        }

        for (let i = 0; i < block.containedVisionBlockList.get_Count(); i++ ) {
            var child = block.containedVisionBlockList.get_Item$$Int32(i);
            let resultBlock =  this.searchTitleBlock(child, title, rootBlock );
            if (resultBlock != null ) {
                console.log("searchTitleBlock, return resultBlock" );
                return resultBlock;
            }
        }	
		
        // if current block can not be devided any more, return this one.
        console.log("searchTitleBlock, return current block" );
        return block;

    }

    console.log("searchTitleBlock, return null" );
    return null;

};

Article.prototype.getNearestCommonParent = function (e1, e2, root) {
    if ( e1 === null ) {
        return e2;
    }
    if ( e2 === null ){
        return e1;
    }
    while (e1 !== root ) {
        if ( e2 === e1 ) {
            return e1;
        } else {
            var tmp = e2;
            while ( tmp !== root ) {
                if ( tmp === e1 ){
                    return e1;
		}
                tmp = tmp.parentNode ;
            }
        }
        e1 = e1.parentNode ;
    }
    return root;
};

Article.prototype.getMainBodyElement = function() {
    var result = null;
    if ( this._mainBodyBlock != null ) {
        for ( var i=0; i< this._mainBodyBlock.containedHTMLNodeList.get_Count(); i++ ) {
            var node = this._mainBodyBlock.containedHTMLNodeList.get_Item$$Int32(i);
            result = this.getNearestCommonParent(result, node.htmlElement, this._doc.body);
        }    
    }
    return result;
};

Article.prototype.getMainBodyProbality = function() {
    return 1.0;
};

Article.prototype.getMainBodyBlock = function() {
    return this._mainBodyBlock; 
};

Article.prototype.setMainBodyBlock = function( block ) {
    this._mainBodyBlock = block; 
};


Article.prototype.searchMainBodyBlock = function ( block, 
		                 rootBlock, titleBlock, proportionThreshold ) {

    console.log("searchMainBodyBlock, begin..." ); 
    if (block.getProportion(rootBlock) > proportionThreshold  ) {

        if (block.getContainedVisionBlockList().get_Count() === 0 ){
            block.divideThisBlock(rootBlock.blockTop, 
                                  rootBlock.blockButtom, 
                                  rootBlock.blockLeft,
                                  rootBlock.blockRight );
        }

        console.log("searchMainBodyBlock, sub block count = " , 
			block.containedVisionBlockList.get_Count()  ); 
        for (let i = 0; i < block.containedVisionBlockList.get_Count(); i++ ) {
            let child = block.containedVisionBlockList.get_Item$$Int32(i);
            let resultBlock =  this.searchMainBodyBlock(child, 
			    rootBlock, titleBlock, proportionThreshold);
            if (resultBlock != null ) {
                return resultBlock;
            }
        }	

        console.log("searchMainBodyBlock, begin search topCandidate" ); 
        var topCandidate = null;
        for ( let i = 0; i < block.containedVisionBlockList.get_Count(); i++ ) {
            let childBlock = block.containedVisionBlockList.get_Item$$Int32(i);

            if (childBlock.hasChildBlock(titleBlock)) {
                continue;
            } 

            let contentScore = childBlock.setContentScore();
            if (!topCandidate || contentScore > topCandidate.getContentScore() ) {
                topCandidate = childBlock;
            }

        }

        if (topCandidate !== null ) {
            console.log("searchMainBodyBlock, found topCandidate" ); 
            let heightThreshold = 0;

            //merge topCandidate with upBlock if necessary 
            while(topCandidate.upSplitter != null ) {
                let sp = topCandidate.upSplitter;
                if ( heightThreshold === 0 ) {
		    heightThreshold = sp.height * 1.5 ;  
		}
                else if ( sp.height > heightThreshold ) {
		    break;
		}
                
                var upBlock = block.nodeIsInVisionBlock(sp.leftUpBlock);
                if ( upBlock.hasChildBlock(titleBlock)) {
		       	break;
		}
                //if ( upBlock.getBgColor() != topCandidate.getBgColor() ) break;
                if ( upBlock.getContentScore() < (topCandidate.getContentScore * 0.3 )) {
			break; 
		}

                if (block.mergeBlockBetweenHorizontalSp(sp, heightThreshold) ) {
                    topCandidate = upBlock;
                } else {
                    break; 
                }
            }

            //then, merge down . 
            while(topCandidate.downSplitter != null ) {
                let sp = topCandidate.downSplitter;
                if ( heightThreshold === 0 ) {
			heightThreshold = sp.height * 1.5 ;  
		}
                else if ( sp.height > heightThreshold ) {
			break;
		}

                let downBlock = block.nodeIsInVisionBlock(sp.rightButtomBlock);
                if ( downBlock.hasChildBlock(titleBlock)) {
		    break;
		}
                //if ( downBlock.getBgColor() != topCandidate.getBgColor() ) break;
                if ( downBlock.getContentScore() < (topCandidate.getContentScore * 0.3 )) {
		    break;
		}

                if ( !block.mergeBlockBetweenHorizontalSp(sp, heightThreshold) ) {
                    break;
                }
            }


            //recheck toCandidate 's  proportion 
	    block.calculateAreaOfBlock(topCandidate);
            let proportion = topCandidate.getProportion(rootBlock);
            if (proportion > proportionThreshold ) {
                console.log("searchMainBodyBlock, return topCandidate" ); 
                return  topCandidate;
            }

            // if topCandidate is not, return null 
            console.log("searchMainBodyBlock, return null" ); 
            return null;

        }

    }
			
    console.log("searchMainBodyBlock, return null" ); 
    return null;
	
};


Article.prototype.getTagsElement = function () {
    var result = null;
    if (this._tagsBlock != null ) {
        for ( var i=0; i< this._tagsBlock.containedHTMLNodeList.get_Count(); i++ ) {
            var node = this._tagsBlock.containedHTMLNodeList.get_Item$$Int32(i);
            result = this.getNearestCommonParent(result, node.htmlElement, this._doc.body);
        }    
    }
    return result;
};

Article.prototype.getTagsProbality = function() {
    return 1.0;
};

Article.prototype.getTagsBlock = function () {
    return this._tagsBlock;
};

Article.prototype.setTagsBlock = function(block) {
    this._tagsBlock = block;
};


Article.prototype._getBlocksFromTitle2Body = function(block,titleBlock,mainBodyBlock,state){

    var result = new VIPSArrayList(); 

    for (let i = 0; i < block.containedVisionBlockList.get_Count(); i++ ) {
        let child = block.containedVisionBlockList.get_Item$$Int32(i);
        if (state === 0 ) {
            if( child === titleBlock ) {
                state = 1; continue;
            }
            let info = this._getBlocksFromTitle2Body(child, titleBlock, mainBodyBlock, state);
            state = info[0]; 
            if(state ===1 ) {
                if (info[1].get_Count() > 0 )  {
                    result.addList(info[1]);
                }
            } else if ( state === 2 ) { 
		    // if everything happens in previous search, just return it. 
                result = info[1];
                break;
            }
        }

        else if( state === 1 ) {
            if ( child === mainBodyBlock ) {
                state = 2; break;
            }

            let info =  this._getBlocksFromTitle2Body(child, titleBlock, mainBodyBlock, state);
            state = info[0]; 

            if (state === 1 ) {
                result.add(child);
            } else if (state ===2 )  {
                if (info[1].get_Count() > 0 ) {
		    result.addList(info[1]); 
                }
                break;
            }
        }
    }

    return [state,result];

};

Article.prototype.getBlocksFromTitle2Body = function ( rootBlock, titleBlock, mainBodyBlock ) {
    var result = new VIPSArrayList();
    var info = this._getBlocksFromTitle2Body(rootBlock, titleBlock, mainBodyBlock, 0 ) ;
    if ( info[0] === 2 ) {
        return  info[1];
    } else { 
        return result;
    }
};


Article.prototype._searchTagsBlock = function (block, rootBlock) {

    if (block.containedVisionBlockList.get_Count() === 0 ){
        block.divideThisBlock(rootBlock.blockTop,
                              rootBlock.blockButtom, 
                              rootBlock.blockLeft, 
                              rootBlock.blockRight );
    }

    for (let i = 0; i < block.containedVisionBlockList.get_Count(); i++ ) {
        var child = block.containedVisionBlockList.get_Item$$Int32(i);
        var resultBlock =  this._searchTagsBlock( child, rootBlock );
        if (resultBlock != null ) {
            return resultBlock;
        }
    }	

    var matchScore = 0.0 ;
    for ( let i = 0; i< block.containedHTMLNodeList.get_Count() ; i++ ) {
        let node = block.containedHTMLNodeList.get_Item$$Int32(i);
        let element = node.htmlElement;

        //var allLinks = element.getElementsByTagName('a');
        var allLinks= this.concatNodeLists(
            element.getElementsByTagName('a'), element.getElementsByTagName('A')
        );

        for (let j = 0, jl = allLinks.length; j < jl; j += 1) {
            //let link = allLinks[j];
            let linkHref = allLinks[j].href.replace(/#.*$/, '').replace(/\/$/, '');
            //add keyword
            if ( linkHref.match(/tag|key/) ) {
                matchScore += 1.0 ;
            }

            var className = allLinks[j].getAttribute("class");
            if (className != null && className.match(/tag|key/) ) {
                matchScore += 1.0 ;
            }
        }
    }

    return (matchScore >= 2.0 ) ? block : null;

};

Article.prototype.searchTagsBlock = function ( candidateBlocks, rootBlock ) {
    if ( candidateBlocks.get_Count() > 0 ) {
        for (var i = 0 ; i < candidateBlocks.get_Count(); i++ ) {
            var tagsBlock = this._searchTagsBlock( candidateBlocks.get_Item$$Int32(i), rootBlock );
            if ( tagsBlock != null ) {
                return tagsBlock;
            }
        }
    }
    return null;
};

Article.prototype._getBlocksAfterMainBody = function ( block, mainBodyBlock, state ) {

    var result = new VIPSArrayList(); 

    for (var i = 0; i < block.containedVisionBlockList.get_Count(); i++ ) {
        var child = block.containedVisionBlockList.get_Item$$Int32(i);
        if (state === 0 ) {
            if( child === mainBodyBlock ) {
                state = 1; 
                continue;
            }
            var info = this._getBlocksAfterMainBody(child, mainBodyBlock, state );
            state = info[0]; 
            if(state ===1 ) {
                result = info[1];
            } 
        }

        else if( state === 1 ) {
            result.add(child);
        }

    }

    return [state,result ];

};

Article.prototype.getBlocksAfterMainBody = function ( block, mainBodyBlock ) {
    var result = new VIPSArrayList();
    var info = this._getBlocksAfterMainBody( block, mainBodyBlock, 0 ) ;
    if ( info[0] === 1 ) {
        result = info[1];
        if (result.get_Count() > 2  ) { // get two nodes from beginning only. 
            for (var i = result.get_Count() - 1; i >= 2; i--) {
                result.remove(i);
            }
        }
    } 
    return result;
};

Article.prototype.getDateElement = function () {
    var result = null;
    if (this._dateBlock != null ) {
        for ( var i=0; i< this._dateBlock.containedHTMLNodeList.get_Count(); i++ ) {
            var node = this._dateBlock.containedHTMLNodeList.get_Item$$Int32(i);
            result = this.getNearestCommonParent(result, node.htmlElement, this._doc.body);
        }
    }    
    return result;
};

Article.prototype.getDateProbality = function() {
    return 1.0;
};

Article.prototype.getDateBlock = function () {
    return this._dateBlock;
};

Article.prototype.setDateBlock = function (block) {
    this._dateBlock = block;
};

Article.prototype.isDate = function(date) {
    //return date && (!(new Date(date) === "Invalid Date") && !isNaN(new Date(date)));
    return date && ((new Date(date) !== "Invalid Date") && !isNaN(new Date(date)));
};

Article.prototype.hasDate = function(input){
    var regex=new RegExp(
		    ['([0-9]{4}[.\/-](0?[1-9]|1[0-2])[.\/-]([0-2]{1}[0-9]{1}|3[0-1]{1}))',
		    '([0-9]{4}年([1-9]|1[0-2])月([0-2]{1}[0-9]{1}|3[0-1]{1})日)',
		    '(([1-9]|1[0-2])月([0-2]{1}[0-9]{1}|3[0-1]{1})日)',
		    '(([0-2]{1}[0-9]{1}|3[0-1]{1})[.\/-](0?[1-9]|1[0-2])[.\/-][0-9]{4})'
		    ].join('|'));
    return regex.test(input);
};

Article.prototype._searchDateBlock = function ( block, rootBlock ) {
    if (block.containedVisionBlockList.get_Count() === 0 ){
        block.divideThisBlock(rootBlock.blockTop,
                              rootBlock.blockButtom, 
                              rootBlock.blockLeft,
                              rootBlock.blockRight );
    }

    for (let i = 0; i < block.containedVisionBlockList.get_Count(); i++ ) {
        var child = block.containedVisionBlockList.get_Item$$Int32(i);
        var resultBlock =  this._searchDateBlock( child , rootBlock);
        if (resultBlock != null ) {
            return resultBlock;
        }
    }	

    for ( let i = 0; i< block.containedHTMLNodeList.get_Count() ; i++ ) {
        var node = block.containedHTMLNodeList.get_Item$$Int32(i);
        var element = node.htmlElement;

        if ( element.tagName === 'span' || 
		element.tagName === 'SPAN' || 
			element.tagName === 'time' || 
			element.tagName === 'TIME' || 
		element.tagName === 'abbr' || 
		element.tagName === 'ABBR' || 
			element.tagName === 'div' || 
			element.tagName === 'DIV' ) {
            if (this.hasDate(element.textContent)) {
                return block; 
            }
        }

        //var allLinks = element.getElementsByTagName('span');
        var allLinks= this.concatNodeLists(
            element.getElementsByTagName('span'), 
	    element.getElementsByTagName('SPAN'),
            element.getElementsByTagName('time'), 
		    element.getElementsByTagName('TIME'),
		    element.getElementsByTagName('abbr'), 
	    element.getElementsByTagName('ABBR'),
            element.getElementsByTagName('div'), 
	    	element.getElementsByTagName('DIV')
        );

        for (let j = 0, jl = allLinks.length; j < jl; j += 1) {
            if ( this.hasDate( allLinks[j].textContent) )  {
                return block; 
            }
        }
    }

    return null;
};


Article.prototype.searchDateBlock = function ( candidateBlocks, rootBlock ) {
    if ( candidateBlocks.get_Count() > 0 ) {
        for (var i = 0 ; i < candidateBlocks.get_Count(); i++ ) {
            var dateBlock = this._searchDateBlock( candidateBlocks.get_Item$$Int32(i), rootBlock );
            if ( dateBlock != null ) {
                return dateBlock;
            }
        }
    }
    return null;
};

Article.prototype.parse_links = function () {

    var node = new CHTMLNode(this._doc.body);
    var rootBlock = new VisionBlock();
    rootBlock.convertFromNode(node);
    rootBlock.addContainedHTMLNode(node);
    rootBlock.DOC=1;

    var mainLinksBlock = this.searchMainLinksBlock(rootBlock, rootBlock, 0.15 );
    if (mainLinksBlock != null) {
        console.log("mainLinksBlock found!");
	this.setMainLinksBlock(mainLinksBlock);
        return "links";
    }

    return "others";

};

Article.prototype.parse_item = function () {

    var node = new CHTMLNode(this._doc.body);
    var rootBlock = new VisionBlock();
    rootBlock.convertFromNode(node);
    rootBlock.addContainedHTMLNode(node);
    rootBlock.DOC=1;

    var title = this.getArticleTitle();
    console.log("title is ", title );

    var titleBlock = this.searchTitleBlock(rootBlock, title, rootBlock );
    this.setTitleBlock(titleBlock);
    if ( titleBlock != null ) {
        console.log("titleBlock found!");
    }

    //change 0.20 => 0.15
    var mainBodyBlock = this.searchMainBodyBlock(rootBlock, rootBlock, titleBlock, 0.15 ) ;
    this.setMainBodyBlock(mainBodyBlock);
    if ( mainBodyBlock != null ) {
        console.log("mainBodyBlock found!");
    }

    if (titleBlock != null && mainBodyBlock != null) {
        var dateBlock = null;
        var tagsBlock = null;
        //var authrBlock = null;

        var blocksFromTitle2Body = this.getBlocksFromTitle2Body(rootBlock, 
			                                        titleBlock, mainBodyBlock);
        if ( blocksFromTitle2Body.get_Count() > 0 ) {
            dateBlock = this.searchDateBlock( blocksFromTitle2Body, rootBlock );
            tagsBlock = this.searchTagsBlock( blocksFromTitle2Body, rootBlock );
        }

        if ( tagsBlock === null ) {
            var blocksAfterMainBody = this.getBlocksAfterMainBody(rootBlock, mainBodyBlock);
            if (blocksAfterMainBody.get_Count() > 0  ) {
                tagsBlock = this.searchTagsBlock(blocksAfterMainBody, rootBlock);
            }
        }

	if (dateBlock != null ) {
            console.log("dateBlock found!");
	    this.setDateBlock(dateBlock);
        }

	if (tagsBlock != null) {
            console.log("tagsBlock found!");
	    this.setTagsBlock(tagsBlock);
        }

	return "article";
    }

    return "others";

};

