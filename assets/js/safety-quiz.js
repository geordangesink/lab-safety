let video = document.querySelector( "#video" );
let image = document.querySelector( "#image" );
// Scene and Snippet number
let sceneNum = 0;
let cutNum = 1;
// Start at this video when refreshing page
video.src = `assets/videos/scene-${ sceneNum }-snippet-${ cutNum }.mp4`;

video.onended = quiz;


function quiz(){

    if ( sceneNum === 0 && cutNum === 2 ){
        sceneNum = 1;
        cutNum = 1;
        nextVideo();
    }

    // If currently in scene 1 or 2 and not at the last snippet
    else if ( ( sceneNum === 0 || sceneNum === 1 || sceneNum === 2 ) && cutNum < 4 ){
        
        // Hide video and show Screenshot
        video.classList.add( "hide" );
        image.src = `assets/images/scene-${ sceneNum }-snapshot-${ cutNum }.png`;
        image.classList.remove( "hide" );

        // Next snippet
        cutNum++;

        document.onkeydown = nextVideo;
    }
    // If at the end of scene 1 or 2
    else if ( cutNum >= 4 ){
        sceneNum++;
        cutNum = 1;
        nextVideo();
    }
    // if at scene 3 (last video snippet)
    else{
        video.classList.add( "hide" );
        image.src = `assets/images/scene-${ 3 }-snapshot-${ 1 }.png`;
        image.classList.remove( "hide" );

        document.onkeydown = function(){
            image.src = "assets/images/P1100248.JPG";
        }
    }

}

function nextVideo(){
    // Hide Screenshot and show Next Video
    image.classList.add( "hide" );
    video.src = `assets/videos/scene-${ sceneNum }-snippet-${ cutNum }.mp4`;
    video.classList.remove( "hide" );

    video.play();
    video.onended = quiz;
}