"use strict";

module.exports.PT = function (parent) {
    var obj = {};
    obj.parent = parent;

    // Funkcja wykonywana w interfejsie MeshCentral.
    obj.exports = ["onDeviceRefreshEnd"];

    obj.onDeviceRefreshEnd = function () {
        if (typeof pluginHandler === "undefined" ||
            typeof pluginHandler.registerPluginTab !== "function") {
            return;
        }

        pluginHandler.registerPluginTab({
            tabId: "ptToolsTab",
            tabTitle: "Narzędzia"
        });

        var page = document.getElementById("ptToolsTab");
        if (!page) return;

        var node =
            (typeof currentNode !== "undefined") ? currentNode : null;

        var nodeId = node && node._id
            ? String(node._id)
            : "";

        var nodeName = node
            ? String(node.name || node.rname || "Urządzenie")
            : "Nie wybrano urządzenia";

        page.textContent = "";

        var panel = document.createElement("section");
        panel.style.padding = "12px";

        var title = document.createElement("h3");
        title.textContent = "PiotrekDev Tools";
        panel.appendChild(title);

        var description = document.createElement("p");
        description.textContent =
            "Narzędzia dla wybranego urządzenia MeshCentral.";
        panel.appendChild(description);

        var name = document.createElement("p");
        name.textContent = "Urządzenie: " + nodeName;
        panel.appendChild(name);

        var id = document.createElement("input");
        id.type = "text";
        id.readOnly = true;
        id.value = nodeId || "Brak ID urządzenia";
        id.style.width = "min(100%, 520px)";
        id.setAttribute("aria-label", "ID urządzenia");
        panel.appendChild(id);

        var status = document.createElement("p");
        status.setAttribute("role", "status");
        status.textContent = "Panel załadowany.";
        panel.appendChild(status);

        var copy = document.createElement("button");
        copy.type = "button";
        copy.textContent = "Kopiuj ID";
        copy.disabled = !nodeId;

        copy.addEventListener("click", function () {
            if (!nodeId) return;

            if (navigator.clipboard &&
                navigator.clipboard.writeText) {
                navigator.clipboard.writeText(nodeId)
                    .then(function () {
                        status.textContent = "ID skopiowano.";
                    })
                    .catch(function () {
                        id.focus();
                        id.select();
                        status.textContent =
                            "Zaznaczono ID. Skopiuj je ręcznie.";
                    });
            } else {
                id.focus();
                id.select();
                status.textContent =
                    "Zaznaczono ID. Skopiuj je ręcznie.";
            }
        });

        panel.appendChild(copy);

        var note = document.createElement("p");
        note.style.marginTop = "16px";
        note.textContent =
            "Zdalna kamera i mikrofon nie są jeszcze zaimplementowane.";
        panel.appendChild(note);

        page.appendChild(panel);
    };

    return obj;
};
