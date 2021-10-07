var meta = {
    rawmdb: function () {
// ==UserScript==
// @name         RARBG CAPTCHA solver
// @namespace    https://github.com/FarisHijazi
// @version      1.0
// @description  Auto-solve CAPTCHA, infinite scroll, add a magnet link shortcut and thumbnails of torrents,
// @description  adds a image search link in case you want to see more pics of the torrent, and more!
// @author       Faris Hijazi
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?domain=rarbg.com
// @run-at       document-idle
// @require      https://code.jquery.com/jquery-3.4.0.min.js
// @require      https://raw.githubusercontent.com/antimatter15/ocrad.js/master/ocrad.js
// @include      https://*rarbg.*
// @include      /https?:\/\/.{0,8}rarbg.*\.\/*/
// @include      /https?:\/\/.{0,8}rargb.*\.\/*/
// @include      /https?:\/\/.*u=MTcyLjIxLjAuMXw6Ly9yYXJiZy50by90b3JyZW50LzIyMDg3MjYwfE1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS83OS4wLjM5NDUuMTMwIFNhZmFyaS81MzcuMzZ8ODc4MDQz.*/
// @include      https://www.rarbg.is
// @include      https://rarbg.to/*
// @include      http://rarbg-to.pbproxy.red
// @include      http://rarbg-to.pbproxy2.co
// @include      http://rarbg-to.proxydude.red
// @include      http://rarbg-to.proxydude.xyz
// @include      http://rarbg.bypassed.team
// @include      http://rarbg.com.torrentprox.com
// @include      http://rarbg4-to.unblocked.lol
// @include      http://rarbgaccess.org
// @include      http://rarbgmirror.xyz/*
// @include      http://rarbgto.org
// @include      https://rarbg.bypassed.cab
// @include      https://rarbg.bypassed.plus
// @include      https://rarbg.immunicity.cab
// @include      https://rarbg.immunicity.cool
// @include      https://rarbg.immunicity.host
// @include      https://rarbg.immunicity.plus
// @include      https://rarbg.immunicity.team
// @include      https://rarbg.proxydude.win
// @include      https://rarbg.unblockall.xyz
// @include      https://rarbg.unblocked.bet
// @include      https://rarbg.unblocked.cab
// @include      https://rarbg.unblocked.cool
// @include      https://rarbg.unblocked.lol
// @include      https://rarbg.unblocked.plus
// @include      https://rarbg.unblocked.pub
// @include      https://rarbg.unblocked.red
// @include      https://rarbg.unblocked.st
// @include      https://rarbg.unblocked.st/*
// @include      https://rarbg.unblocked.team
// @include      https://rarbg.unblockedall.site
// @include      https://rarbg.unblocker.cc
// @include      https://rarbg.unblocker.win
// @include      https://rarbg.unblockmy.link
// @include      https://rarbg.unblockmy.site
// @include      https://rarbg.unlockproj.party
// @include      http://rarbgmirror.xyz
// @include      https://rarbgaccess.org
// @include      https://rarbgmirror.com
// @include      https://rarbgproxy.org
// @include      https://rarbgprx.org
// @include      https://rarbgunblock.com
// @include      https://rarbgmirror.org
// @include      https://rarbgto.org
// @include      https://rarbgunblock.com/*
// @include      https://filesdownloader.com/proxify.php?proxy=ZmlsZXNkb3dubG9hZGVyLmNvbQ==&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://freeanimesonline.com/proxify.php?proxy=ZnJlZWFuaW1lc29ubGluZS5jb20=&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://freeproxy.io/proxify.php?proxy=ZnJlZXByb3h5Lmlv&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://freeproxy.io/rarbg-proxy
// @include      https://siteget.net/proxify.php?proxy=c2l0ZWdldC5uZXQ=&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://siteget.net/rarbg-proxy
// @include      https://sitenable.ch/proxify.php?proxy=c2l0ZW5hYmxlLmNo&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://sitenable.co/proxify.php?proxy=c2l0ZW5hYmxlLmNv&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://sitenable.info/proxify.php?proxy=c2l0ZW5hYmxlLmluZm8=&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://sitenable.info/rarbg-proxy
// @include      https://sitenable.pw/proxify.php?proxy=c2l0ZW5hYmxlLnB3&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://sitenable.pw/rarbg-proxy
// @include      https://sitenable.top/proxify.php?proxy=c2l0ZW5hYmxlLnRvcA==&site=aHR0cDovL3JhcmJnLnRvLw==
// @include      https://sitenable.top/rarbg-proxy
// @noframes
// ==/UserScript==
    }
};
if (meta.rawmdb && meta.rawmdb.toString && (meta.rawmdb = meta.rawmdb.toString())) {
    var kv, row = /\/\/\s+@(\S+)\s+(.+)/g;
    while ((kv = row.exec(meta.rawmdb)) !== null) {
        if (meta[kv[1]]) {
            if (typeof meta[kv[1]] == 'string') meta[kv[1]] = [meta[kv[1]]];
            meta[kv[1]].push(kv[2]);
        } else meta[kv[1]] = kv[2];
    }
}
meta.window = this;
if (typeof unsafeWindow === 'undefined') {
    var unsafeWindow = window;
}
(unsafeWindow.scriptMetas = unsafeWindow.scriptMetas || []);
if (meta.hasOwnProperty('nodups')) {
    if (new Set(unsafeWindow.scriptMetas.map(meta=>meta.namespace+meta.name)).has(meta.namespace+meta.name)) {
        console.warn('Another script is trying to execute but @nodups is set. Stopping execution.\n',
            meta.namespace+meta.name);
        return;
    }
}
unsafeWindow.scriptMetas.push(meta);
console.log('Script:', meta.name, 'meta:', meta);

