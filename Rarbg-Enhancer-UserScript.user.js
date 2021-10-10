var meta = {
    rawmdb: function () {
// ==UserScript==
// @name         RARBG Enhancer
// @namespace    https://github.com/FarisHijazi
// @version      1.5.3
// @description  Auto-solve CAPTCHA, infinite scroll, add a magnet link shortcut and thumbnails of torrents,
// @description  adds a image search link in case you want to see more pics of the torrent, and more!
// @author       Faris Hijazi
//               with some code from https://greasyfork.org/en/users/2160-darkred
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?domain=rarbg.com
// @run-at       document-idle
// @updateUrl    https://github.com/FarisHijazi/Rarbg-Enhancer-UserScript/raw/master/Rarbg-Enhancer-UserScript.user.js
// @require      https://code.jquery.com/jquery-3.4.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.4/jszip.min.js
// @require      https://unpkg.com/infinite-scroll@3.0.5/dist/infinite-scroll.pkgd.min.js
// @require      https://raw.githubusercontent.com/ccampbell/mousetrap/master/mousetrap.min.js
// @include      https://*rarbg.*
// @include      /https?:\/\/.{0,8}rarbg.*\.\/*/
// @include      /https?:\/\/.{0,8}rargb.*\.\/*/
// @include      /https?:\/\/.*u=MTcyLjIxLjAuMXw6Ly9yYXJiZy50by90b3JyZW50LzIyMDg3MjYwfE1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS83OS4wLjM5NDUuMTMwIFNhZmFyaS81MzcuMzZ8ODc4MDQz.*/
// @include      https://www.rarbg.is
// @include      https://proxyrarbg.org
// @include      https://rarbg.com
// @include      https://rarbg.to
// @include      https://rarbg2018.org
// @include      https://rarbg2019.org
// @include      https://rarbg2020.org
// @include      https://rarbg2021.org
// @include      https://rarbgaccess.org
// @include      https://rarbgaccessed.org
// @include      https://rarbgcdn.org
// @include      https://rarbgcore.org
// @include      https://rarbgdata.org
// @include      https://rarbgenter.org
// @include      https://rarbgget.org
// @include      https://rarbggo.org
// @include      https://rarbgindex.org
// @include      https://rarbgmirror.com
// @include      https://rarbgmirror.org
// @include      https://rarbgmirrored.org
// @include      https://rarbgp2p.org
// @include      https://rarbgproxied.org
// @include      https://rarbgproxies.org
// @include      https://rarbgproxy.com
// @include      https://rarbgproxy.org
// @include      https://rarbgprx.org
// @include      https://rarbgto.org
// @include      https://rarbgtor.org
// @include      https://rarbgtorrents.org
// @include      https://rarbgunblock.com
// @include      https://rarbgunblock.org
// @include      https://rarbgunblocked.org
// @include      https://rarbgway.org
// @include      https://rarbgweb.org
// @include      https://unblockedrarbg.org
// @include      https://www.rarbg.is
// @require      https://raw.githubusercontent.com/antimatter15/ocrad.js/master/ocrad.js
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

// AddColumn() and add magnetLinks() code taken from:      https://greasyfork.org/en/scripts/23493-rarbg-torrent-and-magnet-links/code

/**
 * Sequence of function calls
 *
 * appendColumn()
 *  -> appendColumnSingle()
 *      -> addDlAndMl()
 * observeDocument(dealWithTorrents)
 * */

// pollyfill for Element.before() and Element.after(): (since some browsers like MS Edge don't already have them)
if (Element.prototype.before === undefined) {
    Element.prototype.before = function (newNode) {
        if (this.parentElement) {
            return this.parentElement.insertBefore(newNode, this);
        }
    };
}
if (Element.prototype.after === undefined) {
    Element.prototype.after = function (newNode) {
        if (this.parentElement) {
            return this.parentElement.insertBefore(newNode, this.nextSibling);
        }
    };
}
// "Set" operations
Set.prototype.addAll = function (range) {
    if (range) {
        for (const x of range) {
            this.add(x);
        }
    }
    return this;
};
Set.prototype.union = function (other) {
    if (!other.concat) other = Array.from(other);
    return new Set(
        other.concat(Array.from(this))
    );
};
Set.prototype.intersection = function (other) {
    if (!other.filter) other = Array.from(other);
    return new Set(
        other.filter(x => this.has(x))
    );
};
/** this - other
 * @param other
 * @returns {Set} containing what this has but other doesn't */
Set.prototype.difference = function (other) {
    if (!other.has) other = new Set(other);
    return new Set(Array.from(this).filter(x => !other.has(x)));
};

/**
 * {}
 */
let titleGroups = {};

const catCodeMap = {
    'Movies': '48;17;44;45;47;50;51;52;42;46'.split(';'),
    'XXX': '4'.split(';'),
    'Music': '23;24;25;26'.split(';'),
    'TV shows': '18;41;49'.split(';'),
    'Software': '33;34;43'.split(';'),
    'Games': '27;28;29;30;31;32;40;53'.split(';'),
    'Non XXX': '2;14;15;16;17;21;22;42;18;19;41;27;28;29;30;31;32;40;23;24;25;26;33;34;43;44;45;46;47;48;49;50;51;52;54'.split(';'),
};
// categories map, given the category number (in the URL), returns the name of it
const codeToCatMap = reverseMapping(catCodeMap);
// converts key to a category code (number in URL)
const catKeyMap = {
    'v': 'Movies',
    's': 'TV show',
    'm': 'Music',
    'w': 'Software',
    'x': 'XXX',
    'g': 'Games',
    'n': 'Non XXX',
};

// main
(function () {
    'use strict';
    const debug = false; // debugmode (setting this to false will disable the console logging)

    const TORRENT_ICO = 'https://dyncdn.me/static/20/img/16x16/download.png';
    const MAGNET_ICO = 'https://dyncdn.me/static/20/img/magnet.gif';
    const trackers = 'http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710';

    const isOnSingleTorrentPage = !!matchSite(/\/torrent\//);
    const isOnThreatDefencePage = /threat_defence/i.test(location.href);

    const Options = $.extend({
        thumbnailLink: 'ml', //options:  "ml", "tor", "img", "page"
        addThumbnails: true, // if set to false, the content thumbnails will not be used, magnet or torrent thumbnails will be used isntead
        showGeneratedSearchQuery: false,
        addCategoryWithSearch: true, // when searching for a movie title like "X-men", will become "X-men movie"
        largeThumbnails: true,
        defaultImageSearchEngine: 'google',
        infiniteScrolling: true,
        mirrors: meta.include,
        seedEffects: true,
        imgScale: 1.0,
        staticSearchbar: false,
    }, GM_getValue('RarbgOptions'));

    // write back the Options to the storage (in the case that they changed)
    window.addEventListener('unload', function () {
        GM_setValue('RarbgOptions', Options);
    });

    Math.clamp = function (a, min, max) {
        return a < min ? min :
            a > max ? max : a;
    };

    const SearchEngines = {
        google: {
            name: 'Google',
            imageSearchUrl: (q) => `https://www.google.com/search?&hl=en&tbm=isch&q=${encodeURIComponent(q)}`
        },
        ddg: {
            name: 'DuckDuckGo',
            imageSearchUrl: (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}&atb=v73-5__&iar=images&iax=images&ia=images`
        },
        yandex: {
            name: 'Yandex',
            imageSearchUrl: (q) => `https://yandex.com/images/search?text=${encodeURIComponent(q)}`
        }
    };
    let searchEngine = {};
    initSearchEngine();

    // click to verify browser
    document.querySelectorAll('a[href^="/threat_defence.php?defence=1"]').forEach(a => a.click());

    //TODO: change detection from detecting page blocked to detecting a unique element on the rarbg pages, this way it'll work for more than just ksa blocked pages
    if (isPageBlockedKSA()) {
        location.assign(Options.mirrors[Math.floor(Math.random() * Options.mirrors.length)]);
    }

    const searchBox = document.querySelector('#searchinput');
    const isOnIndexPage = searchBox !== null;
    const isOnWrongTorrentLinkPage = getElementsByXPath('(/html/body/table[3]/tbody/tr/td[2]/div/table/tbody/tr[2]/td/div[contains(., "The link you followed is wrong. Please try again!")])').length > 0;

    const getTorrentLinks = () => Array.from(document.querySelectorAll('table > tbody > tr.lista2 a[title]'));

    var row_others = getElementsByXPath('(//tr[contains(., "Others\:")])[last()]').pop();

    var tbodyEl = isOnSingleTorrentPage && row_others ?
        row_others.parentElement.querySelector('tbody') :
        document.querySelector('body > table > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > table.lista2t > tbody');
    if (!tbodyEl) console.warn('tbody element not found!');


    let width = 150, maxwidth = 300, maxheight = 200;

    var thumbnailsCssBlock = addCss('');
    // language=CSS
    addCss(
        `
/*this keeps the tableCells in the groups at equal heights*/
table.groupTable > tbody > tr > td {
    height: 10px !important;
}

td.thumbnail-cell {
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
    display: inline-block;
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
    /*font-size: 15px !important;*/
    /*padding: 20px !important;*/
    /*display: -webkit-box !important;*/
    background-color: rgba(183, 183, 183, 0.23) !important;
    margin: 10px !important;
    font-family: sans-serif !important;
}`
    );
    updateCss();


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
        };
    }());
    // sound file from: http://freesound.org/data/previews/166/166186_3034894-lq.mp3
    var snd = PlaySound('data:audio/wav;base64,' + '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');


    // === end of variable declarations ===

    $(document).ready(function main() {
        if (isOnThreatDefencePage) { // OnThreatDefencePage: check for captcha
            if (document.querySelector('#solve_string')) {
                console.log('Rarbg threat defence page');


                try {
                    // solveCaptcha(OCRAD);
                    unsafeEval(solveCaptcha, OCRAD);
                } catch (e) {
                    console.error('Error occurred while trying to solve captcha:\n', e);

                    const container = document.querySelector('tbody > :nth-child(2)');
                    const img = container.querySelector('img');
                    const captcha = document.querySelector('#solve_string');
                    const submitBtn = document.querySelector('#button_submit');
                    const textEl = img.previousElementSibling.previousElementSibling.previousElementSibling;
                    textEl.innerText += 'Could not auto-solve capthca';

                    /* tesseract.js
                    * https://tesseract.projectnaptha.com/
                    * https://cdn.jsdelivr.net/gh/naptha/tesseract.js@v1.0.14/dist/tesseract.min.js
                    */
                    (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Tesseract=f()}})(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){var process=module.exports={};var cachedSetTimeout;var cachedClearTimeout;function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}(function(){try{if(typeof setTimeout==="function"){cachedSetTimeout=setTimeout}else{cachedSetTimeout=defaultSetTimout}}catch(e){cachedSetTimeout=defaultSetTimout}try{if(typeof clearTimeout==="function"){cachedClearTimeout=clearTimeout}else{cachedClearTimeout=defaultClearTimeout}}catch(e){cachedClearTimeout=defaultClearTimeout}})();function runTimeout(fun){if(cachedSetTimeout===setTimeout){return setTimeout(fun,0)}if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout){cachedSetTimeout=setTimeout;return setTimeout(fun,0)}try{return cachedSetTimeout(fun,0)}catch(e){try{return cachedSetTimeout.call(null,fun,0)}catch(e){return cachedSetTimeout.call(this,fun,0)}}}function runClearTimeout(marker){if(cachedClearTimeout===clearTimeout){return clearTimeout(marker)}if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout){cachedClearTimeout=clearTimeout;return clearTimeout(marker)}try{return cachedClearTimeout(marker)}catch(e){try{return cachedClearTimeout.call(null,marker)}catch(e){return cachedClearTimeout.call(this,marker)}}}var queue=[];var draining=false;var currentQueue;var queueIndex=-1;function cleanUpNextTick(){if(!draining||!currentQueue){return}draining=false;if(currentQueue.length){queue=currentQueue.concat(queue)}else{queueIndex=-1}if(queue.length){drainQueue()}}function drainQueue(){if(draining){return}var timeout=runTimeout(cleanUpNextTick);draining=true;var len=queue.length;while(len){currentQueue=queue;queue=[];while(++queueIndex<len){if(currentQueue){currentQueue[queueIndex].run()}}queueIndex=-1;len=queue.length}currentQueue=null;draining=false;runClearTimeout(timeout)}process.nextTick=function(fun){var args=new Array(arguments.length-1);if(arguments.length>1){for(var i=1;i<arguments.length;i++){args[i-1]=arguments[i]}}queue.push(new Item(fun,args));if(queue.length===1&&!draining){runTimeout(drainQueue)}};function Item(fun,array){this.fun=fun;this.array=array}Item.prototype.run=function(){this.fun.apply(null,this.array)};process.title="browser";process.browser=true;process.env={};process.argv=[];process.version="";process.versions={};function noop(){}process.on=noop;process.addListener=noop;process.once=noop;process.off=noop;process.removeListener=noop;process.removeAllListeners=noop;process.emit=noop;process.prependListener=noop;process.prependOnceListener=noop;process.listeners=function(name){return[]};process.binding=function(name){throw new Error("process.binding is not supported")};process.cwd=function(){return"/"};process.chdir=function(dir){throw new Error("process.chdir is not supported")};process.umask=function(){return 0}},{}],2:[function(require,module,exports){module.exports={name:"tesseract.js",version:"1.0.13",description:"Pure Javascript Multilingual OCR",main:"src/index.js",scripts:{start:'concurrently --kill-others "watchify src/index.js  -t [ envify --NODE_ENV development ] -t [ babelify --presets [ es2015 ] ] -o dist/tesseract.dev.js --standalone Tesseract" "watchify src/browser/worker.js  -t [ envify --NODE_ENV development ] -t [ babelify --presets [ es2015 ] ] -o dist/worker.dev.js" "http-server -p 7355"',build:"browserify src/index.js -t [ babelify --presets [ es2015 ] ] -o dist/tesseract.js --standalone Tesseract && browserify src/browser/worker.js -t [ babelify --presets [ es2015 ] ] -o dist/worker.js && uglifyjs dist/tesseract.js --source-map -o dist/tesseract.min.js && uglifyjs dist/worker.js --source-map -o dist/worker.min.js",release:"npm run build && git commit -am 'new release' && git push && git tag `jq -r '.version' package.json` && git push origin --tags && npm publish"},browser:{"./src/node/index.js":"./src/browser/index.js"},author:"",license:"Apache-2.0",devDependencies:{"babel-preset-es2015":"^6.16.0",babelify:"^7.3.0",browserify:"^13.1.0",concurrently:"^3.1.0",envify:"^3.4.1","http-server":"^0.9.0",pako:"^1.0.3","uglify-js":"^3.4.9",watchify:"^3.7.0"},dependencies:{"file-type":"^3.8.0","isomorphic-fetch":"^2.2.1","is-url":"1.2.2","jpeg-js":"^0.2.0","level-js":"^2.2.4","node-fetch":"^1.6.3","object-assign":"^4.1.0","png.js":"^0.2.1","tesseract.js-core":"^1.0.2"},repository:{type:"git",url:"https://github.com/naptha/tesseract.js.git"},bugs:{url:"https://github.com/naptha/tesseract.js/issues"},homepage:"https://github.com/naptha/tesseract.js"}},{}],3:[function(require,module,exports){(function(process){"use strict";var defaultOptions={corePath:"https://cdn.jsdelivr.net/gh/naptha/tesseract.js-core@0.1.0/index.js",langPath:"https://tessdata.projectnaptha.com/3.02/"};if(process.env.NODE_ENV==="development"){console.debug("Using Development Configuration");defaultOptions.workerPath=location.protocol+"//"+location.host+"/dist/worker.dev.js?nocache="+Math.random().toString(36).slice(3)}else{var version=require("../../package.json").version;defaultOptions.workerPath="https://cdn.jsdelivr.net/gh/naptha/tesseract.js@"+version+"/dist/worker.js"}exports.defaultOptions=defaultOptions;exports.spawnWorker=function spawnWorker(instance,workerOptions){if(window.Blob&&window.URL){var blob=new Blob(['importScripts("'+workerOptions.workerPath+'");']);var worker=new Worker(window.URL.createObjectURL(blob))}else{var worker=new Worker(workerOptions.workerPath)}worker.onmessage=function(e){var packet=e.data;instance._recv(packet)};return worker};exports.terminateWorker=function(instance){instance.worker.terminate()};exports.sendPacket=function sendPacket(instance,packet){loadImage(packet.payload.image,function(img){packet.payload.image=img;instance.worker.postMessage(packet)})};function loadImage(image,cb){if(typeof image==="string"){if(/^\#/.test(image)){return loadImage(document.querySelector(image),cb)}else if(/(blob|data)\:/.test(image)){var im=new Image;im.src=image;im.onload=function(e){return loadImage(im,cb)};return}else{var xhr=new XMLHttpRequest;xhr.open("GET",image,true);xhr.responseType="blob";xhr.onload=function(e){return loadImage(xhr.response,cb)};xhr.onerror=function(e){if(/^https?:\/\//.test(image)&&!/^https:\/\/crossorigin.me/.test(image)){console.debug("Attempting to load image with CORS proxy");loadImage("https://crossorigin.me/"+image,cb)}};xhr.send(null);return}}else if(image instanceof File){var fr=new FileReader;fr.onload=function(e){return loadImage(fr.result,cb)};fr.readAsDataURL(image);return}else if(image instanceof Blob){return loadImage(URL.createObjectURL(image),cb)}else if(image.getContext){return loadImage(image.getContext("2d"),cb)}else if(image.tagName=="IMG"||image.tagName=="VIDEO"){var c=document.createElement("canvas");c.width=image.naturalWidth||image.videoWidth;c.height=image.naturalHeight||image.videoHeight;var ctx=c.getContext("2d");ctx.drawImage(image,0,0);return loadImage(ctx,cb)}else if(image.getImageData){var data=image.getImageData(0,0,image.canvas.width,image.canvas.height);return loadImage(data,cb)}else{return cb(image)}throw new Error("Missing return in loadImage cascade")}}).call(this,require("_process"))},{"../../package.json":2,_process:1}],4:[function(require,module,exports){"use strict";module.exports=function circularize(page){page.paragraphs=[];page.lines=[];page.words=[];page.symbols=[];page.blocks.forEach(function(block){block.page=page;block.lines=[];block.words=[];block.symbols=[];block.paragraphs.forEach(function(para){para.block=block;para.page=page;para.words=[];para.symbols=[];para.lines.forEach(function(line){line.paragraph=para;line.block=block;line.page=page;line.symbols=[];line.words.forEach(function(word){word.line=line;word.paragraph=para;word.block=block;word.page=page;word.symbols.forEach(function(sym){sym.word=word;sym.line=line;sym.paragraph=para;sym.block=block;sym.page=page;sym.line.symbols.push(sym);sym.paragraph.symbols.push(sym);sym.block.symbols.push(sym);sym.page.symbols.push(sym)});word.paragraph.words.push(word);word.block.words.push(word);word.page.words.push(word)});line.block.lines.push(line);line.page.lines.push(line)});para.page.paragraphs.push(para)})});return page}},{}],5:[function(require,module,exports){"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}var adapter=require("../node/index.js");var jobCounter=0;module.exports=function(){function TesseractJob(instance){_classCallCheck(this,TesseractJob);this.id="Job-"+ ++jobCounter+"-"+Math.random().toString(16).slice(3,8);this._instance=instance;this._resolve=[];this._reject=[];this._progress=[];this._finally=[]}_createClass(TesseractJob,[{key:"then",value:function then(resolve,reject){if(this._resolve.push){this._resolve.push(resolve)}else{resolve(this._resolve)}if(reject)this.catch(reject);return this}},{key:"catch",value:function _catch(reject){if(this._reject.push){this._reject.push(reject)}else{reject(this._reject)}return this}},{key:"progress",value:function progress(fn){this._progress.push(fn);return this}},{key:"finally",value:function _finally(fn){this._finally.push(fn);return this}},{key:"_send",value:function _send(action,payload){adapter.sendPacket(this._instance,{jobId:this.id,action:action,payload:payload})}},{key:"_handle",value:function _handle(packet){var data=packet.data;var runFinallyCbs=false;if(packet.status==="resolve"){if(this._resolve.length===0)console.log(data);this._resolve.forEach(function(fn){var ret=fn(data);if(ret&&typeof ret.then=="function"){console.warn("TesseractJob instances do not chain like ES6 Promises. To convert it into a real promise, use Promise.resolve.")}});this._resolve=data;this._instance._dequeue();runFinallyCbs=true}else if(packet.status==="reject"){if(this._reject.length===0)console.error(data);this._reject.forEach(function(fn){return fn(data)});this._reject=data;this._instance._dequeue();runFinallyCbs=true}else if(packet.status==="progress"){this._progress.forEach(function(fn){return fn(data)})}else{console.warn("Message type unknown",packet.status)}if(runFinallyCbs){this._finally.forEach(function(fn){return fn(data)})}}}]);return TesseractJob}()},{"../node/index.js":3}],6:[function(require,module,exports){"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}var adapter=require("./node/index.js");var circularize=require("./common/circularize.js");var TesseractJob=require("./common/job");var version=require("../package.json").version;var create=function create(){var workerOptions=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var worker=new TesseractWorker(Object.assign({},adapter.defaultOptions,workerOptions));worker.create=create;worker.version=version;return worker};var TesseractWorker=function(){function TesseractWorker(workerOptions){_classCallCheck(this,TesseractWorker);this.worker=null;this.workerOptions=workerOptions;this._currentJob=null;this._queue=[]}_createClass(TesseractWorker,[{key:"recognize",value:function recognize(image){var _this=this;var options=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};return this._delay(function(job){if(typeof options==="string")options={lang:options};options.lang=options.lang||"eng";job._send("recognize",{image:image,options:options,workerOptions:_this.workerOptions})})}},{key:"detect",value:function detect(image){var _this2=this;var options=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};return this._delay(function(job){job._send("detect",{image:image,options:options,workerOptions:_this2.workerOptions})})}},{key:"terminate",value:function terminate(){if(this.worker)adapter.terminateWorker(this);this.worker=null;this._currentJob=null;this._queue=[]}},{key:"_delay",value:function _delay(fn){var _this3=this;if(!this.worker)this.worker=adapter.spawnWorker(this,this.workerOptions);var job=new TesseractJob(this);this._queue.push(function(e){_this3._queue.shift();_this3._currentJob=job;fn(job)});if(!this._currentJob)this._dequeue();return job}},{key:"_dequeue",value:function _dequeue(){this._currentJob=null;if(this._queue.length){this._queue[0]()}}},{key:"_recv",value:function _recv(packet){if(packet.status==="resolve"&&packet.action==="recognize"){packet.data=circularize(packet.data)}if(this._currentJob.id===packet.jobId){this._currentJob._handle(packet)}else{console.warn("Job ID "+packet.jobId+" not known.")}}}]);return TesseractWorker}();module.exports=create()},{"../package.json":2,"./common/circularize.js":4,"./common/job":5,"./node/index.js":3}]},{},[6])(6)});

                    unsafeWindow.Tesseract = Tesseract;

                    function solveCaptchaTesseract(Tesseract) {
                        Tesseract.recognize(container.querySelector('img'), {
                            tessedit_char_whitelist: '123456789' + 'ABCDEFGHIJKLMNOPQRSTUVWXY' // ',.' + 'abcdefghijklmnopqrstuvwxyz'
                        }).then(function (result) {
                            console.log('result', result, '\n', result.text);
                            document.querySelector('#solve_string').value = result;
                            return result;
                        });
                    }

                    unsafeEval(solveCaptchaTesseract, Tesseract);

                }
            }
        } else { // on torrent(s) page
            if (isOnSingleTorrentPage) {
                let mainTorrentLink = document.querySelector('body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(1) > td.lista > a:nth-child(2)');
                addImageSearchAnchor(mainTorrentLink, mainTorrentLink.innerText);

                const relatedTorrent = document.querySelector('.lista_related');
                if (relatedTorrent) {
                    const tr_tableHeader = relatedTorrent.closest('table').querySelector('tbody > tr');
                    const thumbsHeader = tr_tableHeader.firstElementChild.cloneNode();
                    thumbsHeader.innerText = 'thumbnail';
                    tr_tableHeader.firstElementChild.before(thumbsHeader);
                }

                // adding thumbnails
                for (const torrent of document.querySelectorAll('a[href^="/torrent/"]')) {
                    //creating and adding thumbnails
                    const row = torrent.closest('tr.lista_related');
                    const cell = document.createElement('td');
                    const thumbnailLink = document.createElement('a');
                    const thumbnailImg = document.createElement('img');
                    thumbnailLink.href = torrent.href;

                    cell.classList.add('thumbnail-cell');
                    cell.classList.add('preview-image');
                    cell.appendChild(thumbnailLink);

                    // thumbnail
                    thumbnailImg.classList.add('preview-image');

                    let thumb = extractThumbnailSrc(torrent);
                    thumbnailImg.setAttribute('smallSrc', thumb);
                    thumbnailImg.setAttribute('bigSrc', getLargeThumbnail(thumb));

                    setThumbnail(thumbnailImg);
                    thumbnailLink.appendChild(thumbnailImg);

                    torrent.closest('tr').firstElementChild.before(cell);

                    thumbnailImg.style.width = 'auto';
                    thumbnailImg.style['max-height'] = '500px';
                    thumbnailImg.style['max-width'] = '400px';
                    thumbnailImg.style['margin-bottom'] = '20px';
                }

                // remove VPN row
                const vpnR = getElementsByXPath('(//tr[contains(., "VPN\:")])[last()]');
                if (vpnR) {
                    vpnR[0].remove();
                }

                // fullres for imgprime.com
                // link:    https://imgprime.com/imga-u/b/2019/04/02/5ca35d660e76e.jpeg.html
                // img:     https://imgprime.com/u/b/2019/04/02/5ca35d660e76e.jpeg
                replaceImageHostImageWithOriginal("https://imgprime.com/", {
                    'imga-': '',
                    '.html': '',
                    '/small/': '/big/',
                    '/u/s/': '/u/b/',
                });
                // imagecurl.com
                replaceImageHostImageWithOriginal("https://imagecurl.com/images/", { '_thumb': '' });
                // imagefruit.com
                replaceImageHostImageWithOriginal("/tn/t", { '/tn/t': '/tn/i' });
                // 22pixx.xyz
                replaceImageHostImageWithOriginal("https://22pixx.xyz/", {
                    '22pixx.xyz/os/': '22pixx.xyz/o/',
                    '22pixx.xyz/s/': '22pixx.xyz/i/',
                });
                // trueimg.xyz
                replaceImageHostImageWithOriginal("https://trueimg.xyz/s/", {
                    'trueimg.xyz/s/': 'trueimg.xyz/b/',
                });
                // trueimg.xyz
                replaceImageHostImageWithOriginal("https://imgtaxi.com/images/small/", {
                    'https://imgtaxi.com/images/small/': 'https://imgtaxi.com/images/big/',
                });


                // putting the "Description:" row before the "Others:" row
                getElementsByXPath('(//tr[contains(., "Poster\:")])[last()]')[0].appendChild(getElementsByXPath('(//tr[contains(., "Description\:")])[last()]')[0]);

                Mousetrap.bind('d', function (e) {
                    const torrent = document.querySelector('a[onmouseover="return overlib(\'Click here to download torrent\')"]');
                    torrent.click();

                    function getRow(rowText) {
                        return getElementsByXPath(`(//tr[contains(., "${rowText}")])[last()]`);
                    }

                    const torrentName = torrent.innerText;
                    const descriptionImgs = getElementsByXPath('(//tr[contains(., "Description\:")])[last()]//img');
                    const posterImg = getRow('Poster:')[0];
                    posterImg.alt = torrentName + '_poster';
                    var i = 1;
                    for (const descriptionImg of descriptionImgs) {
                        descriptionImg.alt = torrentName + '_description_' + (i++);
                    }
                    descriptionImgs.push(posterImg);
                    descriptionImgs.push({ fileURL: torrent.href, fileName: torrentName });
                    var zip = zipFiles(descriptionImgs);
                    zip.file(document.title + '.html', new Blob([document.body.outerHTML], { type: 'text/plain' }));
                    const rowsObj = {};
                    ['Title:', 'Genres:', 'Actors:', 'Stars:', 'Series:', 'Plot:', 'Tags:'].forEach(row => {
                        let rowContent = getRow(row)[0];
                        if (rowContent)
                            rowsObj[row] = rowContent.innerText;
                    });
                    const rowsText = JSON.stringify(rowsObj, null, 4);
                    console.debug('rowsObj: ', rowsObj);
                    let summary = document.title + '\n\n' + rowsText;
                    zip.file(document.title + ' (summary).txt', new Blob([summary], { type: 'text/plain' }));

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
                const searchContainer = searchBox.closest('form').closest('div');

                // making checkbox (fixed searchbar)
                const moreBtn = searchContainer.querySelector('tr:nth-child(1) > td:nth-child(3)');
                moreBtn.after($('<td><input id="static-checkbox" type="checkbox"><label for="static-checkbox" style="display: block;">fixed searchbar</label></td>')[0]);

                const checkbox = document.querySelector('#static-checkbox');
                checkbox.onchange = function (e) {
                    const searchContainer = searchBox.closest('form').closest('div');

                    if (checkbox.checked) {
                        searchContainer.style.position = 'fixed';
                        searchContainer.style.top = '0';
                        searchContainer.style.left = '702px';
                    } else {
                        searchContainer.style.position = '';
                        searchContainer.style.top = '';
                        searchContainer.style.left = '';
                    }
                    Options.staticSearchbar = checkbox.checked;
                };

                if (Options.staticSearchbar) {
                    checkbox.click();
                }

                const mldlCol = appendColumn('ML DL', 'File', addDlAndMl);
                mldlCol.header.addEventListener('click', downloadAllTorrents);

                if (Options.infiniteScrolling) { // infiniteScrolling
                    (function makeInfiniteScroll() {
                        const tableLvl2 = 'div.content-rounded table.lista-rounded tbody:nth-child(1) tr:nth-child(2) td:nth-child(1) > table.lista2t:nth-child(9)';
                        const tbody = tableLvl2 + ' > tbody';
                        const nav = 'td:nth-child(2) div.content-rounded table.lista-rounded tbody:nth-child(1) > tr:nth-child(3)';

                        const container = getElementsByXPath('//table[@class=\'lista2t\']')[0];
                        const infScroll = new InfiniteScroll(container, {
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
                                    appendColumnCell(lista2.childNodes[1]);
                                }
                            }

                            // remove extra appended headers
                            tbodyEl.nextElementSibling.remove();
                            // filter the new torrents that just arrived
                            updateSearch();
                        });
                    })();
                }

                // TODO: use horsey and fuzzysearch for string matching and for showing suggestions
                // TODO: try to put updateSearch() into the horsey source() option
                if (typeof (horsey) !== 'undefined') {
                    const myHorsey = horsey(searchBox, {
                        source: [{
                            list: getTorrentLinks().map(a => ({
                                text: a.title || a.innerText,
                                value: a
                            }))
                        }],
                        getText: 'text',
                        getValue: 'value',
                        renderItem: function (li, suggestion) {
                            console.debug(
                                'Suggestion:', suggestion,
                                '\nli:', li
                            );
                            var image = '<img class="suggestion-thumbnail" src="' +
                                suggestion.value.closest('.lista2').querySelector('img.preview-image').src +
                                '"  alt="' + suggestion.text + '"/>';
                            li.innerHTML = `${image}<span>${suggestion.text}</span>`;
                        }
                    });
                }

                // click sort by seeds
                Mousetrap.bind('t s', function (e) {
                    let columnIndex = getColumnIndex('S.');
                    if (columnIndex !== -1) {
                        tbodyEl.querySelectorAll('tr > td.header6')[columnIndex].querySelector('a').click();
                    }
                });

            } else if (isOnWrongTorrentLinkPage) {
                // this torrent link has failed, then we have to go to the torrent page and download it
                const torrentPageUrl = new URL(location.href).searchParams.get('tpageurl'); // get the previously injected page url here
                if (torrentPageUrl) {
                    fetchDoc(torrentPageUrl).then(doc => {
                        const torrentdownloadLink = doc.querySelector("td.lista a[onmouseover]");
                        location.assign(torrentdownloadLink.href);
                        document.addEventListener('DOMContentLoaded', () => document.close());
                        document.addEventListener('load', () => document.close());
                        setTimeout(() => window.close(), 1000);
                    });
                } else {
                    console.warn('"tpageurl" is not in the location params!');
                    window.close();
                }
            }

            (function onLoad() {
                console.log('loaded');
                document.body.onclick = null; // remove annoying click listeners

                // remove annoying search description
                const searchDescription = document.querySelector('#SearchDescription');
                if (searchDescription) searchDescription.remove();

                // remove annoying signup form that doesn't work
                const signinForm = document.querySelector('form[action="/login"]');
                if (signinForm) signinForm.remove();
                const signinTab = document.querySelector('body > table:nth-child(5) > tbody > tr > td > table > tbody > tr > td.header4');
                if (signinTab) signinTab.remove();


                // remove recommended torrents
                const recTor = document.querySelector('tr > [valign="top"] > [onmouseout="return nd();"]');
                if (recTor) recTor.closest('div').remove();

                // remove "recommended torrents" title
                const recTitle = getElementsByXPath('(//text()[contains(., "Recommended torrents \:")])/../../..')[0];
                if (recTitle) recTitle.remove();

                // scroll the table to view (top of screen will be the first torrent)
                const mainTable = document.querySelector('body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(1) > td > table.lista2t');
                if (mainTable) mainTable.scrollIntoView();


                // adding a dropdown list for mirrors
                (function addMirrorsDropdown() {
                    const blankTab = document.querySelector('td.header:nth-child(1)');
                    if (!blankTab) return;

                    const mirrorsTab = document.createElement('td');
                    mirrorsTab.className = 'header3';
                    mirrorsTab.innerText = 'Switch to mirror site:';

                    function openAllMirrors() {
                        console.log('opening all mirrors');

                        for (const hostnames of mirrorsTab.querySelectorAll('option.mirrors-option')) {
                            window.open(extractUrlFromMirrorHost(hostnames), '_blank');
                        }
                    }
                    function extractUrlFromMirrorHost(hostnameText) {
                        const split = location.href.split('/').slice(2);
                        split[0] = hostnameText;
                        return split.join('/');
                    }

                    const mirrorsSelect = document.createElement('select');
                    mirrorsSelect.onchange = function () {
                        if (!this.value) return;

                        console.log('this:', this);

                        if (this.value === 'Open ALL mirrors') {
                            openAllMirrors();
                        } else {
                            location.assign(extractUrlFromMirrorHost(this.value));
                        }
                    };
                    mirrorsTab.appendChild(mirrorsSelect);

                    for (const mirror of Options.mirrors) {
                        const option = document.createElement('option');
                        option.className = 'mirrors-option';
                        option.value = mirror;
                        try{
                            option.innerText = new URL(mirror).hostname;
                            if (option.innerText !== location.hostname) {
                                mirrorsSelect.appendChild(option);
                            }
                        }catch(e){}
                    }

                    // adding another last one (which would be THIS hostsname's url)
                    const option_thisHostname = document.createElement('option');
                    option_thisHostname.innerText = location.hostname;
                    option_thisHostname.setAttribute('selected', '');
                    mirrorsSelect.appendChild(option_thisHostname);

                    // another option to open ALL the hostnames in the new tab
                    const option_openAllMirrors = document.createElement('option');
                    option_openAllMirrors.innerText = 'Open ALL mirrors';
                    option_openAllMirrors.id = 'open-all-mirrors';
                    option_openAllMirrors.setAttribute('selected', '');
                    option_openAllMirrors.onclick = openAllMirrors;
                    mirrorsSelect.appendChild(option_openAllMirrors);

                    mirrorsSelect.selectedIndex--;

                    blankTab.after(mirrorsTab);
                })();

            })();

            observeDocument((target) => {
                if (isOnIndexPage) {
                    const newCol = appendColumn('Thumbnails', 'Cat.', addThumbnailColumn);
                    newCol.header.addEventListener('click', () => toggleThumbnailSize());
                }

                dealWithTorrents(target);
                // forceAbsoluteLinks();

                // group torrents
                titleGroups = updateTorrentGroups();
                for (const [torrentTitle, torrentAnchors] of Object.entries(titleGroups)) {
                    if (torrentAnchors.length > 1) {
                        groupTorrents(torrentTitle, torrentAnchors);
                    }
                }

                // remove links for adds that cover the screen
                for (const x of document.querySelectorAll('[style*="2147483647"], a[href*="https://s4yxaqyq95.com/"]')) {
                    console.debug('removed redirect element:', x);
                    x.remove();
                }
            });
        }

    });

    (function bindKeys() {
        if (typeof Mousetrap === 'undefined') return;
        Mousetrap.bind(['space'], (e) => {
            solveCaptcha(); // TODO: remove this, this is just for debugging
        });
        Mousetrap.bind(['/'], (e) => {
            console.log('clicking search input');

            e.preventDefault();
            const searchBar = document.querySelector('#searchinput');
            searchBar.click();
            searchBar.scrollIntoView();
            searchBar.select();
            searchBar.setSelectionRange(searchBar.value.length, searchBar.value.length);
        });

        Mousetrap.bind(['`'], (e) => toggleThumbnailSize());

        // saves an html and json file for all torrents on page
        Mousetrap.bind(['ctrl+s'], (e) => {
            document.querySelectorAll("body > table > tbody > tr > td:nth-child(4) > a.torrent-ml").forEach(a=>a.protocol='magnet:');

            document.querySelectorAll('a').forEach(
                a=>a.setAttribute('href', relativeToAbsoluteURL(a.getAttribute('href'), 'https://rarbgprx.org/'))
                // TODO: remove rarbgprx.org and put something more general
            );

            // converting image URLs to base64 (so they'd be saved in the page)
            Promise.all(
                Array.from(document.querySelectorAll("img")).map(
                    img => new Promise((resolve, reject) => {

                        fetchB64ImgUrl(img.src)
                            .then(bin => resolve(img.src = bin||img.src))
                            .catch(reject);

                        setTimeout(resolve, 2000);
                    })
                )
            ).then(promises => {
                console.log("SUCCESSFULLY converted image urls to base64", promises);
            }).finally(function(promises) {

                const rows = document.querySelectorAll('table > tbody > tr.lista2');
                const torrentJsons = Array.from(rows).map(row => {
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
                            thumbnailSrc: thumbnail ? thumbnail.src : ''
                        };
                    } catch (e) {
                    }
                });
                const torrentsObject = {
                    documentTitle: document.title,
                    date: Date.now(),
                    torrents: torrentJsons
                };

                const tableOuterHTML = document.querySelector("table.lista2t, table.lista").outerHTML;
                const summaryHTML = `<html lang="en">${document.head.outerHTML}<body>${tableOuterHTML}</body></html>`;

                anchorClick(makeTextFile(JSON.stringify(torrentsObject, null, 4)), document.title + ' [' + rows.length + ']' + ' info.json');
                anchorClick(makeTextFile(summaryHTML), document.title + ' [' + rows.length + ']' + ' summary.html');

            });

        });

        // increase thumbnail size
        Mousetrap.bind('=', function (e) {
            Options.imgScale = Math.min(Options.imgScale + 0.2, 10);
            toggleThumbnailSize('update only');
        });
        // decrease thumbnail size
        Mousetrap.bind('-', function (e) {
            Options.imgScale = Math.max(Options.imgScale - 0.2, 0.2);
            toggleThumbnailSize('update only');
        });

        // binding each key to a category
        // then you can change categories by pressing that key (like "m" for (M)ovie)
        console.group('Binding keys to categories:');
        for (const [key, catName] of Object.entries(catKeyMap)) {
            console.log(`"${key}": "${catName}"`);
            Mousetrap.bind(key, function (e) {
                const catCode = catCodeMap[catName].join(';');

                if (typeof URL !== 'undefined') {
                    const url = new URL(location.href);
                    url.searchParams.set('category', catCode);
                    url.pathname = '/torrents.php';
                    location.assign(url.toString());
                } else {
                    location.assign('/torrents.php?category=' + catCode);
                }
            });
        }
        console.groupEnd();

    })();

    function addThumbnailColumn(cell, torrent, row) {
        // = Creating and adding thumbnail cell
        // var cell = document.createElement('td');
        const thumbnailLink = document.createElement('a');
        const thumbnailImg = document.createElement('img');

        cell.classList.add('thumbnail-cell');
        cell.appendChild(thumbnailLink);
        thumbnailLink.appendChild(thumbnailImg);

        const dllink = row.querySelector('a.torrent-dl');
        const ml = row.querySelector('a.torrent-ml');
        const dlurl = dllink ? dllink.href : extractTorrentDL(torrent);

        // thumbnail link
        (function setLinkHref() {
            switch (Options.thumbnailLink) {
                case 'ml':
                    try {
                        thumbnailLink.href = ml;
                        if (!/^magnet:\?/.test(thumbnailLink.href))  // noinspection ExceptionCaughtLocallyJS
                            throw new Error('Not a magnet link');
                    } catch (e) {
                        thumbnailLink.href = dlurl;
                    }
                    break;
                case 'tor':
                    try {
                        thumbnailLink.href = dlurl;
                    } catch (e) {
                        thumbnailLink.href = ml;
                        if (debug) console.debug('Using MagnetLink for torrent thumbnail since torrent failed:', ml);
                    }
                    break;
                case 'page':
                    thumbnailLink.href = torrent.href;
                    break;
            }
        })();

        if (thumbnailLink.href.indexOf('undefined') >= 0)
            console.warn(
                'thumbnail Link:', thumbnailLink,
                'torrent:', torrent.innerText,
                'dl', dlurl
            );

        // thumbnail
        thumbnailImg.onmouseover = function playSound() {
            try {
                var snd = PlaySound('data:audio/wav;base64,' + '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');
            } catch (e) {
            }
        };
        thumbnailImg.classList.add('preview-image');
        thumbnailImg.classList.add('zoom');
        const src = extractThumbnailSrc(torrent);
        thumbnailImg.setAttribute('smallSrc', src);
        thumbnailImg.setAttribute('bigSrc', getLargeThumbnail(src));
        setThumbnail(thumbnailImg);
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

    /**
     * hides all torrents that do not match the search query
     * TODO:maybe generalize this function to just return the resulting score for each item,
     *      this way it can be portable and made as a library and use elsewhere
     *      and then you can iterate and hide them later
     */
    function updateSearch() {
        if (!searchBox) throw new Error('Search box not found');
        const query = searchBox.value.trim();
        const torrents = document.querySelectorAll('table > tbody > tr.lista2 a[title]');
        const convertedQuery = query.replace(/[!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]+/g, '.')
            .trim()
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


        console.debug(
            'regex:', regex,
            '\nconverted query:', convertedQuery,
            '\ncompletelyNegativeQuery:', completelyNegativeQuery
        );

        for (const a of torrents) {
            var match = (a.title || a.innerText).match(regex);
            if (match) {
                const matches = (!!match) ? Array.from(match) : [];
                var negativeMatches = matches.filter(group => // tests if it's a negative match (if there is a '-' before the search term)
                    group && new RegExp('-' + group, 'ig').test(query)
                );
                var positiveMatches = matches.filter(group => // tests if it's a negative match (if there is a '-' before the search term)
                    group && !new RegExp('-' + group, 'ig').test(query)
                );
                const hideCondition = query && (completelyNegativeQuery ? negativeMatches.length :
                    negativeMatches.length || !positiveMatches.length);
                a.closest('.lista2').style.display = hideCondition ? 'none' : '';
            } // skip if empty title

            // DONE: make it so that it doesn't just check if "query" starts with '-', rather, check each match and check if each word starts with '-'
        }
    }

    function updateCss() {
        thumbnailsCssBlock.innerText =
            'td.thumbnail-cell > a > img.preview-image {' +
            ' max-width: ' + maxwidth * Options.imgScale + 'px;' +
            ' max-height: ' + maxheight * Options.imgScale + 'px; ' +
            '}';
    }

    function observeDocument(callback) {
        callback(document.body);
        new MutationObserver(function (mutations, me) {
            me.disconnect();
            for (var i = 0; i < mutations.length; i++) {
                if (mutations[i].addedNodes.length) {
                    callback(mutations[i].target);
                }
            }
            me.observe(document.body, {
                childList: true, subtree: true,
                attributes: false, characterData: false
            });
        }).observe(document.body, {
            childList: true, subtree: true,
            attributes: false, characterData: false
        });
    }

    /**
     * takes a list of torrentLinks and groups them into the first one
     *
     * @param {*} torrentLinks
     */
    function groupTorrents(torrentTitle, torrentLinks) {
        const $rows = $(torrentLinks).closest('tr').filter(':not(.grouped)');
        var $firstRow = $rows.filter('.firstRow');
        if ($firstRow.length || $firstRow.children('td').length) {
            console.warn('groupTorrents() not allowed to call twice, found a firstRow:', $firstRow);
            return;
        } else {
            $firstRow = $rows.first();
        }

        $firstRow.addClass('firstRow');
        var $groupTables = $firstRow.closest('table.groupTable');
        if (!$groupTables.length) {
            $groupTables = $firstRow.children('td')
                .append('<table class="groupTable">')
                .end()
                .find('table.groupTable').remove();

            // for each row
            $rows.each(
                // move the td elements and add it in a new row in the table 
                (_, row) => $(row).children('td')
                    .each((i, td) => (i < $groupTables.length) && $groupTables[i].insertRow().appendChild(td))
            );

            $firstRow
                .append(
                    // create 10 'td' elements
                    ($(Array($groupTables.length).fill(null).map(() => document.createElement('td'))))
                        .each((i, td) => (i < $groupTables.length) && td.appendChild($groupTables[i]))
                );
        }



        // const dividerRowHTML = `<tr>
        // <td align="center" class="" style="width:48px;">Cat.</td><td align="center">Thumbnails</td>
        // <td align="center" class=""><a class="anal tdlinkfull3">File</a></td><td align="center">ML DL</td>
        // <td align="center" class=""><a class="anal tdlinkfull3"><i class="icon-arrow-down"></i>Added</a></td>
        // <td align="center" class=""><a class="anal tdlinkfull3">Size</a></td>
        // <td align="center" class=""><a class="anal tdlinkfull3">S.</a></td>
        // <td align="center" class=""><a class="anal tdlinkfull3">L.</a></td>
        // <td align="center" class=""><img src="https://dyncdn2.com/static/20/images/comments.gif" border="0" alt="comments"></td>
        // <td align="center" class="">Uploader</td>
        // </tr>`;

        $rows.addClass('grouped');
    }
    /**
     * grouping similar torrents together
     * this is useful when you have 3 torrents of the same movie but different resolutions, there's no need to see it 3 times
     * @returns {{string: HTMLAnchorElement[]}}
     */
    function updateTorrentGroups() {
        const FILLER_WORDS = new Set(['AND', '2160P', 'MP4', 'THE', 'COM', 'WEIRD', 'IN', 'YAPG', 'A', 'TRASHBIN', 'FOR',
            'TO', 'WITH', 'HER', 'MY', 'ON', 'PART', 'X264', 'OF', '720P', 'SEX', 'XXX', 'MP4', 'KTR', '1080P', 'SD', 'KLEENEX']);

        const extractCleanTitle = (a) => Array.from(
            new Set((a.title || a.innerText)
                .toUpperCase()
                .replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.?/, '') // remove dates like 02.11.2019
                .split(/[\s._\-\[\]]/g) // split on dots and dashes and spaces...
                .filter(word => word) // remove empty words
            ).difference(FILLER_WORDS) // remove filler words
        ).sort() // sort to maximize conflicts (we want the same title with different word orderings to be in the same group)
            .join(' ');

        const titleToLinkEntries = getTorrentLinks().map( a => [a.cleanTitle = a.cleanTitle||extractCleanTitle(a), a] );
        /* 
         * looks like:
         *
         * 0: (2) ["HOPE ION10 S04 SAVING WEBRIP", a.modded]
         * 1: (2) ["ALASKA ION10 RAILROAD S01 WEBRIP", a.modded]
         * 2: (2) ["ION10 RULES S08E11 VANDERPUMP WEBRIP", a.modded]
         * 3: (2) ["ION10 RESIDENT S03E18 WEBRIP", a.modded]
         */

        /**
         * clusters: titles to words
         * {key: value}  {title: array of links that belong to that same title}
         * @typedef {string: Element[]}
         */
        titleGroups = fromEntriesMultivalue(
            titleToLinkEntries //.concat(Object.entries(titleGroups))
            // .map( ([k, v]) => [k, Array.from(new Set(v))] ) // remove duplicate links
        );
        /*
         * looks something like:
         *
         * HOPE ION10 S04 SAVING WEBRIP: [a.modded]
         * ALASKA ION10 RAILROAD S01 WEBRIP: [a.modded]
         * ION10 RULES S08E11 VANDERPUMP WEBRIP: [a.modded]
         * ION10 RESIDENT S03E18 WEBRIP: [a.modded]
         * ION10 NAMASTE S04 WEBRIP YOGA: [a.modded] 
         */


        return titleGroups;
    }

    function dealWithTorrents(node) {
        for (const torrentLink of node.querySelectorAll('tr.lista2 > td > a[title][href^="/torrent/"]:not(.modded)')) {
            const row = torrentLink.closest('tr');

            // = adding relative time to columns
            (function changeDateToRelativeTime() {
                var column_Added = row.querySelector('td:nth-child(' + (getColumnIndex('Added') + 1) + ')');

                const diffInMinutes = (Date.now() - Date.parse(column_Added.innerHTML)) / (1000 * 60);

                var diffFinal = diffInMinutes + ' minutes';

                if (diffInMinutes / (60 * 24) >= 365 * 2) { // > 2years
                    diffFinal = Math.round(diffInMinutes / (60 * 24 * 365)) + ' years';
                } else if (diffInMinutes / (60 * 24) >= 2) { // > 2days
                    diffFinal = Math.round(diffInMinutes / (60 * 24)) + ' days';
                } else if (diffInMinutes / (60) >= 2) {
                    diffFinal = Math.round(diffInMinutes / (60)) + ' hours';
                }

                if (debug) console.log('column_Added:', column_Added);
                column_Added.innerHTML = (column_Added.innerHTML + '<br>\n' + (diffFinal + ' ago').replace(' ', '&nbsp'));
            })();

            // color backgrounds depending on the number of seeders
            if (Options.seedEffects) {
                (function seedEffects() {
                    /**
                     * @param numberOfSeeders
                     * @return {number} alpha channel (between 0 and 1 but clamped between [0.2, 0.6]) according to the number of seeders
                     */
                    const mapSeedersToScale = numberOfSeeders => {
                        return Math.clamp(0.013 * Math.log(1.0 + numberOfSeeders) / Math.log(0.05), 0.1, 999999999.0) * 10.0;
                    };

                    const seedersFont = row.querySelector('font[color]');

                    const statusRGB = hex2rgb(seedersFont.getAttribute('color')); // to color the row
                    const scaler = mapSeedersToScale(parseInt(seedersFont.innerText));
                    console.debug(`mapSeedersToScale(${seedersFont.innerText}) -> `, scaler);

                    /*
                    increasing font size and element sizes for more seeds
                    */
                    // seedersFont.style['font-size'] = Math.max(20, (parseInt(seedersFont.style['font-size'].match(/[d].+/)) || 1) * scaler) + 'px';
                    // torrentLink.style['font-size'] = Math.max(20, (parseInt(torrentLink.style['font-size'].match(/[d].+/)) || 1) * scaler) + 'px';

                    const alphaScaler = Math.clamp(scaler, 0.1, 0.4);
                    statusRGB.map(x => x * alphaScaler);
                    statusRGB.push(alphaScaler); // add alpha channel

                    row.style.background = 'rgb(' + statusRGB.join(', ') + ')';
                })();
            }

            addImageSearchAnchor(torrentLink);

            torrentLink.classList.add('modded');
        }
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
        thumbnail.src = Options.largeThumbnails ?
            thumbnail.getAttribute('bigSrc') :
            thumbnail.getAttribute('smallSrc');

        if (!Options.addThumbnails) {
            thumbnail.src = thumbnail.closest('a').href.indexOf('magnet:?') === 0 ? // if magnet link
                MAGNET_ICO : // magnet icon
                TORRENT_ICO; // else, just put torrent icon
        }
    }

    function toggleThumbnailSize(newSize = 'toggle') {
        if (newSize === "large") {
            Options.largeThumbnails = true;
        } else if (newSize == "small") {
            Options.largeThumbnails = false;
        } else if (newSize === 'toggle') {
            Options.largeThumbnails = !Options.largeThumbnails;
        }
        console.log('toggleThumbnailSize(' + newSize + ')');
        document.querySelectorAll('.preview-image').forEach(setThumbnail);
        updateCss();
        if (debug) console.log('toggling thumbnail sizes. Options.largeThumbnails = ', Options.largeThumbnails);
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
            thumbnailSrc = torrentAnchor.getAttribute('onmouseover') || '';
            thumbnailSrc = thumbnailSrc.substring('return overlib(\'<img src=\''.length + 1, thumbnailSrc.length - '\' border=0>\''.length - 2);
        } catch (r) {
            thumbnailSrc = MAGNET_ICO;
            console.error('extractThumbnailSrc error:', r);
        }
        if (debug) console.debug('extractThumbnailSrc(', torrentAnchor, ')->', thumbnailSrc);
        return thumbnailSrc;
    }

    function addImageSearchAnchor(torrentAnchor) {
        const searchTd = document.createElement('td'),
            searchLink = document.createElement('a')
            ;
        searchTd.classList.add('search');
        searchTd.style['border-top-width'] = '10px';
        searchTd.style['padding-top'] = '10px';

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
            if (codeToCatMap.hasOwnProperty(categoryCode)) {
                return codeToCatMap[categoryCode];
            } else {
                if (debug) console.debug('Unkown category:', categoryCode);
            }
        }

        searchLink.href = searchEngine.imageSearchUrl(searchQuery);
        try {
            if (Options.addCategoryWithSearch && !new RegExp(getCategory(torrentAnchor)).test(searchLink.href))
                searchLink.href += ' ' + getCategory(torrentAnchor);
        } catch (e) {
            if (debug) console.warn('unable to get category', searchLink);
        }
        if (debug) console.debug('search url:', searchLink.href);
        searchLink.classList.add('search');
        searchLink.target = '_blank';

        var searchEngineText = document.createElement('p5');
        var qText = document.createElement('p6');
        searchEngineText.innerHTML = `${searchEngine.name} Image Search`;
        qText.innerHTML = (Options.showGeneratedSearchQuery) ? ': ' + searchQuery : '';

        let searchIcon = document.createElement('img');
        // searchIcon.src = SEARCH_ICON_URL;
        searchIcon.src = 'https://www.google.com/s2/favicons?domain=' + searchEngine.name.toLowerCase() + '.com';

        searchIcon.style.height = '20px';
        searchIcon.style.width = '20px';
        searchLink.style.padding = '20px';
        searchLink.appendChild(searchIcon);
        // searchLink.appendChild(searchEngineText);
        searchLink.appendChild(qText);
        torrentAnchor.after(searchLink);
    }

    function initSearchEngine() {
        const searchEngineValue = GM_getValue('ImageSearchEngine', Options.defaultImageSearchEngine);
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
            // click all magnet links
            document.querySelectorAll("a.torrent-ml").forEach(a => a.click());
        }
    }

    /**
     * @param {string} headerTitle - td.header6 element
     * @returns {number} the index of the column given the column header text
     */
    function getColumnIndex(headerTitle) {
        var headerTitles = ["Cat.", "Thumbnails", "File", "ML DL", "Added", "Size", "S.", "L.", "", "Uploader"];
        var headerTitles = Array.from(document.querySelectorAll("body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(1) > td > table.lista2t > tbody > tr:nth-child(1) > td")).map(el=>el.innerText)

        var idx = headerTitles.indexOf(headerTitle);
        if (idx >= 0) {
            return idx;
        } else {
            console.warn('The passed headerTitle:', headerTitle, "is not a valid headerTitle, choose from:", headerTitles);
            const allHeaders = tbodyEl.querySelectorAll('tr > td.header6');
            return [].map.call(allHeaders, header => header.innerText).indexOf(headerTitle);
        }
    }
    /**
     * Adds a column to the torrents table. Safe to call this function multiple times for the same column, it will not add duplicate cells to a row that already has this header.
     * @author https://greasyfork.org/en/scripts/23493-rarbg-torrent-and-magnet-links/code
     * @param {string} title -
     * @param {(number|string)=2} colIndex - A number specifying the column index to be inserted after (to the right of) (starts from zero).
     *  or a string of one of the other headers (search will be performed automatically)
     *      So for example, appendColumnGeneral("Between 0 and 1", 1) would come between the first and second columns
     * @param {Function} callback - paremeters: callback(newCell, anchor, row). will be called on the added cells, will not be called on cells that already exist.
     * @returns {HTMLTableDataCellElement[]} - returns the added elements (excluding the header, and excluding)
     */
    function appendColumn(title, colIndex = 2, callback = (cell, anchor, row) => true) {
        if (typeof colIndex === 'string') {
            colIndex = getColumnIndex(colIndex);
        }

        const sanitizedTitle = $.escapeSelector(title.replace(/\s/g, '')).replace(/\s/g, '');

        /**
         * Make and insert column cell
         * @param {HTMLTableDataCellElement=} oldCell - if provided, new cell will be placed afterend
         * @returns {HTMLElement}
         */
        function makeCell(oldCell) {
            const cell = document.createElement('td');
            // cell.innerText = title;
            cell.classList.add('lista');
            if (sanitizedTitle) cell.classList.add(sanitizedTitle);
            cell.setAttribute('width', '50px');
            cell.setAttribute('align', 'center');

            if (oldCell) {
                oldCell.insertAdjacentElement('afterend', cell);
            }
            return cell;
        }

        // the initial column, after of which the extra column will be appended
        let tbodySelector = '.lista2t > tbody';
        const oldColumnEntries = document.querySelectorAll(tbodySelector + ' > tr > td:nth-child(' + (colIndex + 1) + ')');

        // header: the first cell (the header cell) of the new column
        var header;
        header = document.querySelector('#' + sanitizedTitle + '-head');
        // if this column has already been added
        if (!header) {
            header = document.createElement('td');
            header.innerHTML = title;
            header.setAttribute('align', 'center');
            header.classList.add('header6');
            header.id = sanitizedTitle + '-head';
            oldColumnEntries[0].insertAdjacentElement('afterend', header);
            if (debug) console.log('header:', header);
        }


        // creation of the extra column
        const newColumn = [].slice.call(oldColumnEntries, 1)
            // exclude rows that already have this column
            .filter(oldCol => {
                const row = oldCol.closest('tr.lista2');
                const selector = '.' + $.escapeSelector(sanitizedTitle);
                if (row) return !row.querySelector(selector);
            }).map(makeCell);

        // fire callback
        for (let cell of newColumn) {
            let row = cell.closest('tr.lista2');
            let anchor = row.querySelector('a[title]');
            callback(cell, anchor, row);
        }
        newColumn.__defineGetter__('header', () => header);
        return newColumn;
    }


    /**
     * @param prevColCell
     * @return {*}
     */
    function appendColumnCell(prevColCell) {
        if (prevColCell.closest('tr.lista2').querySelector('.has-torrent-DL-ML')) // check that the same row doesn't already have DL-ML
            return;
        // the initial column 'Files' after of which the extra column will be appended
        // creation of the extra column

        prevColCell.insertAdjacentHTML('afterend', '<td></td>');
        prevColCell.classList.add('has-torrent-DL-ML');

        // the rest cells of the new column
        prevColCell.nextSibling.setAttribute('class', 'lista');
        prevColCell.nextSibling.setAttribute('width', '50px');
        prevColCell.nextSibling.setAttribute('align', 'center');

        // populate the cells in the new column with DL and ML links
        return addDlAndMl(prevColCell.nextSibling, prevColCell);
    }

    /**
     * The actual function calls have `cell, fileTd` swapped
     * @param cell
     * @param fileTd
     * @returns {string}
     */
    function addDlAndMl(cell, fileTd) {
        var row = fileTd.closest('tr.lista2');

        let anchor = row.querySelector('a[title]');

        // language=HTML
        let downloadLink = createElement(
            '<a  data-href="' + anchor.href + '" href="' + extractTorrentDL(anchor) + '" class="torrent-dl" target="_blank" >' +
            '<img src="' + TORRENT_ICO + '" alt="Torrent">' +
            '</a>'
        );
        cell.appendChild(downloadLink); // torrent download

        // real:
        //     https://rarbgaccess.org/download.php?id=...&h=120&f=...-[rarbg.to].torrent
        //     https://rarbgaccess.org/download.php?id=...&      f=...-[rarbg.com].torrent
        // https://www.rarbgaccess.org/download.php?id=...&h=120&f=...-[rarbg.to].torrent

        // matches anything containing "over/*.jpg" *: anything
        const anchorOuterHTML = anchor.outerHTML;
        const hash = (/over\/(.*)\.jpg\\/).test(anchorOuterHTML) ?
            anchorOuterHTML.match(/over\/(.*)\.jpg\\/)[1] :
            undefined;

        const title = anchor.innerText;

        const magnetUriStr = `magnet:?xt=urn:btih:${hash}&dn=${title}&tr=${trackers}`;

        const ml = createElement(`<a class="torrent-ml" data-href="${anchor.href}" href="${magnetUriStr}"><img src="${MAGNET_ICO}" alt=""></a>`);
        if (hash === undefined) {
            ml.href = 'javascript:void(0);';
            addMouseoverListener(ml, 'ml');
        }

        cell.appendChild(ml); // magnet ink

        return magnetUriStr;
    }

    function extractTorrentDL(anchor) {
        return anchor.href.replace('torrent/', 'download.php?id=') + '&f=' + encodeURI(anchor.innerText) + '-[rarbg.to].torrent' + '&tpageurl=' + encodeURIComponent(anchor.href.trim());
    }

    function addMouseoverListener(link, type) {
        link.addEventListener('mouseover', function (event) {
            event.preventDefault();

            if (this.href === 'javascript:void(0);') {
                if (debug) console.log('actually addMouseoverListener()', link);
                let tUrl = this.getAttribute('data-href');
                console.log('fetching ', tUrl);

                var xhr = new XMLHttpRequest();
                xhr.open('GET', tUrl, true);	// XMLHttpRequest.open(method, url, async)
                xhr.onload = function () {
                    let container = document.implementation.createHTMLDocument().documentElement;
                    container.innerHTML = xhr.responseText;
                    console.debug('xhr.responseText', xhr.responseText);

                    let retrievedLink = type === 'dl' ? container.querySelector('a[href^="/download.php"]') : // download link
                        container.querySelector('a[href^="magnet:"]'); // magnet link

                    if (retrievedLink)
                        link.href = retrievedLink.href;
                };
                xhr.send();
            }
        }, false);
    }

    // Cat. | File | Added | Size | S. | L. | comments  |   Uploader
    // this is one row
    /*
     * <tr className="lista2">
     *     <td align="left" className="lista" width="48" style="width:48px;">
     *         <a href="/torrents.php?category=45">
     *             <img src="https://dyncdn.me/static/20/images/categories/cat_new45.gif" border="0" alt="">
     *         </a>
     *     </td>
     *     <td align="left" className="lista">
     *         <a onMouseOver="return overlib('<img src=\'https://dyncdn.me/mimages/5975/over_opt.jpg\' border=0>')"
     *         onMouseOut="return nd();" href="/torrent/ifcvj5g" title="">The.Visitor.2007.720p.BluRay.H264.AAC-RARBG</a>
     *         <a href="/torrents.php?imdb=tt0857191">
     *             <img src="https://dyncdn.me/static/20/images/imdb_thumb.gif" border="0" alt=""></a><br>
     *         <span style="color:DarkSlateGray">Drama IMDB: 7.7/10</span>
     *     </td>
     *     <td align="center" width="150px" className="lista">2018-07-25 16:55:06</td>
     *     <td align="center" width="100px" className="lista">1.25 GB</td>
     *     <td align="center" width="50px" className="lista"><font color="#dd0000">1</font></td>
     *     <td align="center" width="50px" className="lista">5</td>
     *     <td align="center" width="50px" className="lista">--</td>
     *     <td align="center" className="lista">Scene</td>
     * </tr>
     */
})();

