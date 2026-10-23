# MeshCentral-Sample

*Released: 2019-11-23*

Sample plugin for the [MeshCentral2](https://github.com/Ylianst/MeshCentral) Project.

## Installation

 Pre-requisite: First, make sure you have plugins enabled for your MeshCentral installation:
>     "plugins": {
>          "enabled": true
>     },
Restart your MeshCentral server after making this change.

 To install, simply add the plugin configuration URL when prompted:
 `https://raw.githubusercontent.com/ryanblenis/MeshCentral-Sample/master/config.json`

## Features

The plugin adds a **Narzędzia** (Tools) tab to the selected device. Its labels
are selected automatically from the browser language (Polish and English are
included). The tab contains safe example buttons:

- copy the selected device ID;
- show the selected device name and ID;
- refresh the tools panel.

Edit `TP.js` to replace the examples with actions appropriate for your
environment. The buttons do not run commands on a remote device.
