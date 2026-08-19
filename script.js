document.addEventListener("DOMContentLoaded", function () {

    
    
    let showreelPlayer = null;

        /* =========================================================
       SITE MENU
    ========================================================= */

    const menuToggle =
        document.getElementById("menu-toggle");

    const siteMenu =
        document.getElementById("site-menu");

    const siteMenuClose =
        document.getElementById("site-menu-close");

    const siteMenuLinks =
        siteMenu.querySelectorAll("a");


    let menuReturnFocus = null;



    /* =========================================================
       ABRIR MENU
    ========================================================= */

    function openMenu() {

        menuReturnFocus =
            document.activeElement;


        siteMenu.hidden =
            false;


        siteMenu.setAttribute(
            "aria-hidden",
            "false"
        );


        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );


        document.body.classList.add(
            "menu-open"
        );


        siteMenuClose.focus();

    }



    /* =========================================================
       CERRAR MENU
    ========================================================= */

    function closeMenu() {

        if (siteMenu.hidden) {
            return;
        }


        siteMenu.hidden =
            true;


        siteMenu.setAttribute(
            "aria-hidden",
            "true"
        );


        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );


        document.body.classList.remove(
            "menu-open"
        );


        if (menuReturnFocus) {

            menuReturnFocus.focus();

            menuReturnFocus = null;

        }

    }



    menuToggle.addEventListener(
        "click",
        openMenu
    );


    siteMenuClose.addEventListener(
        "click",
        closeMenu
    );



    siteMenuLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            closeMenu
        );

    });



    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                !siteMenu.hidden
            ) {

                closeMenu();

            }

        }
    );

    


    /* =========================================================
       SHOWREEL
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

    const showreelFullscreen =
        document.getElementById("showreel-fullscreen");

    const showreelDuration =
        document.getElementById("showreel-duration");



    /* =========================================================
       INICIALIZAR SHOWREEL
    ========================================================= */

    if (
        window.Vimeo &&
        showreelIframe &&
        showreelContainer &&
        showreelCover &&
        showreelCenterLabel &&
        showreelToggle &&
        showreelFullscreen &&
        showreelDuration
    ) {

        showreelPlayer =
            new Vimeo.Player(showreelIframe);


        showreelPlayer.ready()

            .then(function () {

                showreelCover.disabled = false;

                showreelCover.classList.add(
                    "is-ready"
                );

                return showreelPlayer.getDuration();

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



        /* =====================================================
           PLAY DESDE PORTADA
        ===================================================== */

        showreelCover.addEventListener(
            "click",
            function () {

                showreelCenterLabel.textContent =
                    "LOADING";


                showreelPlayer.play()

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



        /* =====================================================
           REPRODUCIENDO
        ===================================================== */

        showreelPlayer.on(
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



        /* =====================================================
           PLAY / PAUSE
        ===================================================== */

        showreelToggle.addEventListener(
            "click",
            function () {

                showreelPlayer.getPaused()

                    .then(function (paused) {

                        if (paused) {
                            return showreelPlayer.play();
                        }

                        return showreelPlayer.pause();

                    })

                    .catch(function (error) {

                        console.error(
                            "Error cambiando reproducción:",
                            error
                        );

                    });

            }
        );


                    /* =====================================================
            FULLSCREEN
            ===================================================== */

            showreelFullscreen.addEventListener(
                "click",
                function () {

                    showreelPlayer.requestFullscreen()

                        .catch(function (error) {

                            console.error(
                                "Error activando pantalla completa:",
                                error
                            );

                        });

                }
            );



        /* =====================================================
           PAUSE
        ===================================================== */

        showreelPlayer.on(
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



        /* =====================================================
           FINAL
        ===================================================== */

        showreelPlayer.on(
            "ended",
            function () {

                showreelContainer.classList.remove(
                    "is-playing"
                );


                showreelCenterLabel.textContent =
                    "PLAY AGAIN";


                showreelPlayer.setCurrentTime(0);

            }
        );

    } else {

        if (showreelCenterLabel) {

            showreelCenterLabel.textContent =
                "VIDEO UNAVAILABLE";

        }

    }



    /* =========================================================
       SELECTED WORK — FILM MODAL
    ========================================================= */

    const filmModal =
        document.getElementById("film-modal");

    const filmModalVideo =
        document.getElementById("film-modal-video");

    const filmModalTitle =
        document.getElementById("film-modal-title");

    const filmModalClose =
        document.getElementById("film-modal-close");

    const filmModalToggle =
        document.getElementById("film-modal-toggle");

    const filmTriggers =
        document.querySelectorAll(".work-film-trigger");


    let activeFilmTrigger = null;



    /* =========================================================
       ABRIR FILM
    ========================================================= */

    function openFilmModal(trigger) {

        const videoSrc =
            trigger.dataset.video;

        const projectName =
            trigger.dataset.project;


        if (!videoSrc) {

            console.error(
                "No hay archivo de vídeo en este proyecto."
            );

            return;
        }


        activeFilmTrigger = trigger;


        filmModalTitle.textContent =
            projectName || "Project Film";


        filmModalVideo.src =
            videoSrc;


        filmModal.hidden =
            false;


        filmModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "film-modal-open"
        );


        filmModalClose.focus();


        /*
         * Pausamos el showreel si estaba reproduciéndose.
         */

        if (showreelPlayer) {

            showreelPlayer.pause().catch(function () {

                // No pasa nada si ya estaba pausado.

            });

        }


        /*
         * El play se inicia como respuesta directa
         * al click del usuario.
         */

        filmModalVideo.play()

            .catch(function (error) {

                console.error(
                    "No se pudo iniciar el vídeo:",
                    error
                );

            });

    }



    filmTriggers.forEach(function (trigger) {

        trigger.addEventListener(
            "click",
            function () {

                openFilmModal(trigger);

            }
        );

    });



    /* =========================================================
       CERRAR FILM
    ========================================================= */

    function closeFilmModal() {

        if (filmModal.hidden) {
            return;
        }


        filmModalVideo.pause();


        filmModalVideo.removeAttribute(
            "src"
        );


        /*
         * Fuerza al navegador a liberar el archivo cargado.
         */

        filmModalVideo.load();


        filmModal.hidden =
            true;


        filmModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "film-modal-open"
        );


        filmModalToggle.textContent =
            "PAUSE";


        filmModalToggle.setAttribute(
            "aria-label",
            "Pausar vídeo"
        );


        if (activeFilmTrigger) {

            activeFilmTrigger.focus();

            activeFilmTrigger = null;

        }

    }



    filmModalClose.addEventListener(
        "click",
        closeFilmModal
    );



    /* =========================================================
       ESCAPE
    ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                !filmModal.hidden
            ) {

                closeFilmModal();

            }

        }
    );



    /* =========================================================
       PLAY / PAUSE DEL FILM
    ========================================================= */

    function toggleFilmPlayback() {

        if (filmModalVideo.ended) {

            filmModalVideo.currentTime = 0;

            filmModalVideo.play();

            return;
        }


        if (filmModalVideo.paused) {

            filmModalVideo.play();

        } else {

            filmModalVideo.pause();

        }

    }



    filmModalToggle.addEventListener(
        "click",
        toggleFilmPlayback
    );


    filmModalVideo.addEventListener(
        "click",
        toggleFilmPlayback
    );



    /* =========================================================
       ESTADOS DEL FILM
    ========================================================= */

    filmModalVideo.addEventListener(
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


    filmModalVideo.addEventListener(
        "pause",
        function () {

            if (filmModalVideo.ended) {
                return;
            }


            filmModalToggle.textContent =
                "PLAY";


            filmModalToggle.setAttribute(
                "aria-label",
                "Reproducir vídeo"
            );

        }
    );


    filmModalVideo.addEventListener(
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

});