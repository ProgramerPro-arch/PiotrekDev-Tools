/* PiotrekDev Tools — tools.js */
(() => {
    "use strict";

    const state = {
        stream: null,
        tab: "camera"
    };

    const root = document.getElementById("pt-tools");

    if (!root) {
        console.error("PiotrekDev Tools: nie znaleziono elementu #pt-tools");
        return;
    }

    root.innerHTML = `
        <section class="pt-tools">
            <h2>PiotrekDev Tools</h2>

            <nav class="pt-tabs">
                <button data-tab="camera">Kamera</button>
                <button data-tab="photo">Zdjęcie</button>
                <button data-tab="mic">Mikrofon</button>
            </nav>

            <p id="pt-status" role="status">Sesja nieaktywna</p>

            <video id="pt-video" autoplay playsinline muted
                style="display:none;width:100%;max-width:640px"></video>

            <canvas id="pt-canvas" style="display:none"></canvas>

            <audio id="pt-audio" autoplay controls
                style="display:none"></audio>

            <div class="pt-actions">
                <button id="pt-start">Rozpocznij</button>
                <button id="pt-photo" disabled>Zrób zdjęcie</button>
                <button id="pt-stop" disabled>Zatrzymaj</button>
            </div>

            <a id="pt-download" style="display:none"
                download="piotrekdev-photo.jpg">Pobierz zdjęcie</a>
        </section>
    `;

    const $ = id => root.querySelector("#" + id);
    const video = $("pt-video");
    const audio = $("pt-audio");
    const canvas = $("pt-canvas");
    const status = $("pt-status");

    function stop() {
        if (state.stream) {
            state.stream.getTracks().forEach(track => track.stop());
        }

        state.stream = null;
        video.srcObject = null;
        audio.srcObject = null;
        video.style.display = "none";
        audio.style.display = "none";

        $("pt-start").disabled = false;
        $("pt-stop").disabled = true;
        $("pt-photo").disabled = true;

        status.textContent = "Sesja zakończona";
    }

    async function start() {
        stop();

        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error(
                    "Brak API kamery. Użyj HTTPS lub localhost."
                );
            }

            const options = state.tab === "mic"
                ? { audio: true, video: false }
                : { audio: false, video: { facingMode: "user" } };

            status.textContent = "Oczekiwanie na uprawnienia…";

            const stream =
                await navigator.mediaDevices.getUserMedia(options);

            state.stream = stream;

            if (state.tab === "mic") {
                audio.srcObject = stream;
                audio.style.display = "block";
                status.textContent = "Mikrofon aktywny";
            } else {
                video.srcObject = stream;
                video.style.display = "block";
                await video.play();

                $("pt-photo").disabled = false;
                status.textContent = "Kamera aktywna";
            }

            $("pt-start").disabled = true;
            $("pt-stop").disabled = false;
        } catch (error) {
            status.textContent = "Błąd: " + error.message;
            stop();
        }
    }

    function takePhoto() {
        if (!state.stream || !video.videoWidth) {
            status.textContent = "Brak obrazu do zapisania";
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        canvas.getContext("2d").drawImage(
            video, 0, 0, canvas.width, canvas.height
        );

        canvas.toBlob(blob => {
            if (!blob) {
                status.textContent = "Nie udało się utworzyć zdjęcia";
                return;
            }

            const link = $("pt-download");

            link.href = URL.createObjectURL(blob);
            link.style.display = "inline-block";
            link.textContent = "Pobierz zdjęcie";
            link.click();

            status.textContent = "Zdjęcie przygotowane";
        }, "image/jpeg", 0.92);
    }

    root.querySelectorAll("[data-tab]").forEach(button => {
        button.addEventListener("click", () => {
            stop();
            state.tab = button.dataset.tab;

            $("pt-photo").style.display =
                state.tab === "photo" ? "inline-block" : "none";

            $("pt-download").style.display = "none";

            status.textContent = state.tab === "mic"
                ? "Gotowy do uruchomienia mikrofonu"
                : state.tab === "photo"
                    ? "Gotowy do zrobienia zdjęcia"
                    : "Gotowy do uruchomienia kamery";
        });
    });

    $("pt-start").addEventListener("click", start);
    $("pt-stop").addEventListener("click", stop);
    $("pt-photo").addEventListener("click", takePhoto);

    $("pt-photo").style.display = "none";

    window.addEventListener("beforeunload", stop);
})();
