

// Returns the best representation possible considering the level of bufferOccupancy and currentBandwidth 
function segmentComparison(segmentNumber, currentBandwidth,bufferOccupancy){

    var array= new Array();
    var segment= new Object();
    for(var i=0; i<6; i++){
        segment.index=i;
        segment.size= segmentListPicker(i,segmentNumber);
        array.push(segment);
        segment={};
    }
    var representation=0;
    while(currentBandwidth*(bufferOccupancy-BUFFER.initialState)/8 > array[representation].size){
        representation++;
        if(representation>5){
            representation=5;
            break;
        }
    }
    return representation;
    // Scans through the MPD file and spot the segmentSize
    function segmentListPicker(index,segmentNumber){
        if(index > 5) return -1;
        var segmentSize= REPLIST[index].segmentList[segmentNumber].size;
        return sizeRecognition(segmentSize);
    }
    // Does the basic K and M convertion to facilitate comparison 
    function sizeRecognition(segmentSize){
        var rest;
        var int;
        if(segmentSize.indexOf("K") > -1){
            rest= segmentSize.slice(0,3);
            int=  parseInt(rest);
            return int*1000;
        }
        else if(segmentSize.indexOf("M") > -1){
            rest= segmentSize.slice(0,3);
            int=  parseFloat(rest);
            return int*1000000;
        }
        else {}
    }
}
// Finds the best quality of representation under given bps value
function representationComparison(bps){
    var i=0;
    while(REPBWLIST[i]< bps*1.2){
        i++;
    }
    if(i>REPBWLIST.length-1){
        return REPBWLIST.length-1;
    }
    else return i;
}


