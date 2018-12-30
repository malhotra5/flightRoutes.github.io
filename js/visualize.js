var map;

var centerLat = 0;
var centerLon = 0;

var ww = 1280;
var hh = 800;

var zoom = 1;
//37.7749° N, 122.4194° W san fransicso coords
var exY = 133.7751;
var exX = -25.2744;

var lats;

var airInfoDict;
var centerCord;

var cordinates = [];
var x;
var y;
var sources;
//Load pre-req imgmLongs, audio, data, etcsss
function preload() {
    airInfo = loadTable("data/airport.txt", ".csv", "header");
    routeInfo = loadTable("data/routes.txt", ".csv", "header");

    //map style/static/xcord,ycord,zoomLevel,axistilt,axistilt/mapXsize x mapYsize
    map = loadImage("https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/-" + centerLon + "," + centerLat + "," + zoom + ",0,0/" + ww + "x" + hh + "?access_token=pk.eyJ1IjoibWFsaG90cmE1IiwiYSI6ImNqcWEyOGQ3ZDBlYTkzeG1uOGNhNTdiOHQifQ.EUcDvnfoZXCECjIsTgZ1BQ");
}

function setup() {
    createCanvas(ww, hh);
    image(map, 0, 0);

    centerCord = getCord(centerLon, centerLat);
    /*cords = getCord(exY, exX);
    cords[0] = cords[0] - centerCord[0];
    cords[1] = cords[1] - centerCord[1];
    fill(255, 255, 255);
    ellipse(cords[0], cords[1], 20, 20);
    */

    airInfoDict = createDict(airInfo);
    createCartesianCords(airInfoDict, centerCord);
    sources = getPaths();

    translate(width / 2, height / 2);
    imageMode(CENTER);
    fill(155, 230, 230);
    for (i = 0; i < cordinates.length; i++) {
        ellipse(cordinates[i][0], cordinates[i][1], 5, 5);
    }
}

function draw() {
    /*//Example dict -  {
        SFO: [-122.4194, 37.7749],
        AUS: [133.7751, -25.2744]
    }*/

    translate(width / 2, height / 2);
    imageMode(CENTER);  
    createArcs(sources, airInfoDict);

}

/////////////Data creation functions/////////////


//Compilation of the 2 functions below
function getCord(long, latit) {
    return [mercX(long), mercY(latit)];
}

//Help find X cord using longitude of a place
function mercX(lon) {
    lon = radians(lon);
    var a = (256 / PI) * pow(2, zoom);
    var b = lon + PI;
    return a * b;
}

//Help find Y cord using latitude of a place
function mercY(lat) {
    lat = radians(lat);
    var a = (256 / PI) * pow(2, zoom);
    var b = tan(PI / 4 + lat / 2);
    var c = PI - log(b);
    return a * c;
}

//Getting list of routes: consists of SourceAirport and DestinationAirport
function getPaths() {
    source = routeInfo.getColumn('SourceAirport');
    destination = routeInfo.getColumn('DestinationAirport');
    return [source, destination];
}



//Get airport IATA and geographical coordinates from Airport data file, create a dictionary with key as IATA, and value as cordinates
function getIATA() {
    return airInfo.getColumn('IATA');
}

function getGeoCordLONG() {
    return airInfo.getColumn('Longitude');
}

function getGeoCordLAT() {
    return airInfo.getColumn('Latitude');
}

function createDict() {
    var codes = getIATA();
    var la = getGeoCordLAT();
    var lo = getGeoCordLONG();


    var airportDict = {}

    for (i = 0; i < codes.length; i++) {
        airportDict[codes[i]] = [lo[i], la[i]];
    }


    return airportDict;
}




/////////////Drawing functions/////////////

//Gets cartesian cordinates for airports
function createCartesianCords(infoDict, cCord) {
    for (var key in infoDict) {
        var val = infoDict[key];
        var cords = getCord(val[0], val[1]);
        cords[0] = cords[0] - cCord[0];
        cords[1] = cords[1] - cCord[1];
        cordinates.push(cords);
    }

    return cordinates;
}

//Creates pathways from one Airport to another
function createArcs(source, dict) {
    var corS = [];
    var corD = [];

    for (i = 0; i < source[0].length; i++) {
        var start = source[0][i];
        var dest = source[1][i];
        if (start in dict && dest in dict) {
            var startCords = dict[start];
            var destCords = dict[dest];
            corS.push(startCords);
            corD.push(destCords);
        }
    }

    print(source[170]);

    for (i = 0; i < corS.length; i++) {

        stroke(23, 152, 123);
        line(corS[i][0], corS[i][1], corD[i][0], corD[i][1]);
        //(cor[0][i][0]+ cor[1][i][0])/2, (cor[0][i][1]+ cor[1][i][1])/2,
    }

}






/*
//Important functions
//count the columns
print(airInfo.getRowCount() + ' total rows in table');
print(airInfo.getColumnCount() + ' total columns in table');

print(airInfo.getColumn('AirportID'));
//["Goat", "Leopard", "Zebra"]

//cycle through the table
for (var r = 0; r < table.getRowCount(); r++)
    for (var c = 0; c < table.getColumnCount(); c++) {
        print(table.getString(r, c));
    }

*/
