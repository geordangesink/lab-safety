

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

// value variables
let rulesText = "Your goal is to recognize the typical and unusual violation of rules made when performing experiments in a lab during the video. You can advance to the next section and gain points when you identify and click on the area where an error is being made and a rule is being broken. In each scene, only look out for the violations that have not been identified before. (click all errors - score recorded)";
let pointsCurrent = 0;
let totalPoints = 0;
let wrongAnswers = 0;
let mapTotalPoints = new Array();
// Scene and Snippet number
let sceneNum = 0;
let cutNum = 0;

// DOM elments
let points = document.querySelector( "#points" );
let pointsCurrently = document.querySelector( "#points-currently" );
let totalPointsDom = document.querySelector( "#total-points" );
let pointsImage = document.querySelector( "#points-image" );
let mistakes = document.querySelector( "#wrong" );
let rules = document.querySelector( "#rules" );
let textWrapper = document.querySelector( "#text-wrapper" );
let answers = document.querySelector( "#answers" );
let nextClip = document.querySelector( "#next-clip" );
let audio =  document.querySelector( "#audio" );
let video = document.querySelector( "#video" );
let image = document.querySelector( "#image" );
let endImage =  document.querySelector( "#end-image" );
let endText = document.querySelector( "#end-text" );
let overlayGreen = document.querySelector( "#overlay-green" );
let overlayRed = document.querySelector( "#overlay-red" );
let hotspots = document.querySelectorAll( ".hotspots" );
let hotspot = document.querySelector( "#hotspot-1" );
let hotspot2 = document.querySelector( "#hotspot-2" );
let hotspot3 = document.querySelector( "#hotspot-3" );
let hotspot4 = document.querySelector( "#hotspot-4" );
let hotspot5 = document.querySelector( "#hotspot-5" );

// Start at this video when refreshing page
video.src = `assets/videos/scene-${ sceneNum }-snippet-${ cutNum }.mp4`;
totalPointsDom.textContent = `Total Possible Points : ${dimensions.getTotalAreas()}`;

// next button
nextClip.onclick = function(){ nextVideo(); audio.play(); answers.classList.add("hide"); rules.classList.remove("hide");};
rules.addEventListener("click", function(){alert(rulesText)})

// music button
document.querySelector("#music-button").addEventListener("click", function(){
    if ( audio.paused ){
        audio.play();
    }

    else{
        audio.pause();
    }
})

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
        nextClip.textContent = "Show Answers";
        nextClip.onclick = showAnswers;
        nextClip.classList.remove("hide");
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
        nextClip.textContent = "Show Answers";
        nextClip.onclick = showAnswers;
        nextClip.classList.remove("hide");
    }

}

// play next video
function nextVideo(){
    
    pointsCurrent = 0;
    pointsCurrently.textContent = `Points (This Image) : ${pointsCurrent}`;

    pointsImage.textContent = "Possible Points For This Image : -"
    textWrapper.classList.add("hide");
    answers.classList.add("hide");
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

// flash screen and adjust points
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
            totalPoints++;
            pointsCurrent++;
            pointsCurrently.textContent = `Points (This Image) : ${pointsCurrent}`;
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

// end screen
function endScreen(){
    textWrapper.classList.add("hide");
    answers.classList.add("hide");
    endImage.classList.remove("hide");
    endText.innerHTML = `<b>Congratulations!</b> <br><br> You finished the Quiz with <b>${totalPoints}</b> out of <b>${dimensions.getTotalAreas()/2}</b> Points and <b>${wrongAnswers}</b> wrong clicks.`
    endText.classList.remove("hide");
    document.querySelector("#buttons-container").classList.add("hide");
    document.querySelector("#scoreboard").classList.add("hide");
}

// show answers for corresponding scene nad cut
async function showAnswers(){
    console.log(sceneNum, cutNum);
    switch(sceneNum){

        case 0:

            switch(cutNum){
                case 0:
                    console.log("testing");
                    answers.innerHTML = "<b>Hand on door</b><br><br>- Contaminating the door handle with a chemical on your glove can expose someone else to that on bear hands, potentially leading to chemical burns";
                    break;
            }
            break;
        
        case 1:

            switch(cutNum){
                case 0:
                    answers.innerHTML = "<b>Phone, Shoes, Outfit, Hair</b><br><br>- Contaminating phone screen with chemicals can expose you to chemical burns at a later time, outside the laboratory environment <br>- Incorrect PPE makes you vulnerable to chemical exposure on bare skin, leading to chemical burns or other injuries <br>- Long untied hair can get stuck in lab equipment or come in contact with chemicals";
                    break;
        
                case 1:
                    answers.innerHTML = "<b>Perfume, things on the desk(Water, Glasses, Phone), Bag</b><br><br>- Personal items like sunglasses or perfume in the lab can be contaminated with chemicals, later exposing you to toxicity<br>- Bulky items like bags can provide a barrier and make it difficult to evacuate the lab in case of emergency eg.fire";
                    break;
                
                case 2:
                    answers.innerHTML = "<b>Glove on laptop, Chemicals on bench , Food on bench, Drinking</b><br><br>- Eating/drinking in the lab, where the items may be exposed to chemicals, can directly lead to severe health hazards <br>- Touching your laptop with a glove can lead to contamination with toxic chemicals and expose you to chemical burns after you exit the lab";
                    break;
            }
            break;

        case 2:
            
            switch(cutNum){
                case 0:
                    answers.innerHTML = "<b>no Glove touching Chemicals, Phone, Head in fume hood, Lab Coat</b><br><br>- Using your phone during an experiment can be distracting, which increases the risk of <br>- an accident occurring within the lab. Calculators, timers, and digital cameras are <br>- provided by the lab staff when needed!";
                    break;
            
                case 1:
                    answers.innerHTML = "<b>Smelling Chemicals, Goggles on Head</b><br><br>- Smelling the chemicals and removing them from the fume hood can expose you to toxic fumes <br>- Not wearing goggles exposes your eyes to hazardous chemicals, flying debris, and potential splashes that could cause serious injury";
                    break;

                case 2:
                    answers.innerHTML = "<b>Touching Chemicals</b><br><br>- Touching chemicals with bare hands can lead to skin irritation, chemical burns, and absorption of toxic substances into the body";
                    break;
            }
            break;

        case 3:
            
            switch(cutNum){
                case 0:
                    answers.innerHTML = "<b>Coats (x 3), Eating with the Glove, Phone with Glove</b><br><br>- Wearing a lab coat on when you are not in the lab can cause contamination with toxic chemicals outside of the lab";
                    break;
            }
            break;
    }

    image.classList.add("hide");
    textWrapper.classList.remove("hide");
    answers.classList.remove("hide");
    cutNum++;

    if ( sceneNum !== 3 ){
        nextClip.textContent = "Next Clip"
        nextClip.onclick = nextVideo;
    }

    else{
        nextClip.textContent = "Done"
        nextClip.onclick = endScreen;
    }
}