// == below are general helper functions, not specific to this script ==

function unsafeEval(func, ...arguments) {
    let body = 'return (' + func + ').apply(this, arguments)';
    unsafeWindow.Function(body).apply(unsafeWindow, arguments);
}

/**
 *
 * @param {Object} o Object to be reversed.
 * Note: that if there are multiple values in an entry, it will be stored as multiple keys each corresponding to the same key (duplication).
 */
function reverseMapping(o) {
    const r = {};

    for (const [k, v] of Object.entries(o)) {
        var values = [v];
        if (v instanceof Array) {
            values = v;
        }
        for (const val of values) {
            r[val] = k;
        }
    }
    return r;
}

/**
 * reverse map but support multiple values, for collisions: concat in array
 *
 * @param {*} o
 * @returns
 */
function reverseMappingMultivalue(o) {
    const r = {};

    for (const [k, v] of Object.entries(o)) {
        var values = [v];
        for (const val of values) {
            if (r.hasOwnProperty(val)) {
                r[val].push(k);
            } else {
                r[val] = [k];
            }
        }
    }
    return r;
}
/**
 * same as Object.fromEntries(), but support multiple values in case of key collision.
 * resolution: concat conflicts in an array
 * @param {*} entries
 * @returns
 */
function fromEntriesMultivalue(entries) {
    const o = {};
    entries.forEach(([k, v]) => o[k] = (o[k] || []).concat(v));
    return o;
}

