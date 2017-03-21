var bw= new bandwidth();

// Bandwidth constructor
function bandwidth(){
    
    this.bps;
    this.observers= new Array();
    this.observer_num=0;
    this.identifier=0;  
}

// Estimates bandwidth, when initialized, adapts to network condition fully, 
// then calculates cumulative estimation by multiplying actual cumulative value with 
// 0.875 and bandwidth value with 0.15 and add them up
function bandwidthEstimation(bandwidth){
    if(bw.identifier==0){
        bw.bps = bandwidth;
        BPS=bw.bps;
        bw.identifier++;
    }
    else{
        bw.bps = 0.875*bw.bps + 0.125*bandwidth;
        BPS=bw.bps;
        bw.identifier++;
    }
    return bw.bps;
}
// Simple getter function for identifier property.
function identifierGetter(){
    return bw.identifier;
}



