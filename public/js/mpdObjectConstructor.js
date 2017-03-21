

// Constructs mpd object that represents mpd file and it's node elements
var mpd= new MpdBuilder();
function MpdBuilder(){
    this.representationList= new Array();
    this.baseURL=null;
}

// Constructs segment object
function SegmentBuilder(){
    this.media = null;
    this.size = null;
}

// Constructs representation object
function RepresentationBuilder(){
    this.id = null;
    this.codecs = null;
    this.mimeType = null;
    this.width = null;
    this.height = null;
    this.bandwidth = null;
    this.initialization = null;
    this.segmentList= new Array();
}


// Sets URL and representation values to mpd object
function mpdObjectConstructor(json){
    mpd.baseURL=json.MPD.BaseURL["#text"];
    setRepresentation(json.MPD.Period.AdaptationSet.Representation);

    return mpd;
}
// Loops through representation list, creates new representation objects 
function setRepresentation(rep){
    var representation= new RepresentationBuilder();
    for(var i=0; i< rep.length; i++){
        representation.id = rep[i]["@attributes"].id;
        representation.codecs = rep[i]["@attributes"].codecs;
        representation.mimeType = rep[i]["@attributes"].mimeType;
        representation.width = rep[i]["@attributes"].width;
        representation.height = rep[i]["@attributes"].height;
        representation.bandwidth = rep[i]["@attributes"].bandwidth;
        representation.initialization = rep[i].SegmentBase.Initialization["@attributes"].sourceURL;
        representation.segmentList= setSegmentURL(rep[i].SegmentList);
        mpd.representationList.push(representation);
        representation = new RepresentationBuilder();
    }
}
// Creates segmentList and fills with representative segment objects
function setSegmentURL(rep2){
    var segment= new SegmentBuilder();
    var segmentList= new Array();
    for(var i=0; i<rep2.SegmentURL.length;i++){
        segment.media= rep2.SegmentURL[i]["@attributes"].media;
        segment.size = rep2.SegmentURL[i]["@attributes"].size;
        segmentList.push(segment);
        segment=new SegmentBuilder();
    }
    return segmentList;
}