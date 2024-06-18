

let dimensions = {
    standartScreenWidth: 1280,
    scalar: 1,
    // coordinates for map areas sorted as [scene][cut][area]
    sceneCutArea: [
[ [ [620,453,641,424,677,416,685,453,657,466] ] ],
[ [ [483,110,513,144,505,194,462,194,459,157],[676,717,540,694,595,643,718,661,710,706],[604,120,565,422,729,411,694,286,741,141] ] , [ [1040,0,1029,226,1112,336,1116,245,1092,14],[682,0,671,19,704,41,726,27,741,0],[519,401,607,469,784,414,604,385,550,258],[24,501,225,719,510,574,445,490,299,425] ] , [ [346,249,571,272,547,350,420,319,341,289],[635,467,600,591,734,623,788,587,673,469],[764,420,762,477,893,480,905,425,821,410] ] ],
[ [ [865,482,784,528,842,550,924,509],[827,342,779,336,744,402,812,417,838,383],[360,37,378,311,516,309,568,181,550,95] ] , [ [303,228,247,269,300,313,344,288,355,255] ] , [ [366,397,363,460,391,476,403,441,391,389] ] ],
[ [ [421,404,482,394,477,315,439,313,418,358],[832,238,799,339,824,358,859,321,862,262],[261,220,127,451,243,580,396,534,414,257],[453,244,504,385,668,604,715,477,628,219],[761,231,717,529,953,523,948,227,797,392] ] ]
]
}

// adjust hotspot map to image size
window.addEventListener('resize', function(){
    if ( localStorage.getItem("dimensinScalar") !== image.width / dimensions.standartScreenWidth ){
        adjustMap();
    }
});

let mapTotalPoints = new Array();

let video = document.querySelector( "#video" );
let image = document.querySelector( "#image" );
let hotspots = document.querySelectorAll( ".hotspots" );
let hotspot = document.querySelector("#hotspot-1");
let hotspot2 = document.querySelector("#hotspot-2");
let hotspot3 = document.querySelector("#hotspot-3");
let hotspot4 = document.querySelector("#hotspot-4");
let hotspot5 = document.querySelector("#hotspot-5");

// Scene and Snippet number
let sceneNum = 0;
let cutNum = 0;
// Start at this video when refreshing page
video.src = `assets/videos/scene-${ sceneNum }-snippet-${ cutNum }.mp4`;

video.onended = quiz;

// start hotspot quiz
async function quiz(){
    console.log(sceneNum, cutNum);

    // if at end of scene 0
    if ( sceneNum === 0 && cutNum === 1 ){
        sceneNum = 1;
        cutNum = 0;
        await updateSceneAndCut(sceneNum, cutNum);
        nextVideo();
    }

    // If currently in scene 1 or 2 and not at the last snippet
    else if ( ( sceneNum === 0 || sceneNum === 1 || sceneNum === 2 ) && cutNum < 3 ){
        
        // Hide video and show Screenshot
        video.classList.add( "hide" );
        image.src = `assets/images/scene-${ sceneNum }-snapshot-${ cutNum }.png`;
        image.classList.remove( "hide" );

        // create map of hotspot areas
        await updateSceneAndCut(sceneNum, cutNum);
        await adjustMap();

        // Next snippet
        cutNum++;
        document.onkeydown = nextVideo;
    }

    // If at the end of scene 1 or 2
    else if ( cutNum >= 3 ){
        sceneNum++;
        cutNum = 0;

        await updateSceneAndCut(sceneNum, cutNum);
        nextVideo();
    }

    // if at scene 3 (last video snippet)
    else{
        // Hide video and show Screenshot
        video.classList.add( "hide" );
        image.src = `assets/images/scene-${ 3 }-snapshot-${ 0 }.png`;
        image.classList.remove( "hide" );

        // create map of hotspot areas
        await updateSceneAndCut(sceneNum, cutNum);
        await adjustMap();

        // show end picture
        document.onkeydown = function(){
            image.src = "assets/images/end-pic.JPG";
        }
    }

}

// play next video
function nextVideo(){
        // Show points in DOM
    document.querySelector("#headline").textContent += mapTotalPoints.reduce((acc,c) => acc + c , 0);
    mapTotalPoints = [];
        // Hide Screenshot and show Next Video
    image.classList.add( "hide" );
    video.src = `assets/videos/scene-${ sceneNum }-snippet-${ cutNum }.mp4`;
    video.classList.remove( "hide" );

    video.play();
    video.onended = quiz;
}

// Adjust the map and add click event
async function adjustMap(){
        // Array to store one point for each spot
    mapTotalPoints = [];
        // set local storage scalar to current scalar to account for resizing
    localStorage.setItem("dimensionScalar", image.width / dimensions.standartScreenWidth);
        // set needed variables
    let sceneNum = localStorage.getItem("sceneNum");
    let cutNum = localStorage.getItem("cutNum");
    let scalar = localStorage.getItem("dimensionScalar");

    // loop through amount of spots, add them to current map and add click event for each spot
    for ( spot = 0; spot < dimensions.sceneCutArea[sceneNum][cutNum].length; spot++ ){
            // set hotspot coordinates
        hotspots[spot].coords = `${scalar * dimensions.sceneCutArea[sceneNum][cutNum][spot][0]},
                                 ${scalar * dimensions.sceneCutArea[sceneNum][cutNum][spot][1]},
                                 ${scalar * dimensions.sceneCutArea[sceneNum][cutNum][spot][2]},
                                 ${scalar * dimensions.sceneCutArea[sceneNum][cutNum][spot][3]},
                                 ${scalar * dimensions.sceneCutArea[sceneNum][cutNum][spot][4]},
                                 ${scalar * dimensions.sceneCutArea[sceneNum][cutNum][spot][5]},
                                 ${scalar * dimensions.sceneCutArea[sceneNum][cutNum][spot][6]},
                                 ${scalar * dimensions.sceneCutArea[sceneNum][cutNum][spot][7]},
                                 ${scalar * dimensions.sceneCutArea[sceneNum][cutNum][spot][8]},
                                 ${scalar * dimensions.sceneCutArea[sceneNum][cutNum][spot][9]}`
        
        // make space in array for points
        mapTotalPoints.push(0);
    }

    // click function for each hotspot
    hotspot.onclick = function(event){
        event.preventDefault();
        clicking(0);
        hotspot.style.border = "thick solid #0000FF";
    }
    hotspot2.onclick = function(event){
        event.preventDefault();
        clicking(1);
        hotspot2.style.border = "thick solid #0000FF";
    }
    hotspot3.onclick = function(event){
        event.preventDefault();
        clicking(2);
        hotspot3.style.border = "thick solid #0000FF";
    }
    hotspot4.onclick = function(event){
        event.preventDefault();
        clicking(3);
        hotspot4.style.border = "thick solid #0000FF";
    }
    hotspot5.onclick = function(event){
        event.preventDefault();
        clicking(4);
        hotspot5.style.border = "thick solid #0000FF";
    }

    function clicking(num){
        mapTotalPoints[num] = 1;
        console.log(mapTotalPoints);
        alert("test");
    }
}

async function checkSize(){
    // check if image is different size
    if ( localStorage.getItem("dimensinScalar") !== image.width / dimensions.standartScreenWidth ){
        adjustMap();
    }
}

// update local storage for scene and cut
async function updateSceneAndCut(sceneNum, cutNum){
    localStorage.setItem("sceneNum", sceneNum);
    localStorage.setItem("cutNum", cutNum);
}