function matchSite(siteRegex) {
    let result = location.href.match(siteRegex);
    if (!!result) console.debug('Site matched regex: ' + siteRegex);
    return result;
}

function solveCaptcha(OCRAD) {
    console.log('solving captcha...');
    const container = document.querySelector('tbody > :nth-child(2)');
    const img = container.querySelector('img');
    const captcha = document.querySelector('#solve_string');
    const submitBtn = document.querySelector('#button_submit');
    const url = new URL(location.href);


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

    function getBase64Image(img, excludeUrlProtocol = false) {
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

    console.log('solveCAPTHA fetching image ...');

    return new Promise(resolve => { // wait for image to load
        if (img.complete) {
            return resolve();
        }
        img.onload = resolve;
    }).then(() => uriToImageData(getBase64Image(img)).then((imageData) => {
        if (img.naturalHeight === 0 && img.naturalWidth === 0) {
            console.warn('image hasn\'t loaded, refreshing to new captha page');
            url.searchParams.set('defence', '1');
            location.assign(url.toString());
            return;
        }

        console.log('feeding image to OCR ...');
        var imageText = OCRAD(imageData);
        console.log('OCRAD result:', imageText);
        if (!imageText) {
            throw Error("OCRAD result is empty");
        }
        captcha.value = imageText;
        submitBtn.display = '';
        submitBtn.click();
    })).catch(e => {
        console.error(e);
        url.searchParams.set('defence', '1');
        location.assign(url.toString());
    });
}

(function() {
    'use strict';
    const trackers = 'http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710';

    const isOnSingleTorrentPage = !!matchSite(/\/torrent\//);
    const isOnThreatDefencePage = /threat_defence/i.test(location.href);
    $(document).ready(function main() {
        if (isOnThreatDefencePage) { // OnThreatDefencePage: check for captcha
            if (document.querySelector('#solve_string')) {
                console.log('Rarbg threat defence page');
                solveCaptcha(OCRAD);
            }
        }
    });

})();
