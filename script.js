const heroPoster = document.getElementById("hero-poster");
const heroIframe = document.getElementById("hero-vimeo");

let vimeoStarted = false;


/* =========================================================
   CARGAR VIMEO
========================================================= */

function loadHeroVideo() {

    // Evitamos ejecutar la función más de una vez
    if (vimeoStarted) return;

    vimeoStarted = true;


    /*
       Ahora que el poster está cargado,
       permitimos que Vimeo empiece a cargar.
    */

    heroIframe.src = heroIframe.dataset.src;


    /*
       Creamos el reproductor mediante
       la Vimeo Player API.
    */

    const player = new Vimeo.Player(heroIframe);


    let videoRevealed = false;


    /*
       Esperamos a que el vídeo esté
       reproduciéndose realmente.

       No mostramos simplemente el iframe
       cuando Vimeo dice "playing".

       Esperamos hasta que el vídeo lleve
       0.25 segundos avanzando.
    */

    player.on("timeupdate", function(data) {

        if (
            !videoRevealed &&
            data.seconds >= 0.25
        ) {

            videoRevealed = true;


            /*
               Esperamos dos frames del navegador
               para asegurarnos de que Vimeo
               ya ha pintado la imagen.
            */

            requestAnimationFrame(function() {

                requestAnimationFrame(function() {

                    heroIframe.classList.add("is-ready");

                });

            });

        }

    });

}



/* =========================================================
   COMPROBAR POSTER
========================================================= */

/*
   Si el navegador ya tiene el poster cargado
   —por ejemplo porque estaba en caché—
   empezamos inmediatamente.
*/

if (
    heroPoster.complete &&
    heroPoster.naturalWidth > 0
) {

    loadHeroVideo();

} else {

    /*
       Si todavía no está cargado,
       esperamos primero al poster.
    */

    heroPoster.addEventListener(
        "load",
        loadHeroVideo,
        { once: true }
    );

}



/* =========================================================
   FALLBACK
========================================================= */

/*
   Si por algún motivo hero-poster.jpg falla,
   no queremos impedir que Vimeo se cargue.
*/

heroPoster.addEventListener(
    "error",
    loadHeroVideo,
    { once: true }
);