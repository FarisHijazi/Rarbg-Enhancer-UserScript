// ==UserScript==
// @name         RARBG Enhancer
// @namespace    https://github.com/buzamahmooza
// @version      0.5.11
// @description  Add a magnet link shortcut and thumbnails of torrents,
// @description  adds a image search link in case you want to see more pics of the torrent, and more!
// @author       Faris Hijazi, with some code from https://greasyfork.org/en/users/2160-darkred
// @include      /https?:\/\/.{0,8}rarbg.*\.\/*/
// @include      https://rarbg.to/*
// @include      http://rarbgmirror.xyz/*
// @include      https://rarbgunblock.com/*
// @include      https://rarbg.unblocked.st/*
// @include      https://*rarbg.*
// @include      http://rarbg4-to.unblocked.lol/
// @include      https://rarbgunblock.com/
// @include      https://rarbgmirror.com/
// @include      https://rarbg.immunicity.host/
// @include      https://rarbg.unblocked.bet/
// @include      http://rarbg-to.pbproxy.red/
// @include      https://rarbg.unblocked.cool/
// @include      https://rarbg.unblockall.xyz/
// @include      https://rarbg.unblocked.red/
// @include      https://rarbg.unlockproj.party/
// @include      http://rarbg-to.pbproxy2.co/
// @include      http://rarbg-to.proxydude.red/
// @include      https://rarbgunblock.com/
// @include      https://www.rarbg.is/
// @include      http://rarbg.com.torrentprox.com/
// @include      https://rarbg.bypassed.cab/
// @include      https://rarbg.unblockmy.link/
// @include      https://rarbg.immunicity.plus/
// @include      https://rarbg.unblocked.team/
// @include      https://rarbg.bypassed.plus/
// @include      https://rarbg.immunicity.cab/
// @include      https://rarbg.unblocked.plus/
// @include      https://rarbgunblock.com/
// @include      https://rarbgmirror.com/
// @include      http://rarbg.bypassed.team/
// @include      https://rarbg.unblocked.cab/
// @include      https://rarbg.immunicity.cab/
// @include      https://rarbg.bypassed.cab/
// @include      https://rarbg.unblocked.plus/
// @include      https://rarbg.immunicity.plus/
// @include      https://rarbg.immunicity.team/
// @include      https://rarbg.immunicity.cool/
// @include      https://rarbg.unblockall.xyz/
// @include      https://rarbg.unblocked.pub/
// @include      https://rarbg.unblocker.cc/
// @include      https://rarbg.proxydude.win/
// @include      https://rarbg.unblocker.win/
// @include      https://rarbg.unblocked.lol/
// @include      https://sitenable.co/proxify.php?proxy=c2l0ZW5hYmxlLmNv&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://sitenable.info/proxify.php?proxy=c2l0ZW5hYmxlLmluZm8=&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://siteget.net/proxify.php?proxy=c2l0ZWdldC5uZXQ=&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://sitenable.ch/proxify.php?proxy=c2l0ZW5hYmxlLmNo&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://freeproxy.io/proxify.php?proxy=ZnJlZXByb3h5Lmlv&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://filesdownloader.com/proxify.php?proxy=ZmlsZXNkb3dubG9hZGVyLmNvbQ==&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://freeanimesonline.com/proxify.php?proxy=ZnJlZWFuaW1lc29ubGluZS5jb20=&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://sitenable.pw/proxify.php?proxy=c2l0ZW5hYmxlLnB3&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://sitenable.top/proxify.php?proxy=c2l0ZW5hYmxlLnRvcA==&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://rarbg.unblockedall.site/
// @include      https://rarbg.unblockmy.site/
// @include      http://rarbg-to.proxydude.xyz/
// @include      https://rarbgproxy.org/
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @icon         https://www.google.com/s2/favicons?domain=rarbg.com
// @run-at       document-idle
// @updateUrl    https://github.com/buzamahmooza/Rarbg-Enhancer-UserScript/raw/master/Rarbg-Enhancer-UserScript.user.js
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://unpkg.com/infinite-scroll@3.0.5/dist/infinite-scroll.pkgd.min.js
// @require      https://raw.githubusercontent.com/antimatter15/ocrad.js/master/ocrad.js
// @require      https://raw.githubusercontent.com/ccampbell/mousetrap/master/mousetrap.min.js
// @require      https://github.com/buzamahmooza/Helpful-Web-Userscripts/raw/master/download_script.user.js
// @require      https://github.com/bevacqua/horsey/raw/master/dist/horsey.js
// ==/UserScript==

// @require      https://raw.githubusercontent.com/naptha/tesseract.js/master/dist/tesseract.min.js
// AddColumn() and add magnetLinks() code taken from:      https://greasyfork.org/en/scripts/23493-rarbg-torrent-and-magnet-links/code

/**
 * Sequence of function calls
 *
 * appendColumn()
 *  -> appendColumnSingle()
 *      -> addDlAndMl()
 * observeDocument(dealWithTorrents)
 * */

console.log('Rarbg script running');

// adding Element.before() and Element.after() (since some browsers like MS Edge don't already have them)
if (Element.prototype.before === undefined) Element.prototype.before = function (newNode) {
    if (this.parentElement) {
        return this.parentElement.insertBefore(newNode, this);
    }
};
if (Element.prototype.after === undefined) Element.prototype.after = function (newNode) {
    if (this.parentElement) {
        return this.parentElement.insertBefore(newNode, this.nextSibling);
    }
};

