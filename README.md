# OpenLP Custom Setup

## First-Time Setup

1. **Open OpenLP Data Folder**

   * In OpenLP:
     `Tools` → `Open Data Folder...`

2. **Close OpenLP**

3. **Delete the data directory**

3. **Clone the custom data repository**

   * Open Command Prompt or PowerShell:

   ```bash
   git clone https://github.com/stoscsg/openlp-data data
   ```

   * Clone it inside the folder opened in step 1

> Switch to a different branch if needed

5. **Install required fonts**

   * [Malayalam Font](https://www.malayalamfont.com/download.php?id=878)
   * [Nirmala UI](https://www.wfonts.com/font/nirmala-ui)

---

## Usage Notes

* **Web Remote Display**

  * Open in browser:
    `http://<IP>:4316/main`
  * Requires **two monitors**. If only one is connected, it may mirror the main screen instead of showing lyrics.

* **OBS Integration**

  * Uses [web-remote](https://gitlab.com/openlp/web-remote/-/tree/master)
  * Custom HTML files located in:
    `data\stages\obs\`
  * OBS browser source URL:
    `http://<IP>:4316/stage/obs`
