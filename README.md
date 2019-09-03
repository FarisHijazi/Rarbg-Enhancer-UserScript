# Rarbg-Enhancer-UserScript

## Installation

- Install any [UserScript client](https://www.greasyfork.org/) to your browser (this script has only been tested on [Tampermonkey](https://tampermonkey.net/))
- Click the [RAW](https://github.com/buzamahmooza/Rarbg-Enhancer-UserScript/raw/master/Rarbg-Enhancer-UserScript.user.js) link of the script to install it to your userscript client
- Open [Rarbg.to](https://rarbg.to/) or any of its mirrors and the changes should be there

## Features

This script adds features and enhances the [Rarbg.to](https://rarbg.to/) website

<img src="screenshots/Screenshot_Rarbg_general.png" alt="General Screenshot" max-height="400"/>

- Auto-solve CAPTCHA, and bypass the "Click to verify browser" page  
    ![Automatic CAPTCHA solver and clicks "click here link"](screenshots/Screenshot_auto-captcha.gif)
- Infinite scrolling (Auto-append next page)  
    ![Infinite scrolling](screenshots/infinit-scroll.gif)
  The next page is appended at the bottom so there's no need to manually navigate to it
- Adds thumbnails to torrents  
    ![Adding thumbnails](screenshots/Screenshot_thumbnails-before-after.gif)
- Add magnet link and torrent links
- Add image search links for torrents

- Dropdown list to go to other Rarbg mirrors  
<img src="screenshots/Screenshot_Rarbg_mirrorDropdown.png" alt="Dropdown list to go to other Rarbg mirrors" height=""/>

- Download all torrrents button  
<img src="screenshots/Screenshot_Rarbg_download_all_torrents.png" alt="Download all torrrents button" height="350"/>

- Color torrent rows red/green depending on seeders count
- Disable some adds/redirect links (where the entire page is covered with an invisible redirect button)

## Keyboard Shortcuts

- Press ```/``` to focus search bar
- Press ```ctrl+s``` to save an html file containing the page and torrent/magnet links
- Press ```d``` on a torrent page to download the torrent, it's sample images, the html page, and a summary
- Press ``` ` ``` to toggle thumbnail sizes (to load small or large thumbnails, helpful for slow connections)
- Press ```right arrow``` and ```left arrow``` to navigate between pages

## Credits

The script is written by me, however I have encorperated some code form other the following users:

- Darkred
  - I copied the code of [darkred](https://greasyfork.org/en/users/2160-darkred) from [this script used to add magnet and torrent links](https://greasyfork.org/scripts/23493-rarbg-torrent-and-magnet-links/code).
  - I also integrated this [script for converting timestamps to relative format](https://greasyfork.org/scripts/21550-rarbg-convert-torrent-timestamps-to-relative-format).
- Cisco
  - I originally got the idea from [this script](https://greasyfork.org/en/scripts/12648-rarbg-add-magnet-link) by the user [Cisco](https://greasyfork.org/en/users/16455-cisco).
  - This is just a shoutout to Cisco for inspiring me to start, as there was no contribution.

## Licence

This project licenced under the [MIT](/LICENCE) licence, this script is for educational purposes, I am NOT promoting piracy, this is just a tool to improve a website's UI.

----

## Todo

- [ ] Add menu to change options
- [ ] Add ability to change search engine
- [ ] Add a search filter bar
- [ ] Fix search filter, make it so that not each space is replaced with a disjunction, rather make it match the entire phrase, until we reach a `-`.

## Done

- [x] Remove `searchEngine` variable and use `Options.searchEngine` instead, this way you won't have to manually use `GM_setValue` and `GM_getValue` for it
- [x] Fix appended thumbnail magnet links (sometimes they have "undefined" in them)
- [x] Remove extra header elements (the ones appended from infiniteScroll())
- [x] When choosing categories with hotkeys, rather than pressing the category button, make it change the urlparams so that way seach terms won't be lost
- [x] maybe change hotkeys to Mousetrap
- [x] FIX random extra "DL ML" columns appearing
- [x] Make script run independently of other scripts
- [x] Add an option to change what the thumbnail downloads (magnet link or torrent file)
- [x] Maybe make the colors extra red/green depending on the seeds
- [x] Add forward slash hotkey to go to the search bar
- [x] If there's no next page, scrolling down shouldn't append an extra link
- [x] Complete category search