(function () {

    const debugmode = true; // debug mode (setting this to false will disable the console logging)

    const TORRENT_ICO = "https://dyncdn.me/static/20/img/16x16/download.png";
    const MAGNET_ICO = "https://dyncdn.me/static/20/img/magnet.gif";
    const trackers = 'http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710';

    const singleTorrentPage = matchSite(/\/torrent\//);
    const isOnThreatDefencePage = /threat_defence/i.test(location.href);
    let currentDocument = document; // placeholder to keep track of the latest document object (since multiple documents are used)

    const url = new URL(location.href);

    const Options = $.extend({
        thumbnailLink: "ml", //options:  "ml", "tor", "img", "page"
        addThumbnails: true, // if set to false, the content thumbnails will not be used, magnet or torrent thumbnails will be used isntead
        showGeneratedSearchQuery: false,
        addCategoryWithSearch: true, // when searching for a movie title like "X-men", will become "X-mex movie"
        largeThumbnails: true,
        defaultImageSearchEngine: "google",
        cycleTorrentsIfBlocked: true,
        infiniteScrolling: true,
        mirrors: ["http://rarbgmirror.xyz",
            "https://rarbgproxy.org",
            "https://rarbgunblock.com",
            "http://rarbg-to.proxydude.red",
            "https://rarbgprx.org",
            "http://rarbg-to.pbproxy.red",
            "http://rarbg.bypassed.team",
            "https://rarbg.unblocker.win",
            "http://rarbg-to.proxydude.xyz",
            "http://rarbg.com.torrentprox.com",
            "http://rarbg-to.pbproxy2.co",
            "https://www.rarbg.is"]
    }, GM_getValue("RarbgOptions"));

    // write back the Options to the storage (in the case that they changed)
    window.addEventListener("unload", function () {
        GM_setValue("RarbgOptions", Options);
    });

    Math.clamp = function (a, min, max) {
        return a < min ? min :
            a > max ? max : a;
    };

    const SearchEngines = {
        google: {
            name: "Google",
            imageSearchUrl: (q) => `https://www.google.com/search?&hl=en&tbm=isch&q=${encodeURIComponent(q)}`
        },
        ddg: {
            name: "DuckDuckGo",
            imageSearchUrl: (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}&atb=v73-5__&iar=images&iax=images&ia=images`
        },
        yandex: {
            name: "Yandex",
            imageSearchUrl: (q) => `https://yandex.com/images/search?text=${encodeURIComponent(q)}`
        }
    };
    let searchEngine = {};
    initSearchEngine();


    var tbodyEl = q('body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > table.lista2t > tbody');
    if (!tbodyEl) console.warn("tbody element not found!");


    const title = 'DL&nbsp;ML',
        mls = appendColumn();
    var appendedPageNum = 1;

    // click to verify browser
    qa('a[href^="/threat_defence.php?defence=1"]').forEach(a => a.click());

    var torrents = qa('a[onmouseover][href^="/torrent/"]');

    //todo: change detection from detecting page blocked to detecting a unique element on the rarbg pages, this way it'll work for more than just ksa blocked pages
    if (isPageBlockedKSA()) {
        location.assign(Options.mirrors[Math.floor(Math.random() * Options.mirrors.length)]);
    }

    const searchBox = document.querySelector('#searchinput');
    const torrentLinks = Array.from(document.querySelectorAll('table > tbody > tr.lista2 a[title]'));

    let isOnIndexPage = searchBox !== null;

    let width = 150, maxwidth = 400, maxheight = 300;

    var thumbnailsCssBlock = addCss('');
    // language=CSS
    var cssBlock = addCss(
        `td.thumbnail-cell {
    text-align: center;
    height: ${maxheight}px;
}

td.thumbnail-cell > a {
    display: contents;
    padding: 9px;
}

/*the horsey suggestion thumbnails*/
.suggestion-thumbnail {
    max-width: 100px;
    max-height: 100px;
}

table.lista2t tr.lista2 td {
}

a.torrent-ml, a.torrent-dl {
    display: table-cell;
    padding: 5px;
}

a.torrent-ml > img, a.torrent-dl > img {
    width: 40px;
}

.search {
    font-size: 15px;
    padding: 20px;
    display: -webkit-box;
    background-color: #b7b7b73b;
    margin: 10px;
    font-family: sans-serif;
}

a.search:link { color: red; }
a.search:visited { color: green; }
a.search:hover { color: hotpink; }
a.search:active { color: blue; }

.zoom {
    /*padding: 50px;*/
    transition: transform .2s; /* Animation */
    margin: 0 auto;
}

.zoom:hover {
    transform: scale(1.5); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
}

td.lista {
    color: #000;
    font-size: 10pt;
    font-family: sans-serif;
}

/*torrent links*/
tr.lista2 > td.lista > a[onmouseover] {
    width: max-content;
    font-size: 15px !important;
    padding: 20px !important;
    display: -webkit-box !important;
    background-color: rgba(183, 183, 183, 0.23) !important;
    margin: 10px !important;
    font-family: sans-serif !important;
}`
    );
    updateCss();

    var headCell = document.createElement('td');
    headCell.innerHTML = 'Thumbnails';
    headCell.classList.add('header6');
    headCell.classList.add('header40');

    // Adds the click functionality to the Thumbnails header
    headCell.addEventListener('click', toggleThumbnailSize);

    var fileColumnHeader = q('.lista2t tr:first-child td:nth-child(2)');
    if (!!fileColumnHeader) fileColumnHeader.parentElement.insertBefore(headCell, q('.lista2t tr:first-child td:nth-child(2)'));


    /** Plays audio
     * @author https://stackoverflow.com/a/17762789/7771202 */
    const PlaySound = (function () {
        const df = document.createDocumentFragment();
        return function Sound(src) {
            var snd = new Audio(src);
            df.appendChild(snd); // keep in fragment until finished playing
            snd.addEventListener('ended', function () {
                df.removeChild(snd);
            });
            snd.play();
            return snd;
        }
    }());
    // sound file from: http://freesound.org/data/previews/166/166186_3034894-lq.mp3
    var snd = PlaySound("data:audio/wav;base64," + "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");


    // === end of variable declarations ===


    $(document).ready(function main() {
        if (isOnThreatDefencePage) { // check for captcha
            if (q('#solve_string')) {
                console.log('Rarbg threat defence page');
                try {
                    solveCaptcha();
                } catch (e) {
                    console.error("Error occurred while trying to solve captcha:\n", e);
                }
            }
        } else { // not OnThreadDefencePage
            if (singleTorrentPage) {
                // addCss(`body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(5) > td:nth-child(2) > table > tbody > td { display: inline-table; }`);
                let mainTorrentLink = q('body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(1) > td.lista > a:nth-child(2)');
                addImageSearchAnchor(mainTorrentLink, mainTorrentLink.innerText);

                var i = 0;
                for (const torrent of torrents) {
                    //creating and adding thumbnails
                    const cell = document.createElement('td'),
                        thumbnailLink = document.createElement('a'),
                        thumbnailImg = document.createElement('img');
                    thumbnailLink.href = torrent.href;

                    cell.classList.add('thumbnail-cell');
                    cell.appendChild(thumbnailLink);
                    // thumbnail
                    thumbnailImg.classList.add('preview-image');

                    let thumb = extractThumbnailSrc(torrents[i]);
                    thumbnailImg.setAttribute('smallSrc', thumb);
                    thumbnailImg.setAttribute('bigSrc', getLargeThumbnail(thumb));

                    setThumbnail(thumbnailImg);
                    thumbnailLink.appendChild(thumbnailImg);

                    torrent.closest('tr').after(cell);
                    thumbnailImg.style.width = "auto";
                    thumbnailImg.style["max-height"] = "none";
                    thumbnailImg.style["max-width"] = "none";

                    i++;
                }

                // remove VPN row
                const vpnR = q("body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(2)");
                if (vpnR) {
                    vpnR.remove();
                }

                // fullres for imagecurl.com
                for (const imgcurlImg of qa('img[src^="https://imagecurl.com/images/"]')) {
                    if (imgcurlImg) {
                        const fullres = imgcurlImg.src.replace("_thumb", "");
                        imgcurlImg.src = fullres;
                        imgcurlImg.closest('a').href = fullres;
                        imgcurlImg.style["max-width"] = "100%";
                    }
                }
                // fullres for imgprime.com
                // link:    https://imgprime.com/imga-u/b/2019/04/02/5ca35d660e76e.jpeg.html
                // img:     https://imgprime.com/u/b/2019/04/02/5ca35d660e76e.jpeg
                for (const imgprime of qa('img[src^="https://imgprime.com/u/s/"]')) {
                    console.log('replacing img: ', imgprime);
                    if (imgprime) {
                        const a = imgprime.closest('a');
                        const fullres = a.href.replace(/(imga-)|(\.html)/g, "");
                        imgprime.src = fullres;
                        a.href = fullres;
                        imgprime.style["max-width"] = "100%";
                    }
                }
                // fullres for imagefruit.com
                for (const imagefruitImg of qa('img[src*="/tn/t"]')) {
                    if (imagefruitImg) {
                        const fullres = imagefruitImg.src.replace("/tn/t", "/tn/i");
                        imagefruitImg.src = fullres;
                        imagefruitImg.closest('a').href = fullres;
                        imagefruitImg.style["max-width"] = "100%";
                    }
                }

                // putting the "Description:" row before the "Others:" row
                getElementsByXPath('(//tr[contains(., "Poster\:")])[last()]')[0].after(getElementsByXPath('(//tr[contains(., "Description\:")])[last()]')[0]);

                Mousetrap.bind("d", function (e) {
                    const torrent = q('[onmouseover="return overlib(\'Click here to download torrent\')"]');
                    torrent.click();

                    function getRow(rowText) {
                        return getElementsByXPath(`(//tr[contains(., "${rowText}")])[last()]`);
                    }

                    const torrentName = torrent.innerText;
                    const descriptionImgs = getElementsByXPath('(//tr[contains(., "Description\:")])[last()]//img');
                    const posterImg = getRow("Poster:")[0];
                    posterImg.alt = torrentName + "_poster";
                    var i = 1;
                    for (const descriptionImg of descriptionImgs) {
                        descriptionImg.alt = torrentName + "_description_" + (i++);
                    }
                    descriptionImgs.push(posterImg);
                    descriptionImgs.push({ fileURL: torrent.href, fileName: torrentName });
                    var zip = zipFiles(descriptionImgs);
                    zip.file(document.title + ".html", new Blob([document.body.outerHTML], { type: 'text/plain' }));
                    const rowsObj = {};
                    ["Title:", "Genres:", "Actors:", "Stars:", "Series:", "Plot:", "Tags:"].forEach(row => {
                        let rowContent = getRow(row)[0];
                        if (rowContent)
                            rowsObj[row] = rowContent.innerText;
                    });
                    const rowsText = JSON.stringify(rowsObj, null, 4);
                    console.debug('rowsObj: ', rowsObj);
                    let summary = document.title + "\n\n" + rowsText;
                    zip.file(document.title + " (summary).txt", new Blob([summary], { type: 'text/plain' }));

                    let zipped = false;
                    zip.onGenZip = function () {
                        zipped = true;
                    };

                    setTimeout(function () {
                        if (!zipped) {
                            console.log('zip timed out, forcing download');
                            zip.genZip();
                        }
                    }, 3000);
                });

                void (0);
            } else if (isOnIndexPage) { // if on torrent page (index)
                searchBox.onkeyup = updateSearch;

                if (Options.infiniteScrolling) { // infiniteScrolling
                    (function makeInfiniteScroll() {
                        const tableLvl2 = "div.content-rounded table.lista-rounded tbody:nth-child(1) tr:nth-child(2) td:nth-child(1) > table.lista2t:nth-child(9)";
                        const tbody = tableLvl2 + " > tbody";
                        const nav = "td:nth-child(2) div.content-rounded table.lista-rounded tbody:nth-child(1) > tr:nth-child(3)";

                        const container = getElementsByXPath("//table[@class='lista2t']")[0];
                        var infScroll = new InfiniteScroll(container, {
                            path: 'a[title="next page"]',
                            append: tbody, // the table
                            hideNav: nav,
                            scrollThreshold: 600
                        });

                        // upon appending a new page
                        infScroll.on('append', function (response, path, items) {
                            if (items.length) {
                                const lista2s = items[0].querySelectorAll('.lista2');
                                for (const lista2 of lista2s) {
                                    tbodyEl.appendChild(lista2);
                                    appendColumnSingle(lista2.childNodes[1]);
                                }
                            }

                            // remove extra appended headers
                            tbodyEl.nextElementSibling.remove();
                            // filter the new torrents that just arrived
                            updateSearch();
                        });

                    })();
                }

                // todo: use horsey and fuzzysearch for string matching and for showing suggestions
                // todo: try to put updateSearch() into the horsey source() option
                if (typeof (horsey) !== "undefined") {
                    const myHorsey = horsey(searchBox, {
                        source: [{
                            list: torrentLinks.map(a => ({
                                text: a.title || a.innerText,
                                value: a
                            }))
                        }],
                        getText: 'text',
                        getValue: 'value',
                        renderItem: function (li, suggestion) {
                            console.debug(
                                "Suggestion:", suggestion,
                                "\nli:", li
                            );
                            var image = '<img class="suggestion-thumbnail" src="' +
                                suggestion.value.closest('.lista2').querySelector('img.preview-image').src
                                + '"  alt="' + suggestion.text + '"/>';
                            li.innerHTML = `${image}<span>${suggestion.text}</span>`;
                        }
                    });
                }
            }

            (function addColumnHeader() {
                var nearHeader = q('.lista2t > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3)'); // the first cell (header cell) of the new column
                if (!nearHeader) {
                    console.warn("Problem: Header not found");
                    return;
                }
                var header = nearHeader.cloneNode(false);
                nearHeader.before(header);
                // noinspection JSUnusedAssignment
                nearHeader = undefined; // clear memory

                header.setAttribute('class', 'header6');
                header.setAttribute('align', 'center');
                header.setAttribute('id', 'DL-header');

                var dlAnchor = createElement('<a>DL</a>');
                header.addEventListener('click', downloadAllTorrents);
                header.appendChild(dlAnchor);
            })();

            (function onLoad() {
                console.log('loaded');
                document.body.onclick = null; // remove annoying click listeners

                // remove annoying search description
                const searchDescription = q("#SearchDescription");
                if (searchDescription) searchDescription.remove();

                // remove annoying signup form that doesn't work
                const signinForm = q('form[action="/login"]');
                if (signinForm) signinForm.remove();
                const signinTab = q('body > table:nth-child(5) > tbody > tr > td > table > tbody > tr > td.header4');
                if (signinTab) signinTab.remove();


                // remove recommended torrents
                const recTor = q('tr > [valign="top"] > [onmouseout="return nd();"]');
                if (recTor) recTor.closest('div').remove();

                // remove "recommended torrents" title
                const recTitle = getElementsByXPath('(//text()[contains(., "Recommended torrents \:")])/../../..')[0];
                if (recTitle) recTitle.remove();

                // scroll the table to view (top of screen will be the first torrent)
                const mainTable = q("body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(1) > td > table.lista2t");
                if (mainTable) mainTable.scrollIntoView();


                // adding a dropdown list for mirrors
                (function addMirrorsDropdown() {
                    const blankTab = q('td.header:nth-child(1)');
                    if (!blankTab) return;

                    const mirrorsTab = document.createElement('td');
                    mirrorsTab.className = 'header3';
                    mirrorsTab.innerText = "Switch to mirror site:";

                    const mirrorsSelect = document.createElement('select');
                    mirrorsSelect.onchange = function () {
                        if (!this.value) return;
                        const split = location.href.split('/').slice(2);
                        split[0] = this.value;
                        const newUrl = split.join('/');
                        location.assign(newUrl);
                    };
                    mirrorsTab.appendChild(mirrorsSelect);

                    for (const mirror of Options.mirrors) {
                        const option = document.createElement('option');
                        option.value = mirror;
                        option.innerText = new URL(mirror).hostname;
                        if (option.innerText === location.hostname)
                            continue;

                        mirrorsSelect.appendChild(option);
                    }

                    const option = document.createElement('option');
                    option.innerText = location.hostname;
                    option.setAttribute('selected', "");
                    mirrorsSelect.appendChild(option);

                    blankTab.after(mirrorsTab);
                })();

                observeDocument((target) => {
                    dealWithTorrents(target);

                    // remove links for adds that cover the screen
                    for (const x of qa('[style*="2147483647"], a[href*="https://s4yxaqyq95.com/"]')) {
                        console.log('removed redirect element:', x);
                        x.remove();
                    }
                });
            })();
        }

    });

    (function bindKeys() {
        if (typeof Mousetrap === "undefined") return;
        Mousetrap.bind(["space"], (e) => {
            appendPage(currentDocument.querySelector('a[title="next page"]'));
            solveCaptcha(); // todo: remove this, this is just for debugging
        });
        Mousetrap.bind(["/"], (e) => {
            console.log('clicking search input');

            e.preventDefault();
            const searchBar = q("#searchinput");
            searchBar.click();
            searchBar.scrollIntoView();
            searchBar.select();
            searchBar.setSelectionRange(0, searchBar.value.length); // this one is for compatability
        });
        Mousetrap.bind(["x"], (e) => {
            if (typeof URL !== "undefined") {
                const url = new URL(location.href);
                url.searchParams.set('category', '4');
                url.pathname = "/torrents.php";
                location.assign(url.toString().replace('category=4', 'category=4;2'));
            } else {
                location.assign("/torrents.php?category=2;4");
            }
        });
        Mousetrap.bind(["`"], toggleThumbnailSize);
        Mousetrap.bind(["ctrl+s"], (e) => {// saves an html file containing the data
            const rows = qa('table > tbody > tr.lista2');
            var torrentJsons = Array.from(rows).map(row => {
                try {
                    const a = row.querySelector('a[onmouseover]');
                    const thumbnail = row.querySelector('td.thumbnail-cell > a > img.preview-image ');
                    const ml = row.querySelector('.torrent-ml');
                    const torrentLink = row.querySelector('.torrent-dl');
                    return {
                        title: a.title || a.innerText,
                        page: a.href,
                        torrentLink: torrentLink ? torrentLink.href : '',
                        magnetLink: ml ? encodeURI(ml.href) : '',
                        thumbnailSrc: thumbnail ? thumbnail.src : ""
                    };
                } catch (e) {
                }
            });
            var torrentsObject = {
                documentTitle: document.title,
                date: Date.now(),
                torrents: torrentJsons
            };

            const tableOuterHTML = getElementsByXPath("//table[@class='lista2t']")[0].outerHTML;
            const summaryHTML = `<html lang="en">${document.head.outerHTML}<body>${tableOuterHTML}</body></html>`;

            anchorClick(makeTextFile(JSON.stringify(torrentsObject, null, 4)), document.title + ' [' + rows.length + ']' + ' info.json');
            anchorClick(makeTextFile(summaryHTML), document.title + ' [' + rows.length + ']' + ' summary.html');
        });
    })();


    function solveCaptcha() {
        console.log('solving captcha...');
        const container = q('tbody > :nth-child(2)');
        const img = container.querySelector('img');
        const captcha = q('#solve_string');
        const submitBtn = q('#button_submit');

        if (img.naturalHeight === 0 && img.naturalWidth === 0) {
            console.log("image hasn't loaded, refreshing to new captha page");
            url.searchParams.set('defence', '1');
            location.assign(url.toString());
            void (0);
            return;
        }

        function uriToImageData(uri) {
            return new Promise(function (resolve, reject) {
                if (uri == null) return reject();
                var canvas = document.createElement('canvas'),
                    context = canvas.getContext('2d'),
                    image = new Image();
                image.addEventListener('load', function () {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    resolve(context.getImageData(0, 0, canvas.width, canvas.height));
                }, false);
                image.src = uri;
            });
        }
        function getBase64Image(img, excludeUrlProtocol=false) {
            // Create an empty canvas element
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            // Copy the image contents to the canvas
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Get the data-URL formatted image
            // Firefox supports PNG and JPEG. You could check img.src to
            // guess the original format, but be aware the using "image/jpg"
            // will re-encode the image.
            var dataURL = canvas.toDataURL('image/png');

            return excludeUrlProtocol && dataURL.replace(/^data:image\/(png|jpg);base64,/, '') || dataURL;
        }

        var imageText = OCRAD(getBase64Image(img));
        console.log('OCRAD result:', imageText);
        captcha.value = imageText;
        submitBtn.display = '';
        submitBtn.click();

        uriToImageData(getBase64Image(img)).then((imageData) => {
            var imageText = OCRAD(imageData);
            console.log('OCRAD result:', imageText);
            captcha.value = imageText;
            submitBtn.display = '';

            submitBtn.click();
        });
    }

    /**
     * hides all torrents that do not match the search query
     * todo:maybe generalize this function to just return the resulting score for each item,
     *      this way it can be portable and made as a library and use elsewhere
     *      and then you can iterate and hide them later
     */
    function updateSearch() {
        if (!searchBox) throw new Error("Search box not found");
        const query = searchBox.value.trim();
        torrents = document.querySelectorAll('table > tbody > tr.lista2 a[title]');
        const convertedQuery = query.replace(/[!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]+/g, '.').trim()
            .replace(/\s+/, '|');

        const completelyNegativeQuery = (function () {
            for (const term of convertedQuery.split('|').filter(str => str.length !== 0)) {
                // if a positive search term
                if (term.indexOf('-') === -1) return false;
            }
            return true;
        })();

        const regex = new RegExp(convertedQuery.replace(/-/g, '|')
            .replace(/\|\|/g, '|')
            .replace(/^\|/, ''),// '|' that is at the beginning of a word
            'ig');


        console.log(
            'regex:', regex,
            '\nconverted query:', convertedQuery,
            '\ncompletelyNegativeQuery:', completelyNegativeQuery
        );

        for (const a of torrents) {
            const title = a.title || a.innerText;
            if (!title) continue; // skip if empty title

            // done: make it so that it doesn't just check if "query" starts with '-', rather, check each match and check if it starts with '-'
            var match = title.match(regex);

            // collect negative matches
            const matches = (!!match) ? Array.from(match) : [];
            var negativeMatches = matches.filter(group => // tests if it's a negative match (if there is a '-' before the search term)
                group && new RegExp('-' + group, 'ig').test(query)
            );
            var positiveMatches = matches.filter(group => // tests if it's a negative match (if there is a '-' before the search term)
                group && !new RegExp('-' + group, 'ig').test(query)
            );

            /*
            * in the case of a completelyNegativeQuery,
            * we want to show elements that don't have negativeMatches,
            * even if they have no positiveMatches
            */
            const hideCondition = query && (completelyNegativeQuery ? negativeMatches.length :
                negativeMatches.length || !positiveMatches.length);

            /*console.debug(
                `[${hideCondition ? 'hide' : 'show'}]   "${title}"`,
                '\nmatches:', matches,
                '\npositiveMatches:', positiveMatches,
                '\nnegativeMatches:', negativeMatches
            );*/

            // hide or do not hide depending on hideCondition
            a.closest('.lista2').style.display = hideCondition ? 'none' : '';
        }
    }

    function updateCss() {
        thumbnailsCssBlock.innerText =
            'td.thumbnail-cell > a > img.preview-image {' +
    ' max-width: ' + maxwidth + 'px;' +
    ' max-height: ' + maxheight + 'px; ' +
'}';
    // width: ${!Options.addThumbnails ? width * 0.5 : (!Options.largeThumbnails ? width : width * 2)}px;
    }

    function observeDocument(callback) {
        callback(document.body);
        new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                if (!mutations[i].addedNodes.length) continue;
                callback(mutations[i].target);
            }
        }).observe(document.body, {
            childList: true, subtree: true,
            attributes: false, characterData: false
        });
    }

    function dealWithTorrents(node) {
        torrents = node.querySelectorAll('.lista2 td:nth-child(2) [href^="/torrent/"]');
        for (let i = 0; i < torrents.length; i++) {
            var row = torrents[i].closest('tr');


            // = adding relative time to columns
            (function createAndAddThumbnailCell() {

                // = Creating and adding thumbnail cell
                const cell = document.createElement('td'),
                    thumbnailLink = document.createElement('a'),
                    thumbnailImg = document.createElement('img');

                cell.classList.add('thumbnail-cell');
                cell.appendChild(thumbnailLink);
                thumbnailLink.appendChild(thumbnailImg);

                // thumbnail link
                (function setLinkHref() {
                    switch (Options.thumbnailLink) {
                        case 'ml':
                            try {
                                thumbnailLink.href = mls[i];
                                if (!/^magnet:\?/.test(thumbnailLink.href))  // noinspection ExceptionCaughtLocallyJS
                                    throw new Error('Not a magnet link');
                            } catch (e) {
                                thumbnailLink.href = getTorrentDownloadLinkFromAnchor(torrents[i]);
                            }
                            break;
                        case 'tor':
                            try {
                                thumbnailLink.href = getTorrentDownloadLinkFromAnchor(torrents[i]);
                            } catch (e) {
                                thumbnailLink.href = mls[i];
                                if (debugmode) console.debug('Using MagnetLink for torrent thumbnail since torrent failed:', mls[i]);
                            }
                            break;
                        case 'page':
                            thumbnailLink.href = torrents[i].href;
                            break;
                    }
                })();
                if (thumbnailLink.href.indexOf('undefined') >= 0)
                    console.warn(
                        'thumbnail Link:', thumbnailLink,
                        'torrents[i]:', torrents[i].innerText,
                        'getTorrentDownloadLinkFromAnchor(torrents[i])', getTorrentDownloadLinkFromAnchor(torrents[i])
                    );

                // thumbnail
                thumbnailImg.onmouseover = function playSound() {
                    try {
                        var snd = PlaySound('data:audio/wav;base64,' + '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');
                    } catch (e) {
                    }
                };
                thumbnailImg.classList.add('preview-image');
                const src = extractThumbnailSrc(torrents[i]);
                thumbnailImg.setAttribute('smallSrc', src);
                thumbnailImg.setAttribute('bigSrc', getLargeThumbnail(src));
                setThumbnail(thumbnailImg);

                torrents[i].parentElement.before(cell);
            })();

            (function changeDateToRelativeTime() {
                var column_Added = row.querySelector('td:nth-child(5)');
                var minutes = ((Date.now() - Date.parse(column_Added.innerHTML)) / (1000 * 60)),
                    hours = 0
                ;

                if (minutes > 60) {
                    hours = Math.round(minutes / 60);
                    minutes = minutes % 60;
                }
                minutes = Math.round(minutes);

                if (debugmode) console.log('column_Added:', column_Added);

                column_Added.innerHTML =
                    column_Added.innerHTML + '<br>\n' + ((hours ? (hours + 'h') : '') + minutes ? (minutes + 'min') : '') + '&nbsp' + 'ago';
            })();

            // color backgrounds depending on the number of seeders
            (function colorBackground() {
                /**
                 * @param numberOfSeeders
                 * @return {number} alpha channel (between 0 and 1 but clamped between [0.2, 0.6]) according to the number of seeders
                 */
                const mapSeedersToAlpha = numberOfSeeders => {
                    const alpha = 0.013 * Math.log(1 + numberOfSeeders) / Math.log(1.15);
                    return Math.clamp(alpha, 0.1, 0.4);
                };

                const seedersFont = row.querySelector('font[color]');
                const statusRGB = hex2rgb(seedersFont.getAttribute('color')); // to color the row
                const clampedAlpha = mapSeedersToAlpha(parseInt(seedersFont.innerText));
                statusRGB.map(x => x * clampedAlpha * 10);
                statusRGB.push(clampedAlpha); // add alpha channel

                row.style.background = 'rgb(' + statusRGB.join(', ') + ')';
            })();
        }
        torrents.forEach(addImageSearchAnchor);
    }

    function setThumbnail(thumbnail) {
        if (!thumbnail.src) {
            thumbnail.src = thumbnail.getAttribute('smallSrc');
        }

        // creating image objects to add load listeners to them
        var smallImage = new Image();
        smallImage.src = thumbnail.getAttribute('smallSrc');
        // set to small src when loading small image
        smallImage.onLoad = function () {
            thumbnail.setAttribute('small-loaded', '');
            thumbnail.src = thumbnail.getAttribute('smallSrc');

            if (Options.largeThumbnails && thumbnail.getAttribute('big-loaded')) {
                thumbnail.src = thumbnail.getAttribute('bigSrc');
            }
        };
        // creating image objects to add load listeners to them
        var bigImage = new Image();
        bigImage.src = thumbnail.getAttribute('bigSrc');
        // set to small src when loading small image
        bigImage.onLoad = function () {
            thumbnail.setAttribute('big-loaded', '');

            if (Options.largeThumbnails) {
                thumbnail.src = thumbnail.getAttribute('bigSrc');
            }
        };

        // thumbnail.src = thumbnail.getAttribute((!Options.largeThumbnails ? 'smallSrc' : 'bigSrc'));
        thumbnail.src = Options.largeThumbnails?
            thumbnail.getAttribute('bigSrc'):
            thumbnail.getAttribute('smallSrc');

        if (!Options.addThumbnails) {
            thumbnail.src = thumbnail.closest('a').href.indexOf('magnet:?') === 0 ? // if magnet link
                MAGNET_ICO : // magnet icon
                TORRENT_ICO; // else, just put torrent icon
        }
    }

    function toggleThumbnailSize() {
        Options.largeThumbnails = !Options.largeThumbnails;
        console.log('toggleThumbnailSize(' + (Options.largeThumbnails ? 'large' : 'small') + ')');
        qa('.preview-image').forEach(setThumbnail);
        updateCss();
        if (debugmode) console.log('toggling thumbnail sizes. Options.largeThumbnails = ', Options.largeThumbnails);
    }

    function bigThumbHandleError() {
        this.removeEventListener("error", bigThumbHandleError);
        this.src = this.oldSrc;
        console.warn('Failed to load big thumbnail for', this.src, ' Attempting xml request');
        addMagnetCell(this.parentElement);
    }

    // gets the large thumbnail from the small thumbnail (works for rarbg thumbnails)
    function getLargeThumbnail(smallThumbUrl) {
        // Movie example
        // Small pic:   http://dyncdn.me/mimages/316661/over_opt.jpg
        // Big pic:     http://dyncdn.me/mimages/316661/poster_opt.jpg
        return smallThumbUrl
            .replace('over_opt', 'poster_opt') // movie thumbnail replacement
            // other thumbnail replacement
            .replace('static/over', 'posters2/' + smallThumbUrl.replace(/(.*?)over\//, '').charAt(0)) //put "posters2" + the first character after the '/'
            ;
    }

    /** @Return returns the extracted source url from the 'onmouseover' attribute */
    function extractThumbnailSrc(torrentAnchor) {
        if (!torrentAnchor) console.warn('null torrent anchor:', torrentAnchor);
        let thumbnailSrc = '';
        try {
            // thumbnailSrc = thumbnailSrc.match(/(?<=(return overlib('\<img src\=\')))(.*?)(?=(\' border\=0\>\'))/i)[0];
            thumbnailSrc = torrentAnchor.getAttribute('onmouseover') || "";
            thumbnailSrc = thumbnailSrc.substring("return overlib('<img src=\'".length + 1, thumbnailSrc.length - "\' border=0>'".length - 2);
        } catch (r) {
            thumbnailSrc = MAGNET_ICO;
            console.error('extractThumbnailSrc error:', r);
        }
        debugmode && console.debug('extractThumbnailSrc(', torrentAnchor, ')->', thumbnailSrc);
        return thumbnailSrc;
    }

    function addImageSearchAnchor(torrentAnchor) {
        const searchTd = document.createElement('td'),
            searchLink = document.createElement('a')
            ;
        searchTd.classList.add("search");
        searchTd.style["border-top-width"] = "10px";
        searchTd.style["padding-top"] = "10px";

        //replacing common useless torrent terms
        let searchQuery = clearSymbolsFromString(torrentAnchor.title || torrentAnchor.innerText)
            .replace(/\s\s+/g, ' ') // removes double spaces
            .trim()
            ;

        /**
         * @return {string} the category of the torrent (Movies, XXX, TV Shows, Games, Music, Software, Non XXX)
         */
        function getCategory(torrentAnchor) {
            const anchor = torrentAnchor.parentElement.parentElement.parentElement.querySelector('table.lista2t a[href^="/torrents.php?category="]');
            /*
             *  extracting the code of the category from the url.
             *  example:
             *    TV shows:   .../torrents.php?category=18
             *    code is:  18
             */
            const categoryCode = anchor.href.split('torrents.php?category=').pop();
            // a map of the
            const catMap = {
                'Movies': 'Movies',
                '4': "XXX",
                '23': "Music",
                '18': "TV show",
                '33': "Software",
            };
            if (catMap.hasOwnProperty(categoryCode)) {
                return catMap[categoryCode];
            } else {
                if (debugmode) console.debug('Unkown category:', categoryCode);
            }
        }

        searchLink.href = searchEngine.imageSearchUrl(searchQuery);
        try {
            if (Options.addCategoryWithSearch && !new RegExp(getCategory(torrentAnchor)).test(searchLink.href))
                searchLink.href += " " + getCategory(torrentAnchor);
        } catch (e) {
            console.warn("unable to get category", searchLink);
        }
        if (debugmode) console.debug('search url:', searchLink.href);
        searchLink.classList.add('search');
        searchLink.target = "_blank";

        var searchEngineText = document.createElement('p5');
        var qText = document.createElement('p6');
        searchEngineText.innerHTML = `${searchEngine.name} Image Search`;
        qText.innerHTML = (Options.showGeneratedSearchQuery) ? ': ' + searchQuery : '';

        let searchIcon = document.createElement('img');
        // searchIcon.src = SEARCH_ICON_URL;
        searchIcon.src = "https://www.google.com/s2/favicons?domain=" + searchEngine.name.toLowerCase() + ".com";

        searchIcon.style.height = '20px';
        searchIcon.style.width = '20px';
        searchLink.style.padding = '20px';
        // searchTd.appendChild(searchLink);
        searchLink.appendChild(searchIcon);
        searchLink.appendChild(searchEngineText);
        searchLink.appendChild(qText);

        // torrentAnchor.after(searchTd);
        torrentAnchor.parentElement.appendChild(searchLink);
    }

    /**
     * @param pageLink
     */
    function appendPage(pageLink) {
        if (!pageLink) return;

        const tb = document.createElement('tr');
        const pageNumber = ++appendedPageNum;
        const pageAnchor = createElement(`<td><a class="page-link-${pageNumber}" href="${pageLink.href}"><p1 style="white-space: nowrap;">Go to page ${pageNumber}</p1></a></td>`);

        tb.appendChild(pageAnchor);
        tbodyEl.appendChild(tb);

        var req = new XMLHttpRequest();
        req.open('GET', pageLink.href);
        req.send();
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                var pageHTML = req.responseText;
                currentDocument = document.createElement('html');
                currentDocument.innerHTML = pageHTML;

                var lista2s = currentDocument.querySelectorAll('tbody>.lista2');
                for (const e of lista2s) {
                    tbodyEl.appendChild(e);
                    appendColumnSingle(e.childNodes[1]);
                }
                if (debugmode) console.log('Added lista2 elements:', lista2s);
                history.pushState(history.state, "", pageLink.href);
            }
        };
    }

    function addMagnetCell(torrent) {
        var url = torrent.href;
        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.send();
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                var pageHTML = req.responseText;
                var magnetURL = pageHTML.match(/href="(magnet[:_\-+%?=&;.0-9a-zA-Z]*)"/)[1]; //match magnet URL
                var thumbURLs = pageHTML.match("src\=\"((.?)*\.jpg)\"");

                //creating and adding the elements
                var magnetCell = document.createElement('td'),
                    magnetLink = document.createElement('a'),
                    magnetImg = document.createElement('img');
                magnetLink.href = magnetURL;
                magnetCell.classList.add('thumbnail-cell');
                magnetCell.appendChild(magnetLink);

                magnetImg.src = thumbURLs[1];
                if (!thumbURLs[1]) magnetImg = MAGNET_ICO;
                magnetLink.appendChild(magnetImg);
                torrent.parentElement.parentElement.replaceChild(magnetCell, torrent.parentElement.parentElement.childNodes[1]);
            }
        };
    }

    function initSearchEngine() {
        const searchEngineValue = GM_getValue("ImageSearchEngine", Options.defaultImageSearchEngine);
        if (SearchEngines.hasOwnProperty(searchEngineValue)) {
            searchEngine = SearchEngines[searchEngineValue];
            console.log('search engine:', searchEngineValue, searchEngine);
        } else {
            searchEngine = SearchEngines.google;
            console.warn(`Search engine ${searchEngineValue} does not exist, falling back to ${searchEngine.name}`);
        }
    }

    function downloadAllTorrents() {
        console.log('downloadAllTorrents()');
        const visibleTorrentAnchors = document.querySelectorAll('body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(1) > td > table.lista2t > tbody > tr.lista2 .torrent-dl:not([style*="display: none;"])');

        if (confirm(`Would you like to download all the torrents on the page? (${visibleTorrentAnchors.length})`)) {
            for (const dlAnchor of visibleTorrentAnchors) {
                saveByAnchor(dlAnchor.href, new URL(dlAnchor.href).searchParams.get('f'));
            }
        }
    }

    // the magnet and url buttons
    // @source: https://greasyfork.org/scripts/23493-rarbg-torrent-and-magnet-links/code/
    // Cat. | File | Added | Size | S. | L. | comments  |   Uploader
    function appendColumn() {
        // the initial column 'Files' after of which the extra column will be appended
        /*qa('.lista2t > tbody > tr > td:nth-child(2)').forEach(function(entry){        // creation of the extra column
            entry.insertAdjacentHTML('afterend', `<td>` + title + `</td>`);
        });*/

        // the rest cells of the new column
        qa('.lista2t > tbody > tr[class="lista2"] > td:nth-child(3)')
            .forEach(fixCellCss);

        var oldColumn = Array.from(qa('.lista2t > tbody > tr[class="lista2"] > td a[title]'))
            .map(a => a.parentElement);     // torrent links row
        // populate the cells in the new column with DL and ML links
        return Array.from(oldColumn).map(appendColumnSingle);
    }

    /**
     * @param torrentLink
     * @return {*}
     */
    function appendColumnSingle(torrentLink) {
        if (torrentLink.closest('tr.lista2').querySelector('.has-torrent-DL-ML')) // check that the same row doesn't already have DL-ML
            return;
        // the initial column 'Files' after of which the extra column will be appended
        // creation of the extra column

        torrentLink.insertAdjacentHTML('afterend', `<td>${title}</td>`);
        torrentLink.classList.add('has-torrent-DL-ML');

        // the rest cells of the new column
        fixCellCss(torrentLink.nextSibling);

        // populate the cells in the new column with DL and ML links
        return (addDlAndMl(torrentLink.nextSibling, torrentLink));
    }

    /**
     * sets the following attributes:
     *  class: lista
     *  width: 50px
     *  align: center
     * @param cell
     */
    function fixCellCss(cell) {
        cell.setAttribute('class', 'lista');
        cell.setAttribute('width', '50px');
        cell.setAttribute('align', 'center');
    }

    function addDlAndMl(torrentAnchor, cellNode) {
        // language=HTML
        torrentAnchor.appendChild(createElement('<a href="' + getTorrentDownloadLinkFromAnchor(cellNode.querySelector('a[title]')) +
            '" class="torrent-dl" target="_blank" >' +
            '<img src="' + TORRENT_ICO + '" alt="Torrent">' +
            '</a>')); // torrent download

        // matches anything containing "over/*.jpg" *: anything
        const anchorOuterHTML = cellNode.firstChild.outerHTML;
        const hash = (/over\/(.*)\.jpg\\/).test(anchorOuterHTML) ?
            anchorOuterHTML.match(/over\/(.*)\.jpg\\/)[1] :
            undefined;

        const title = cellNode.firstChild.innerText;

        const magnetUriStr = `magnet:?xt=urn:btih:${hash}&dn=${title}&tr=${trackers}`;

        const ml = createElement(hash !== undefined ?
            (`<a class="torrent-ml" href="${magnetUriStr}"><img src="${MAGNET_ICO}" alt=""></a>`) :
            '&nbsp;&nbsp;&nbsp;&nbsp;'
        );
        // console.log('magnetLink button:', ml);
        torrentAnchor.appendChild(ml); // magnet ink

        return magnetUriStr;
    }

    function getTorrentDownloadLinkFromAnchor(anchor) {
        return anchor.href.replace('torrent/', 'download.php?id=') + '&f=' + encodeURI(anchor.innerText) + '-[rarbg.com].torrent';
    }

    function loadBigPics() {
        updateCss();
        // Advised not to use as it uses XML requests and will get you banned form the site if you use it for a few pages.
        for (const img of qa('.preview-image')) {
            img.addEventListener("error", bigThumbHandleError);
            img.oldSrc = img.src;
            img.src = getLargeThumbnail(img.src);
        }
    }


    // Cat. | File | Added | Size | S. | L. | comments  |   Uploader

    // this is one row
    /*
<tr className="lista2">
    <td align="left" className="lista" width="48" style="width:48px;">
        <a href="/torrents.php?category=45">
            <img src="https://dyncdn.me/static/20/images/categories/cat_new45.gif" border="0" alt="">
        </a>
    </td>
    <td align="left" className="lista">
        <a onMouseOver="return overlib('<img src=\'https://dyncdn.me/mimages/5975/over_opt.jpg\' border=0>')"
           onMouseOut="return nd();" href="/torrent/ifcvj5g" title="">The.Visitor.2007.720p.BluRay.H264.AAC-RARBG</a>
        <a href="/torrents.php?imdb=tt0857191">
            <img src="https://dyncdn.me/static/20/images/imdb_thumb.gif" border="0" alt=""></a><br>
        <span style="color:DarkSlateGray">Drama IMDB: 7.7/10</span>
    </td>
    <td align="center" width="150px" className="lista">2018-07-25 16:55:06</td>
    <td align="center" width="100px" className="lista">1.25 GB</td>
    <td align="center" width="50px" className="lista"><font color="#dd0000">1</font></td>
    <td align="center" width="50px" className="lista">5</td>
    <td align="center" width="50px" className="lista">--</td>
    <td align="center" className="lista">Scene</td>
</tr>
    */
})();

