let video = document.querySelector( "#video" );
let image = document.querySelector( "#image" );
let sceneNum = 1;
let cutNum = 1;

video.src = `assets/videos/scene-${ sceneNum }-snippet-${ cutNum }.mp4`;

// video.addEventListener( "ended", quiz );
video.onended = quiz;


function quiz(){

    if ( ( sceneNum === 1 || sceneNum === 2 ) && cutNum < 4 ){
        
        
        video.classList.add( "hide" );
        image.src = `assets/images/scene-${ sceneNum }-snapshot-${ cutNum }.png`;
        image.classList.remove( "hide" );

        cutNum++;

        document.onkeydown = nextVideo;
    }

    else if ( cutNum >= 4 ){
        sceneNum++;
        cutNum = 1;
        nextVideo();
    }

    else{
        video.classList.add( "hide" );
        image.src = `assets/images/scene-${ 3 }-snapshot-${ 1 }.png`;
        image.classList.remove( "hide" );

        document.onkeydown = function(){
            image.src = "assets/images/P1100248.JPG";
        }
    }

    // document.addEventListener( "keypress", nextVideo );
}

function nextVideo(){
    // document.removeEventListener( "keypress", nextVideo );
    image.classList.add( "hide" );
    video.src = `assets/videos/scene-${ sceneNum }-snippet-${ cutNum }.mp4`;
    video.classList.remove( "hide" );

    video.play();
    video.onended = quiz;
}