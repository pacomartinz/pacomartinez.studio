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
       HEADER FIJO / AUTO HIDE / COLOR
    ========================================================= */

    const heroHeader =
        document.querySelector(".hero-header");

    const lightHeaderSections = [
        document.getElementById("showreel"),
        document.getElementById("selected-work"),
        document.getElementById("about"),
        document.getElementById("contact")
    ].filter(Boolean);


    let lastHeaderScrollY =
        Math.max(0, window.scrollY);

    let headerScrollDistance = 0;

    let headerTicking = false;



    /* =========================================================
       COLOR DEL HEADER
    ========================================================= */

    function updateHeaderColor() {

        if (!heroHeader) {
            return;
        }

        const probeY =
            Math.min(
                heroHeader.offsetHeight / 2,
                40
            );

        const isLightSection =
            lightHeaderSections.some(function (section) {

                const rect =
                    section.getBoundingClientRect();

                return (
                    rect.top <= probeY &&
                    rect.bottom > probeY
                );

            });

        heroHeader.classList.toggle(
            "is-light",
            isLightSection
        );

    }



    /* =========================================================
       MOSTRAR / OCULTAR HEADER
    ========================================================= */

    function updateHeaderVisibility() {

        if (!heroHeader) {
            return;
        }

        const currentScrollY =
            Math.max(0, window.scrollY);

        const scrollDelta =
            currentScrollY - lastHeaderScrollY;


        if (currentScrollY <= 80) {

            heroHeader.classList.remove(
                "is-hidden"
            );

            headerScrollDistance = 0;

        } else if (
            !document.body.classList.contains("menu-open") &&
            Math.abs(scrollDelta) >= 2
        ) {

            if (scrollDelta > 0) {

                if (headerScrollDistance < 0) {
                    headerScrollDistance = 0;
                }

                headerScrollDistance +=
                    scrollDelta;

                if (headerScrollDistance >= 55) {

                    heroHeader.classList.add(
                        "is-hidden"
                    );

                    headerScrollDistance = 0;

                }

            } else {

                if (headerScrollDistance > 0) {
                    headerScrollDistance = 0;
                }

                headerScrollDistance +=
                    scrollDelta;

                if (headerScrollDistance <= -15) {

                    heroHeader.classList.remove(
                        "is-hidden"
                    );

                    headerScrollDistance = 0;

                }

            }

        }

        lastHeaderScrollY =
            currentScrollY;

    }



    /* =========================================================
       ACTUALIZAR HEADER
    ========================================================= */

    function updateHeader() {

        updateHeaderVisibility();
        updateHeaderColor();

        headerTicking = false;

    }


    function requestHeaderUpdate() {

        if (headerTicking) {
            return;
        }

        headerTicking = true;

        window.requestAnimationFrame(
            updateHeader
        );

    }


    window.addEventListener(
        "scroll",
        requestHeaderUpdate,
        { passive: true }
    );


    window.addEventListener(
        "resize",
        requestHeaderUpdate
    );


    updateHeader();



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

    const showreelClickToggle =
        document.getElementById("showreel-click-toggle");

    const showreelFullscreen =
        document.getElementById("showreel-fullscreen");

    const showreelDuration =
        document.getElementById("showreel-duration");

    const showreelProgressFill =
    document.getElementById("showreel-progress-fill");

    const showreelSeek =
    document.getElementById("showreel-seek");

    let showreelSeeking = false;



    /* =========================================================
       INICIALIZAR SHOWREEL
    ========================================================= */

    if (
        window.Vimeo &&
        showreelIframe &&
        showreelContainer &&
        showreelCover &&
        showreelCenterLabel &&
        showreelClickToggle &&
        showreelFullscreen &&
        showreelDuration &&
        showreelProgressFill &&
        showreelSeek
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

                showreelCover.classList.add("is-loading");
                showreelCover.disabled = true;

                showreelCenterLabel.textContent =
                    "LOADING";


                showreelPlayer.play()

                    .catch(function (error) {

                        console.error(
                            "Error reproduciendo Vimeo:",
                            error
                        );

                        showreelCover.classList.remove("is-loading");
                        showreelCover.disabled = false;

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

        showreelCover.classList.remove("is-loading");
        showreelCover.disabled = false;

        showreelContainer.classList.add(
            "is-playing"
        );

        showreelClickToggle.setAttribute(
            "aria-label",
            "Pausar showreel"
        );

    }
);



        /* =====================================================
           PLAY / PAUSE
        ===================================================== */

        showreelClickToggle.addEventListener(
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
   PROGRESS / SEEK
===================================================== */

showreelPlayer.on(
    "timeupdate",
    function (data) {

        if (showreelSeeking) {
            return;
        }

        showreelProgressFill.style.transform =
            `scaleX(${data.percent})`;

        showreelSeek.value =
            Math.round(data.percent * 1000);

    }
);


showreelSeek.addEventListener(
    "input",
    function () {

        showreelSeeking = true;

        const percent =
            Number(showreelSeek.value) / 1000;

        showreelProgressFill.style.transform =
            `scaleX(${percent})`;

    }
);


showreelSeek.addEventListener(
    "change",
    function () {

        const percent =
            Number(showreelSeek.value) / 1000;

        showreelPlayer.getDuration()

            .then(function (duration) {

                return showreelPlayer.setCurrentTime(
                    duration * percent
                );

            })

            .then(function () {

                showreelSeeking = false;

            })

            .catch(function (error) {

                showreelSeeking = false;

                console.error(
                    "Error cambiando posición del showreel:",
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

                    showreelClickToggle.setAttribute(
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

                
                showreelSeeking = false;

                showreelProgressFill.style.transform =
                    "scaleX(0)";

                showreelSeek.value = 0;


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