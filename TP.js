/**
 * @description Narzędzia dla widoku urządzenia w MeshCentral
 * @author Piotrekdev
 * @license Apache-2.0
 * @version v0.1.0
 */

"use strict";

// The exported functions are copied to the MeshCentral browser UI. Keep this
// file dependency-free: it must work in the browser selected by the operator.
module.exports.TP = function (parent) {
    var obj = {};
    obj.parent = parent;
    obj.exports = [
        "onDeviceRefreshEnd",
        "getText",
        "renderTools",
        "copyDeviceId",
        "showDeviceInfo"
    ];

    // Translations are selected automatically from the language of the browser.
    obj.getText = function () {
        var browserLanguage = (navigator.languages && navigator.languages[0]) || navigator.language || document.documentElement.lang || "en";
        var isPolish = (browserLanguage.toLowerCase().indexOf("pl") === 0);
        var pl = {
            tab: "Narzędzia",
            heading: "Narzędzia urządzenia",
            description: "Przykładowe akcje. Możesz tu dodać własne narzędzia administratora.",
            copyId: "Kopiuj identyfikator urządzenia",
            details: "Pokaż informacje o urządzeniu",
            refresh: "Odśwież panel",
            copied: "Identyfikator urządzenia został skopiowany.",
            copyFailed: "Nie można skopiować identyfikatora. Skopiuj go ręcznie z okna informacji.",
            noDevice: "Nie wybrano urządzenia.",
            deviceInfo: "Informacje o urządzeniu",
            deviceName: "Nazwa",
            deviceId: "Identyfikator",
            refreshed: "Panel został odświeżony."
        };
        var en = {
            tab: "Tools",
            heading: "Device tools",
            description: "Example actions. Add your own administrator tools here.",
            copyId: "Copy device ID",
            details: "Show device information",
            refresh: "Refresh panel",
            copied: "The device ID has been copied.",
            copyFailed: "The ID could not be copied. Copy it manually from the information window.",
            noDevice: "No device is selected.",
            deviceInfo: "Device information",
            deviceName: "Name",
            deviceId: "ID",
            refreshed: "Panel refreshed."
        };
        return isPolish ? pl : en;
    };

    obj.onDeviceRefreshEnd = function () {
        var text = pluginHandler.TP.getText();
        pluginHandler.registerPluginTab({ tabId: "tp-tools", tabTitle: text.tab });
        pluginHandler.TP.renderTools();
    };

    obj.renderTools = function (notice) {
        var panel = document.getElementById("tp-tools");
        if (!panel) { return; }

        var text = pluginHandler.TP.getText();
        panel.innerHTML = "";
        panel.style.padding = "12px";

        var title = document.createElement("h2");
        title.textContent = text.heading;
        title.style.marginTop = "0";
        panel.appendChild(title);

        var description = document.createElement("p");
        description.textContent = text.description;
        panel.appendChild(description);

        var actions = document.createElement("div");
        actions.style.display = "flex";
        actions.style.flexWrap = "wrap";
        actions.style.gap = "8px";
        panel.appendChild(actions);

        function addButton(label, handler) {
            var button = document.createElement("button");
            button.type = "button";
            button.textContent = label;
            button.style.padding = "7px 12px";
            button.style.cursor = "pointer";
            button.addEventListener("click", handler);
            actions.appendChild(button);
        }

        addButton(text.copyId, pluginHandler.TP.copyDeviceId);
        addButton(text.details, pluginHandler.TP.showDeviceInfo);
        addButton(text.refresh, function () { pluginHandler.TP.renderTools(text.refreshed); });

        if (notice) {
            var status = document.createElement("p");
            status.textContent = notice;
            status.setAttribute("role", "status");
            status.style.marginTop = "12px";
            panel.appendChild(status);
        }
    };

    obj.copyDeviceId = function () {
        var text = pluginHandler.TP.getText();
        if (!currentNode || !currentNode._id) { alert(text.noDevice); return; }
        var id = currentNode._id;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(id).then(function () {
                pluginHandler.TP.renderTools(text.copied);
            }, function () { alert(text.copyFailed + "\n\n" + id); });
        } else {
            alert(text.copyFailed + "\n\n" + id);
        }
    };

    obj.showDeviceInfo = function () {
        var text = pluginHandler.TP.getText();
        if (!currentNode || !currentNode._id) { alert(text.noDevice); return; }
        var name = currentNode.name || "-";
        alert(text.deviceInfo + "\n\n" + text.deviceName + ": " + name + "\n" + text.deviceId + ": " + currentNode._id);
    };

    return obj;
};