/**
 * replaces common thumbnails to originals from hosting sites like imagecurl.com...
 *
 * @param {string} imgCommonUrl - the segment of the URL that's unique to this replacement, example: "https://imagecurl.com/images/"
 * @param {object|Function} replaceMethod - replaceMethod(src)->newSrc a function that passes back the new string or a replacement map
 */
function replaceImageHostImageWithOriginal(imgCommonUrl, replaceMethod) {
    const callback = typeof (replaceMethod) === 'function' ? replaceMethod :
        src => Object.entries(replaceMethod).reduce((acc, [k, v]) => acc.replace(k, v), src) // if object
        ;
    for (const img of document.querySelectorAll('img[src*="' + imgCommonUrl + '"]')) {
        if (img) {
            const fullres = callback(img.src);
            console.log('replacing thumbnail:', img.src, '->', fullres, '\n', img);
            img.src = fullres;
            img.closest('a').href = fullres;
            img.style['max-width'] = '100%';
            // img.style['max-height'] = '400px';
        }
    }
}

function matchSite(siteRegex) {
    let result = location.href.match(siteRegex);
    if (result) console.debug('Site matched regex: ' + siteRegex);
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
    return !!str ? str.replace(/(\s\s+)/g, ' ') : str;
}

function clearSymbolsFromString(str) {
    function clearDatesFromString(str) {
        return !!str ? removeDoubleSpaces(str.replace(/\d+([.\-])(\d+)([.\-])\d*/g, ' ')) : str;
    }

    return str && removeDoubleSpaces(clearDatesFromString(str).replace(/[-!$%^&*()_+|~=`{}\[\]";'<>?,.\/]|(\s\s+)/gim, ' ')
        .replace(/rarbg|\.com|#|x264|DVDRip|720p|1080p|2160p|MP4|IMAGESET|FuGLi|SD|KLEENEX|BRRip|XviD|MP3|XVID|BluRay|HAAC|WEBRip|DHD|rartv|KTR|YAPG|[^0-9a-zA-z]/gi, ' ')).trim();
}

function isPageBlockedKSA() {
    const msgText = document.querySelector('#r4 > td[dir="ltr"].english');
    return !!msgText && msgText.innerText === 'If you believe the requested page should not be blocked please click here.' &&
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
    return window.URL.createObjectURL(data);
}
/** Create an element by HTML.
 example:   var myAnchor = createElement('<a href="https://example.com">Go to example.com</a>');*/
function createElement(html) {
    return $(html)[0];
}

function htmlToElements(html) {
    return new DOMParser().parseFromString(html, 'text/html').body.childNodes;
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

function addCss(cssStr, id = '') {
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


function fetchDoc(url) {
    return fetch(url, {
        "credentials": "include",
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
        },
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "GET",
        "mode": "cors"
    })
        .then((res) => res.text())
        .then((html) => {
            const doc = new DOMParser().parseFromString(html, "text/html");
            return doc;
        });
}

function forceAbsoluteLinks() {
    // force absolute URLs
    for (const a of document.querySelectorAll('a[href]')) {
        const oldHref = a.getAttribute('href');
        // is it a relative URL or a rarbg URL?
        const a_hostname = a.hostname;
        const isRarbgHostname = a_hostname === location.hostname ;
        const isRarbgHostname2 = /rarbg/.test(a_hostname);
        const isRelative = /^(\/|#)/.test(oldHref);
        if (!((isRarbgHostname||isRarbgHostname2) && isRelative) ) {
            a.setAttribute('href', a.getAttribute('href').replace(a.protocol + '//' + a_hostname, ''));
            // console.log(oldHref, '->', a.getAttribute('href'));
        }
    }
}
function relativeToAbsoluteURL(url, base=null){
    if (!base) base = document.baseURI;
    if('string'!==typeof url || url==null){
        return null; // wrong or empty url
    } else if(url.match(/^[a-z]+\:\/\//i)){
        return url; // url is absolute already 
    } else if(url.match(/^\/\//)){
        return 'http:'+url; // url is absolute already
    } else if(url.match(/^[a-z]+\:/i)){
        return url; // data URI, mailto:, tel:, etc.
    } else if('string'!==typeof base){
        var a=document.createElement('a');
        a.href=url; // try to resolve url without base
        if(!a.pathname){
            return null; // url not valid 
        }
        return 'http://'+url;
    } else{
        base=relativeToAbsoluteURL(base); // check base
        if(base===null){
            return null; // wrong base
        }
    }
    var a=document.createElement('a');
    a.href=base;

    if(url[0]==='/'){
        base=[]; // rooted path
    } else{
        base=a.pathname.split('/'); // relative path
        base.pop();
    }
    url=url.split('/');
    for(var i=0; i<url.length; ++i){
        if(url[i]==='.'){ // current directory
            continue;
        }
        if(url[i]==='..'){ // parent directory
            if('undefined'===typeof base.pop() || base.length===0){
                return null; // wrong url accessing non-existing parent directories
            }
        }
        else{ // child directory
            base.push(url[i]);
        }
    }
    return a.protocol+'//'+a.hostname+base.join('/');
}

function fetchB64ImgUrl(url, opts) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            'method': 'GET',
            'url': url || 'http://static.jsbin.com/images/dave.min.svg?4.1.4',
            'onload': function (resp) {
                // resolve(resp);

                var binResp = customBase64Encode(resp.responseText);
                resolve('data:image/png;base64,'+binResp);
            },
            'overrideMimeType': 'text/plain; charset=x-user-defined'
        });
    });


    function customBase64Encode(inputStr) {
        var
            bbLen = 3,
            enCharLen = 4,
            inpLen = inputStr.length,
            inx = 0,
            jnx,
            keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
                + '0123456789+/=',
            output = '',
            paddingBytes = 0;
        var
            bytebuffer = new Array(bbLen),
            encodedCharIndexes = new Array(enCharLen);

        while (inx < inpLen) {
            for (jnx = 0; jnx < bbLen; ++jnx) {
                /*--- Throw away high-order byte, as documented at:
                  https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
                */
                if (inx < inpLen) {
                    bytebuffer[jnx] = inputStr.charCodeAt(inx++) & 0xff;
                } else {
                    bytebuffer[jnx] = 0;
                }
            }

            /*--- Get each encoded character, 6 bits at a time.
                index 0: first  6 bits
                index 1: second 6 bits
                            (2 least significant bits from inputStr byte 1
                             + 4 most significant bits from byte 2)
                index 2: third  6 bits
                            (4 least significant bits from inputStr byte 2
                             + 2 most significant bits from byte 3)
                index 3: forth  6 bits (6 least significant bits from inputStr byte 3)
            */
            encodedCharIndexes[0] = bytebuffer[0] >> 2;
            encodedCharIndexes[1] = ((bytebuffer[0] & 0x3) << 4) | (bytebuffer[1] >> 4);
            encodedCharIndexes[2] = ((bytebuffer[1] & 0x0f) << 2) | (bytebuffer[2] >> 6);
            encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

            //--- Determine whether padding happened, and adjust accordingly.
            paddingBytes = inx - (inpLen - 1);
            switch (paddingBytes) {
                case 1:
                    // Set last character to padding char
                    encodedCharIndexes[3] = 64;
                    break;
                case 2:
                    // Set last 2 characters to padding char
                    encodedCharIndexes[3] = 64;
                    encodedCharIndexes[2] = 64;
                    break;
                default:
                    break; // No padding - proceed
            }

            /*--- Now grab each appropriate character out of our keystring,
                based on our index array and append it to the output string.
            */
            for (jnx = 0; jnx < enCharLen; ++jnx)
                output += keyStr.charAt(encodedCharIndexes[jnx]);
        }
        return output;
    }
}



