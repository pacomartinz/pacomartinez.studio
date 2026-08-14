document.addEventListener("DOMContentLoaded", function () {


    /* =========================================================
       ELEMENTOS DEL SHOWREEL
    ========================================================= */

    const showreelIframe =
        document.getElementById("showreel-vimeo");

    const showreelContainer =
        document.getElementById("showreel-player");

    const showreelCover =
        document.getElementById("showreel-cover");

    const showreelPlayLabel =
        document.getElementById("showreel-play-label");

    const showreelToggle =
        document.getElementById("showreel-toggle");



    /* =========================================================
       COMPROBAMOS VIMEO
    ========================================================= */

    if (!window.Vimeo) {

        console.error(
            "Vimeo Player SDK no se ha cargado."
        );

        showreelPlayLabel.textContent =
            "VIDEO UNAVAILABLE";

        return;
    }



    /* =========================================================
       CREAMOS EL PLAYER
    ========================================================= */

    const player =
        new Vimeo.Player(showreelIframe);



    /* =========================================================
       ESPERAMOS A QUE VIMEO ESTÉ PREPARADO
    ========================================================= */

    player.ready()

        .then(function () {

            console.log(
                "Showreel Vimeo preparado."
            );


            /*
               Hasta este momento el botón
               estaba desactivado.

               Ahora ya podemos permitir
               que el usuario pulse PLAY FILM.
            */

            showreelCover.disabled = false;

            showreelCover.classList.add(
                "is-ready"
            );

        })

        .catch(function (error) {

            console.error(
                "Error preparando Vimeo:",
                error
            );

            showreelPlayLabel.textContent =
                "VIDEO UNAVAILABLE";

        });



    /* =========================================================
       PLAY DESDE LA PORTADA
    ========================================================= */

    showreelCover.addEventListener(
        "click",
        function () {


            /*
               Mostramos feedback mientras
               Vimeo empieza a reproducir.

               Importante:
               todavía NO quitamos la portada.
            */

            showreelPlayLabel.textContent =
                "LOADING";


            /*
               La reproducción ocurre como
               consecuencia directa del clic,
               por lo que puede comenzar
               con sonido.
            */

            player.play()

                .catch(function (error) {

                    console.error(
                        "Error reproduciendo Vimeo:",
                        error
                    );

                    showreelPlayLabel.innerHTML =
                        'PLAY FILM <span aria-hidden="true">↗</span>';

                });

        }
    );



    /* =========================================================
       VÍDEO REALMENTE REPRODUCIÉNDOSE
    ========================================================= */

    player.on(
        "playing",
        function () {


            /*
               Sólo ahora quitamos la portada.

               Esto evita que aparezca
               una pantalla negra mientras
               Vimeo empieza.
            */

            showreelContainer.classList.add(
                "is-playing"
            );


            showreelToggle.textContent =
                "PAUSE";


            showreelToggle.setAttribute(
                "aria-label",
                "Pausar showreel"
            );

        }
    );



    /* =========================================================
       BOTÓN PLAY / PAUSE
    ========================================================= */

    showreelToggle.addEventListener(
        "click",
        function () {


            player.getPaused()

                .then(function (paused) {

                    if (paused) {

                        player.play();

                    } else {

                        player.pause();

                    }

                })

                .catch(function (error) {

                    console.error(
                        "Error comprobando el estado del vídeo:",
                        error
                    );

                });

        }
    );



    /* =========================================================
       PAUSE
    ========================================================= */

    player.on(
        "pause",
        function () {

            showreelToggle.textContent =
                "PLAY";


            showreelToggle.setAttribute(
                "aria-label",
                "Reproducir showreel"
            );

        }
    );



    /* =========================================================
       PLAYING
    ========================================================= */

    player.on(
        "playing",
        function () {

            showreelToggle.textContent =
                "PAUSE";


            showreelToggle.setAttribute(
                "aria-label",
                "Pausar showreel"
            );

        }
    );



    /* =========================================================
       FINAL DEL SHOWREEL
    ========================================================= */

    player.on(
        "ended",
        function () {


            /*
               Recuperamos la portada
               cuando termina el showreel.
            */

            showreelContainer.classList.remove(
                "is-playing"
            );


            showreelPlayLabel.innerHTML =
                'PLAY AGAIN <span aria-hidden="true">↗</span>';


            player.setCurrentTime(0);

        }
    );


});