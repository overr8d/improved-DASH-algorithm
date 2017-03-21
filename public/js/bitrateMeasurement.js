
// Initialize parameters
var __id = new Array();
measurement = new Object();
measurement.startTimeMeasure = 0;
measurement.endTimeMeasure = 0;

// Starts timer required for Bitrate calculation
function beginBitrateMeasurement(){
    measurement.startTimeMeasure =new Date().getTime();
}

// Ends timer required for bitrate calculation and returns bitrate value
function endBitrateMeasurement(lengthInBytes){
    measurement.endTimeMeasure =new Date().getTime();
    return ((lengthInBytes*8)/(measurement.endTimeMeasure - measurement.startTimeMeasure))*1000;
}

// Timer functions to calculate id specific bitrate values
function beginBitrateMeasurementByID(id){
    __id[id]=new Date().getTime();
}

function endBitrateMeasurementByID(id, lengthInBytes){
    end = new Date().getTime();
    return ((lengthInBytes*8)/(end - __id[id]))*1000;
}