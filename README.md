# Rarbg-Enhancer-UserScript
# Installation
- Install any [UserScript client](https://www.greasyfork.org/) to your browser (this script has only been tested on [Tampermonkey](https://tampermonkey.net/))
- Click the [RAW](https://github.com/buzamahmooza/Rarbg-Enhancer-UserScript/raw/master/Rarbg-Enhancer-UserScript.user.js) link of the script to install it to your userscript client
- Open [rarbg](https://rarbg.to/) or any of its mirrors and the changes should be there
# Features
- Show thumbnails
- Show magnet link and torrent links
- Add image search links for torrents
- Color torrent rows red/green depending on seeders count<br />
<img src="screenshots/Screenshot_Rarbg_general.png?raw=true" alt="General Screenshot" height="400"/>

- Dropdown list to go to other Rarbg mirrors<br />

<img src="screenshots/Screenshot_Rarbg_mirrorDropdown.png?raw=true" alt="Dropdown list to go to other Rarbg mirrors" height="300"/>

- Auto-solve captcha, and bypass the "Click to verify browser" page
- Download all torrrents button
<img src="screenshots/Screenshot_Rarbg_download_all_torrents.png" alt="Download all torrrents button" height="350"/>

- Infinite scrolling
- Disable some adds/redirect links (where the entire page is covered with an invisible redirect button)

# Keyboard shortcuts
- Press ```/``` to focus search bar
- Press ```ctrl+s``` to save an html file containing the page and torrent/magnet links
- Press ```d``` on a torrent page to download the torrent, it's sample images, the html page, and a summary
- Press ``` ` ``` to toggle thumbnail sizes (to load small or large thumbnails, helpful for slow connections)
- Press ```right arrow``` and ```left arrow``` to navigate between pages

# Todo
- [ ] Add menu to change options
- [ ] Add ability to change search engine 
- [ ] Add a search filter bar
- [ ] Fix search filter, make it so that not each space is replaced with a disjunction,
rather make it match the entire phrase, until we reach a `-`.
### Done
- [x] Remove `searchEngine` variable and use `Options.searchEngine` instead, this way you won't have to manually use `GM_setValue` and `getValue` for it
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

# Credits
I wrote the script except for one part which is by the following user:
## Darkred
I copied the code of [darkred](https://greasyfork.org/en/users/2160-darkred) from [this script used to add magnet and torrent links](https://greasyfork.org/scripts/23493-rarbg-torrent-and-magnet-links/code).

I also integrated this [script for converting timestamps to relative format](https://greasyfork.org/scripts/21550-rarbg-convert-torrent-timestamps-to-relative-format).

## Cisco
I originally [this script](https://greasyfork.org/en/scripts/12648-rarbg-add-magnet-link) from the user [Cisco](https://greasyfork.org/en/users/16455-cisco).
This is just a shoutout to Cisco for inspiring me to start, as there was no contribution.
