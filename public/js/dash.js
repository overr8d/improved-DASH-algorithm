

// Initiates global objects, buffer and starts downloading first segment
function dashHTTP(){
    MPD= mpdObjectConstructor(JSON);
    REPLIST= (function(){
        var repList= new Array();
        for(var i=0; i<MPD.representationList.length; i++){
            repList.push(MPD.representationList[i]);
        }
        return repList;
    })();
    REPBWLIST= (function(){
        var repBwList= new Array();
        for(var i=0; i<MPD.representationList.length;i++){
            repBwList.push(MPD.representationList[i].bandwidth);
        }
        return repBwList;
    })();
    SEGMENTLIST=REPLIST[0].segmentList;

    BUFFER= new mediaBuffer();
    BUFFER.initBuffer(16,2,2,6,12);
    initialDownload();
}
// Keeps downloading MPD segments
function download(){
    loadSegment(MPD.baseURL,function(bps, data){
        BUFFER.add(data);
        console.log(bps);
        console.log(bandwidthEstimation(bps));
        document.getElementById("bps").innerHTML= bandwidthEstimation(bps);
        document.getElementById("identifier").innerHTML=identifierGetter();
    });
}

// Initialize downloading first video segment
function initialDownload(){
    initiateLoadSegment(MPD.baseURL,function(data){
        BUFFER.add(data);
    })
}

// Initialize playing out
function initiatePlayOut(){
    if(BUFFER.fillState>=2){
        drainAndNotify();
        setInterval(drainAndNotify,1000);
    }
    else{
        setTimeout(initiatePlayOut,500);
    }
}

// Invokes drain function and logs fill state
function drainAndNotify(){
    BUFFER.drain();
    console.log("1s drained, Fill state: "+BUFFER.fillState);
}
