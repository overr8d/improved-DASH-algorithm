
// Buffer constructor that holds video segments
function mediaBuffer(){
    this.fillState=0;
    this.bufferSize=0;
    this.initialState=0;
    this.alfaState=0;
    this.betaState=0;

    this.buffer= new Object();
    this.buffer.array= new Array();
    this.buffer.first=0;
    this.buffer.last=0;
    this.buffer.size=0;
    this.streamReadyToStart= false;
    this.streamEnded=false;
    this.underRunOccured= false;
}

// Initiate buffer with given parameters
mediaBuffer.prototype.initBuffer= function(bufferSize, segmentSize, initialState, alfaState, betaState ){
    this.bufferSize=bufferSize;
    this.buffer.size= bufferSize/segmentSize;
    this.initialState= initialState;
    this.alfaState= alfaState;
    this.betaState= betaState;
    for(var i=0; i<this.buffer.size; i++){
        this.buffer.array[i]=new Object();
    }
}

// Emulates video playout, plays 1s long video each time invoked
mediaBuffer.prototype.drain= function(){
    if(this.fillState==0 && this.streamEnded) return -1;

    if(this.fillState < this.bufferSize && this.streamEnded== false){
        if(this.fillState > 0 && this.underRunOccured == false){
            this.fillState -= 1;
        }
        else if(this.underRunOccured == false){
            console.log("Warning!, Buffer is underrun!!");
            this.underRunOccured == true;
        }
    }
    else{
        this.underRunOccured = false;
        this.fillState -= 1;
    }
}

mediaBuffer.prototype.get= function(){
    console.log("Getting chunk: "+this.buffer.first % this.buffer.size);
    console.log("Fill state: "+this.fillState);
    return this.buffer.array[this.buffer.first++ % this.buffer.size];
}
// Returns fill state of the buffer
mediaBuffer.prototype.fillState= function(){
    return this.fillState;
}
// Adds a video segment to the buffer 
mediaBuffer.prototype.add= function(data){
    if(this.fillState==this.bufferSize && this.streamEnded) return -1;
    this.fillState+= 2;
    console.log("Fill state: "+this.fillState);
    this.buffer.array[this.buffer.last++ % this.buffer.size]= data;
}
