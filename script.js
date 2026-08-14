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

    const showreelCenterLabel =
        document.getElementById("showreel-center-label");

    const showreelToggle =
        document.getElementById("showreel-toggle");

    const showreelDuration =
        document.getElementById("showreel-duration");



    /* =========================================================
       COMPROBAR VIMEO
    ========================================================= */

    if (!window.Vimeo) {

        console.error(
            "Vimeo Player SDK no se ha cargado."
        );

        showreelCenterLabel.textContent =
            "VIDEO UNAVAILABLE";

        return;
    }



    /* =========================================================
       CREAR PLAYER
    ========================================================= */

    const player =
        new Vimeo.Player(showreelIframe);



    /* =========================================================
       VIMEO READY
    ========================================================= */

    player.ready()

        .then(function () {


            /*
               Vimeo ya está preparado.
               Activamos nuestra portada.
            */

            showreelCover.disabled = false;

            showreelCover.classList.add(
                "is-ready"
            );


            /*
               Obtenemos automáticamente
               la duración real del vídeo.
            */

            return player.getDuration();

        })

        .then(function (duration) {

            const minutes =
                Math.floor(duration / 60);

            const seconds =
                Math.floor(duration % 60)
                    .toString()
                    .padStart(2, "0");


            showreelDuration.textContent =
                `${minutes}:${seconds}`;

        })

        .catch(function (error) {

            console.error(
                "Error preparando Vimeo:",
                error
            );

        });



    /* =========================================================
       PLAY DESDE LA PORTADA
    ========================================================= */

    showreelCover.addEventListener(
        "click",
        function () {


            /*
               Mientras Vimeo comienza,
               mantenemos visible la portada.
            */

            showreelCenterLabel.textContent =
                "LOADING";


            player.play()

                .catch(function (error) {

                    console.error(
                        "Error reproduciendo Vimeo:",
                        error
                    );

                    showreelCenterLabel.textContent =
                        "PLAY SHOWREEL";

                });

        }
    );



    /* =========================================================
       REPRODUCCIÓN REAL
    ========================================================= */

    player.on(
        "playing",
        function () {


            /*
               Sólo retiramos el poster
               cuando Vimeo está reproduciendo.
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
       PLAY / PAUSE
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
                        "Error cambiando reproducción:",
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
       FINAL
    ========================================================= */

    player.on(
        "ended",
        function () {


            showreelContainer.classList.remove(
                "is-playing"
            );


            showreelCenterLabel.textContent =
                "PLAY AGAIN";


            player.setCurrentTime(0);

        }
    );


});