// == general helper functions, not specific to this script ==

function matchSite(siteRegex) {
    let result = location.href.match(siteRegex);
    if (result) console.debug("Site matched regex: " + siteRegex);
    return result;
}

function anchorClick(href, downloadValue, target) {
    downloadValue = downloadValue || '_untitled';
    var a = document.createElement('a');
    a.setAttribute('href', href);
    a.setAttribute('download', downloadValue);
    a.target = target;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function saveByAnchor(url, dlName) {
    anchorClick(url, dlName);
}

function removeDoubleSpaces(str) {
    return !!str ? str.replace(/(\s\s+)/g, " ") : str;
}

function clearSymbolsFromString(str) {
    function clearDatesFromString(str) {
        return !!str ? removeDoubleSpaces(str.replace(/\d+([.\-])(\d+)([.\-])\d*/g, ' ')) : str;
    }

    return str && removeDoubleSpaces(clearDatesFromString(str).replace(/[-!$%^&*()_+|~=`{}\[\]";'<>?,.\/]|(\s\s+)/gim, ' ')
        .replace(/rarbg|\.com|#|x264|DVDRip|720p|1080p|2160p|MP4|IMAGESET|FuGLi|SD|KLEENEX|BRRip|XviD|MP3|XVID|BluRay|HAAC|WEBRip|DHD|rartv|KTR|YAPG|[^0-9a-zA-z]/gi, " ")).trim();
}

function isPageBlockedKSA() {
    const msgText = document.querySelector('#r4 > td[dir="ltr"].english');
    return !!msgText && msgText.innerText === "If you believe the requested page should not be blocked please click here." &&
        !!document.querySelector('[href^="http://www.internet.gov.sa/resources-ar/block-unblock-request-ar/view?set_language"]');
}

function hex2rgb(c) {
    if (c[0] === '#') c = c.substr(1);
    const r = parseInt(c.slice(0, 2), 16),
        g = parseInt(c.slice(2, 4), 16),
        b = parseInt(c.slice(4, 6), 16);
    return [r, g, b];
}

function makeTextFile(text) {
    const data = new Blob([text], { type: 'text/plain' });
    var textFile = null;
    // If we are replacing a previously generated file we need to manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) window.URL.revokeObjectURL(textFile);
    textFile = window.URL.createObjectURL(data);
    return textFile;
}
/** Create an element by HTML.
 example:   var myAnchor = createElement('<a href="https://example.com">Go to example.com</a>');*/
function createElement(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.childNodes[0];
}

function htmlToElements(html) {
    return new DOMParser().parseFromString(html, 'text/html').body.childNodes
}

/**abbreviation for querySelectorAll()
 * @param selector
 * @param node
 * @return {NodeListOf<HTMLElement>} */
function qa(selector, node = document) {
    return node.querySelectorAll(selector);
}

/**abbreviation for querySelector()
 * @param selector
 * @param node
 * @return {HTMLElement} */
function q(selector, node = document) {
    return node.querySelector(selector);
}

function getElementsByXPath(xpath, parent) {
    let results = [];
    let query = document.evaluate(xpath,
        parent || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
    }
    return results;
}

function addCss(cssStr, id='') {
    // check if already exists
    const style = id && document.getElementById(id) || document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = cssStr;
    } else {
        style.innerText = cssStr;
    }
    if (!!id) style.id = id;
    style.classList.add('addCss');
    return document.getElementsByTagName('head')[0].appendChild(style);
}

