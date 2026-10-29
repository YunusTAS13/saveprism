A small update for Linux and macOS.

### What's new
- **Linux:** SavePrism turns off the WebKitGTK renderer that left the window white with some graphics drivers and in
  virtual machines. You no longer need to set `WEBKIT_DISABLE_DMABUF_RENDERER=1` yourself (a value you set is kept).
- **"Where is my save?"** lists the usual save folders on macOS and Linux too, including Steam Proton folders (Steam
  Deck as well). Thanks to @EfeHasNoLuck for the first outside contribution (#10)!

### Download
| System | File |
|---|---|
| Windows 10 and 11 | [SavePrism_0.9.1_x64-setup.exe](https://github.com/huseyincancalti/saveprism/releases/download/v0.9.1/SavePrism_0.9.1_x64-setup.exe) |
| macOS (Intel and Apple silicon) | [SavePrism_0.9.1_universal.dmg](https://github.com/huseyincancalti/saveprism/releases/download/v0.9.1/SavePrism_0.9.1_universal.dmg) |
| Linux | [SavePrism_0.9.1_amd64.AppImage](https://github.com/huseyincancalti/saveprism/releases/download/v0.9.1/SavePrism_0.9.1_amd64.AppImage) or [SavePrism_0.9.1_amd64.deb](https://github.com/huseyincancalti/saveprism/releases/download/v0.9.1/SavePrism_0.9.1_amd64.deb) |

### Good to know
- The Linux and macOS builds are still new. Found a problem? Please open an issue.
- The installers are not code-signed. Windows: **More info → Run anyway**. macOS: **System Settings → Privacy &
  Security → Open Anyway**.
