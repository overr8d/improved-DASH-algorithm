
// Loads XML doc and parse elements before requesting segments 
function loadXMLDoc(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            xmlParser(xhttp);
        }
    };
    xhttp.open("GET", "http://localhost:3000/", true);
    xhttp.send();
}

// Parse XML elements and converts to JSON objects 
function xmlParser(xml){
    var parser= new DOMParser();
    var xml= parser.parseFromString(xml.responseText,"text/xml");
    JSON= xmlToJson(xml);
}

// Downloads the rest of the segments in async fashion
function loadSegment(url,callback){
    if(BUFFER.fillState>=BUFFER.bufferSize){
        console.log("Buffer Full, waiting to be drained.");
        setTimeout(download,4000);
    }
    else{
        var xhttp= new XMLHttpRequest();
        xhttp.onreadystatechange= function(){
        if(xhttp.readyState== 4 && xhttp.status==200){
            var len= xhttp.response.length;
            var bps= endBitrateMeasurement(len);
            callback(bps, new Uint8Array(xhttp.response));
            loadSegment(url, callback);
        }
    }
    if(BUFFER.fillState > BUFFER.initialState && BUFFER.fillState <= BUFFER.alfaState){
            SEGMENTLIST=REPLIST[segmentComparison(SEGMENT,BPS,BUFFER.fillState)].segmentList;
    }
    else if(BUFFER.fillState > BUFFER.alfaState && BUFFER.fillState <= BUFFER.betaState){
            SEGMENTLIST=REPLIST[representationComparison(BPS)].segmentList;
    }
    xhttp.open("GET",url+SEGMENTLIST[SEGMENT].media,true);
        console.log(SEGMENTLIST[SEGMENT].media);
    xhttp.send();
    beginBitrateMeasurement();
    SEGMENT++;
}

}

// Downloads first segment in asnyc fashion
function initiateLoadSegment(url, callback){
    var xhttp= new XMLHttpRequest();
    xhttp.onreadystatechange= function(){
        if(xhttp.readyState== 4 && xhttp.status==200){
            callback(new Uint8Array(xhttp.response));
            download();
        }
    };
    xhttp.open("GET",url+MPD.representationList[0].initialization,true);
    console.log(MPD.representationList[0].initialization);
    xhttp.send();
}



