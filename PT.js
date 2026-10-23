"use strict";

module.exports.PT = function (parent) {
    var obj = {};
    obj.parent = parent;

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

        var idLabel = document.createElement("p");
        idLabel.textContent = "ID urządzenia: " +
            (nodeId || "Brak ID urządzenia");
        panel.appendChild(idLabel);

        var status = document.createElement("p");
        status.setAttribute("role", "status");
        status.textContent = "Panel załadowany.";
        panel.appendChild(status);

        var note = document.createElement("p");
        note.style.marginTop = "16px";
        note.textContent =
            "Funkcje kamery, mikrofonu i rejestrowania klawiszy nie są dostępne w tej wersji.";
        panel.appendChild(note);

        page.appendChild(panel);
    };

    return obj;
};
