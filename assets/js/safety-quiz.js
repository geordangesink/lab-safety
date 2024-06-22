

let dimensions = {
    standartScreenWidth: 1280,
    scalar: 1,
    totalAreas: 0,
    // coordinates for map areas sorted as [scene][cut][area][coordinates]
    sceneCutArea: [
        [   
            [ 
                [620,453,641,424,677,416,685,453,657,466] 
            ] 
        ],
        [ 
            [ 
                [483,110,513,144,505,194,462,194,459,157],
                [676,717,540,694,595,643,718,661,710,706],
                [604,120,565,422,729,411,694,286,741,141],
                [648,2,697,2,745,182,705,133,671,130]
            ], 
            [ 
                [682,0,671,19,704,41,726,27,741,0],
                [519,401,607,469,784,414,604,385,550,258],
                [24,501,225,719,510,574,445,490,299,425] 
            ], 
            [ 
                [346,249,571,272,547,350,420,319,341,289],
                [636,468,607,583,688,619,784,595,672,466],
                [737,432,857,540,1035,504,1094,311,941,258],
                [916,511,890,522,885,633,944,637,943,523] 
            ] 
        ],
        [ 
            [ 
                [789,526,868,485,924,508,845,549,796,536],
                [827,342,779,336,744,402,812,417,838,383],
                [470,563,356,562,249,719,480,717,509,597],
                [360,37,378,311,516,309,568,181,550,95]
            ], 
            [ 
                [303,228,247,269,300,313,344,288,355,255],
                [292,118,433,175,443,148,378,84,323,72]
            ], 
            [ 
                [366,397,363,460,391,476,403,441,391,389] 
            ] 
        ],
        [ 
            [
                [421,404,482,394,477,315,439,313,418,358],
                [832,238,799,339,824,358,859,321,862,262],
                [261,220,127,451,243,580,396,534,414,257],
                [453,244,504,385,668,604,715,477,628,219],
                [761,231,717,529,953,523,948,227,797,392] 
            ] 
        ]
    ],
    // calculate total possible points
    getTotalAreas: function(){
        for ( x = 0; x < this.sceneCutArea.length; x++ ){
            for ( y = 0; y < this.sceneCutArea[x].length; y++ ){
                for ( z = 0; z < this.sceneCutArea[x][y].length; z++ ){
                    this.totalAreas++
                }
            }
        }
        return this.totalAreas;
    },

    getCurrentAreas: function(scene, cut){
        return this.sceneCutArea[scene][cut].length;
    }
}

// adjust hotspot map to image size
window.addEventListener('resize', function(){
    if ( localStorage.getItem("dimensinScalar") !== image.width / dimensions.standartScreenWidth ){
        adjustMap();
    }
});

let rulesText = "Find whats wrong and click it in the picture! \nEach wrong thing will only show up one time. \nThere can be multiple wrong things to click in one picure.\nIn the bottom right below the image you can see how many things you need to spot\nIf your selection was false, the screen flashes red, if you are correct, green.";
let totalPoints = 0;
let wrongAnswers = 0;
let mapTotalPoints = new Array();

let points = document.querySelector("#points");
let totalPointsDom = document.querySelector("#total-points");
let pointsImage = document.querySelector("#points-image");
let mistakes = document.querySelector("#wrong");
let rules = document.querySelector("#rules");
let nextClip = document.querySelector("#next-clip");
let video = document.querySelector( "#video" );
let image = document.querySelector( "#image" );
let overlayGreen = document.querySelector( "#overlay-green" );
let overlayRed = document.querySelector( "#overlay-red" );
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
totalPointsDom.textContent = `Total Possible Points : ${dimensions.getTotalAreas()}`;
// next button
nextClip.addEventListener("click", nextVideo);
rules.addEventListener("click", function(){alert(rulesText)})
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

        pointsImage.textContent = `Possible Points For This Image : ${dimensions.getCurrentAreas( sceneNum, cutNum )}`;

        // create map of hotspot areas
        await updateSceneAndCut( sceneNum, cutNum );
        await adjustMap();
        
        // Next snippet
        cutNum++;
        nextClip.classList.remove("hide");
        // document.onkeydown = nextVideo;

    }

    // If at the end of scene 1 or 2
    else if ( cutNum >= 3 ){
        sceneNum++;
        cutNum = 0;

        await updateSceneAndCut( sceneNum, cutNum );
        nextVideo();
    }

    // if at scene 3 (last video snippet)
    else{
        // Hide video and show Screenshot
        video.classList.add( "hide" );
        image.src = `assets/images/scene-${ 3 }-snapshot-${ 0 }.png`;
        image.classList.remove( "hide" );

        pointsImage.textContent = `Possible Points For This Image : ${dimensions.getCurrentAreas( sceneNum, cutNum )}`;

        // create map of hotspot areas
        await updateSceneAndCut(sceneNum, cutNum);
        await adjustMap();

        // show end picture
        nextClip.classList.remove("hide");
        nextClip.addEventListener("click", function(){
            image.src = "assets/images/end-pic.JPG";
            nextClip.classList.add("hide");
        });
    }

}

function showAnswers(){
    nextClip.textContent = "Next Clip";
}

// play next video
function nextVideo(){
    nextClip.classList.add("hide");
    nextClip.textContent = "Show Answers";
    // totalPoints += mapTotalPoints.reduce((acc,c) => acc + c , 0);
        // Show points in DOM
    points.textContent = `Total Points : ${totalPoints}`;
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
    // loop through the rest amd set their coords to 0
    for ( spot = dimensions.sceneCutArea[sceneNum][cutNum].length; spot < 5; spot++){
        hotspots[spot].coords = "0, 0, 0, 0, 0, 0, 0, 0, 0, 0";
    }
    adjustPoints();
}

function adjustPoints(){

    image.onclick = async function(){
        wrongAnswers++;
        mistakes.textContent = `Total False Answers : ${wrongAnswers}`;
        for ( i = 0; i < 2; i++ ){
            overlayRed.style.opacity = "1";
            await new Promise(resolve => setTimeout(resolve, 200));
            overlayRed.style.opacity = "0";
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    // make space in array for points
    mapTotalPoints.push(0);

    // click function for each hotspot
    hotspot.onclick = function(event){
        event.preventDefault();
        clicking(0);
    }
    hotspot2.onclick = function(event){
        event.preventDefault();
        clicking(1);
    }
    hotspot3.onclick = function(event){
        event.preventDefault();
        clicking(2);
    }
    hotspot4.onclick = function(event){
        event.preventDefault();
        clicking(3);
    }
    hotspot5.onclick = function(event){
        event.preventDefault();
        clicking(4);
    }
    // If it has NOT bee klicked yet, add one point to score
    async function clicking(num){
        console.log(num);
        if ( mapTotalPoints[num] !== 1 ){
            totalPoints += 1;
            points.textContent = `Total Points : ${totalPoints}`;
            
            for ( i = 0; i < 2; i++ ){
                overlayGreen.style.opacity = "1";
                await new Promise(resolve => setTimeout(resolve, 200));
                overlayGreen.style.opacity = "0";
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        mapTotalPoints[num] = 1;
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