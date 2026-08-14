const heroIframe = document.getElementById("hero-vimeo");


// Creamos el reproductor de Vimeo
const player = new Vimeo.Player(heroIframe);


// Control para ejecutarlo sólo una vez
let videoRevealed = false;


/*
   Vimeo y el poster están cargando simultáneamente.

   Mientras Vimeo todavía no tiene frames reproduciéndose,
   seguimos viendo hero-poster.jpg.

   En cuanto el tiempo del vídeo empieza a avanzar,
   hacemos visible el iframe.
*/

player.on("timeupdate", function(data) {

    if (
        !videoRevealed &&
        data.seconds > 0
    ) {

        videoRevealed = true;


        /*
           Esperamos dos frames de renderizado
           para reducir la posibilidad de mostrar
           el negro interno del reproductor.
        */

        requestAnimationFrame(function() {

            requestAnimationFrame(function() {

                heroIframe.classList.add("is-ready");

            });

        });

    }

});