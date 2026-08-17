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

        if (showreelCenterLabel) {
            showreelCenterLabel.textContent =
                "VIDEO UNAVAILABLE";
        }

        return;
    }



    /* =========================================================
       CREAR PLAYER DEL SHOWREEL
    ========================================================= */

    const player =
        new Vimeo.Player(showreelIframe);



    /* =========================================================
       VIMEO READY
    ========================================================= */

    player.ready()

        .then(function () {

            showreelCover.disabled = false;

            showreelCover.classList.add(
                "is-ready"
            );

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
       PLAY SHOWREEL DESDE PORTADA
    ========================================================= */

    showreelCover.addEventListener(
        "click",
        function () {

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
       SHOWREEL — REPRODUCCIÓN REAL
    ========================================================= */

    player.on(
        "playing",
        function () {

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
       SHOWREEL — PLAY / PAUSE
    ========================================================= */

    showreelToggle.addEventListener(
        "click",
        function () {

            player.getPaused()

                .then(function (paused) {

                    if (paused) {

                        return player.play();

                    } else {

                        return player.pause();

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
       SHOWREEL — PAUSE
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
       SHOWREEL — FINAL
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



    /* =========================================================
       SELECTED WORK — ELEMENTOS DEL MODAL
    ========================================================= */

    const filmModal =
        document.getElementById("film-modal");

    const filmModalPlayerElement =
        document.getElementById("film-modal-player");

    const filmModalTitle =
        document.getElementById("film-modal-title");

    const filmModalClose =
        document.getElementById("film-modal-close");

    const filmModalToggle =
        document.getElementById("film-modal-toggle");

    const filmTriggers =
        document.querySelectorAll(".work-film-trigger");


    let projectPlayer = null;



    /* =========================================================
       ABRIR FILM
    ========================================================= */

    filmTriggers.forEach(function (trigger) {

        trigger.addEventListener(
            "click",
            function () {

                const videoUrl =
                    trigger.dataset.vimeoUrl;

                const projectName =
                    trigger.dataset.project;


                if (!videoUrl) {

                    console.error(
                        "No hay URL de Vimeo en este proyecto."
                    );

                    return;
                }



                /* TÍTULO */

                filmModalTitle.textContent =
                    projectName;



                /* ABRIR MODAL */

                filmModal.showModal();

                document.body.classList.add(
                    "film-modal-open"
                );



                /* PAUSAR SHOWREEL SI ESTABA SONANDO */

                player.pause().catch(function () {

                    // No pasa nada si ya estaba pausado.

                });



                /* LIMPIAR PLAYER ANTERIOR */

                if (projectPlayer) {

                    projectPlayer.destroy();

                    projectPlayer = null;

                }


                filmModalPlayerElement.innerHTML = "";



                /* CREAR NUEVO PLAYER VIMEO */

                projectPlayer =
                    new Vimeo.Player(
                        filmModalPlayerElement,
                        {
                            url: videoUrl,

                            autoplay: true,

                            controls: false,

                            title: false,

                            byline: false,

                            portrait: false,

                            responsive: true
                        }
                    );



                /* PLAYER READY */

                projectPlayer.ready()

                    .then(function () {

                        return projectPlayer.play();

                    })

                    .catch(function (error) {

                        console.error(
                            "Error cargando el vídeo del proyecto:",
                            error
                        );

                    });



                /* ESTADO PLAY */

                projectPlayer.on(
                    "play",
                    function () {

                        filmModalToggle.textContent =
                            "PAUSE";


                        filmModalToggle.setAttribute(
                            "aria-label",
                            "Pausar vídeo"
                        );

                    }
                );



                /* ESTADO PAUSE */

                projectPlayer.on(
                    "pause",
                    function () {

                        filmModalToggle.textContent =
                            "PLAY";


                        filmModalToggle.setAttribute(
                            "aria-label",
                            "Reproducir vídeo"
                        );

                    }
                );



                /* ESTADO FINAL */

                projectPlayer.on(
                    "ended",
                    function () {

                        filmModalToggle.textContent =
                            "PLAY AGAIN";


                        filmModalToggle.setAttribute(
                            "aria-label",
                            "Reproducir vídeo de nuevo"
                        );

                    }
                );

            }
        );

    });



    /* =========================================================
       PROJECT FILM — PLAY / PAUSE
    ========================================================= */

    filmModalToggle.addEventListener(
        "click",
        function () {

            if (!projectPlayer) {
                return;
            }


            projectPlayer.getEnded()

                .then(function (ended) {

                    if (ended) {

                        return projectPlayer.setCurrentTime(0)

                            .then(function () {

                                return projectPlayer.play();

                            });

                    }


                    return projectPlayer.getPaused()

                        .then(function (paused) {

                            if (paused) {

                                return projectPlayer.play();

                            } else {

                                return projectPlayer.pause();

                            }

                        });

                })

                .catch(function (error) {

                    console.error(
                        "Error cambiando reproducción del proyecto:",
                        error
                    );

                });

        }
    );



    /* =========================================================
       CERRAR FILM
    ========================================================= */

    function closeFilmModal() {

        if (!filmModal.open) {
            return;
        }


        filmModal.close();

    }



    filmModalClose.addEventListener(
        "click",
        closeFilmModal
    );



    /* =========================================================
       LIMPIAR VÍDEO AL CERRAR
    ========================================================= */

    filmModal.addEventListener(
        "close",
        function () {

            document.body.classList.remove(
                "film-modal-open"
            );


            if (projectPlayer) {

                projectPlayer.destroy()

                    .catch(function (error) {

                        console.error(
                            "Error destruyendo player:",
                            error
                        );

                    });


                projectPlayer = null;

            }


            filmModalPlayerElement.innerHTML = "";

        }
    );


});