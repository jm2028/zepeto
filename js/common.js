"use strict"

var globalInit = function () {
    includeHeader();
}

var InitGnb = function () {
    var headerWrap = document.querySelector('.header_wrap');
    var gnbOpener = headerWrap.querySelector('.gnb_opener');

    gnbOpener.addEventListener('click', function() {
        if (headerWrap.classList.contains('open')) {
            headerWrap.classList.remove('open')
        }
        else {
            headerWrap.classList.add('open');
        }
    })

    HoverMarquee();
}

var InitIntro = function () {
    var introWrap = document.querySelector('.intro_wrap');
    var marqueeWrap = introWrap.querySelectorAll('.marquee_wrap');
    var btnPlayNow = document.getElementsByClassName('btn_playnow')[0];
    var introVideo = document.getElementById('intro_video');

    btnPlayNow.addEventListener('click', function () {
        introWrap.classList.add('end');
        introVideo.play();
    })
    btnPlayNow.addEventListener('mouseover', function() {
        introWrap.classList.add('over');
    })
    btnPlayNow.addEventListener('mouseleave', function() {
        introWrap.classList.remove('over');
    })

    NormalMarquee(marqueeWrap, introWrap);
}

var InitReality = function () {
    var grdientWrap = document.querySelector('.gradient_bg');
    var marqueeWrap = grdientWrap.querySelectorAll('.marquee_wrap');

    NormalMarquee(marqueeWrap);

    var realitySwiper = new Swiper('.reality_slider_wrap', {
        slidesPerView: "auto",
        centeredSlides: true,
        loop: true,
        mousewheel: true,
    });
}

function NormalMarquee(marqueeWrap, activerEventer) {
    var mqWrap = marqueeWrap;

    for (var i = 0; i < mqWrap.length; i++) {
        var mqWrapWidth = mqWrap[i].offsetWidth;
        var marqueeInner = mqWrap[i].querySelector('.marquee_inner');
        var marqueeContents = mqWrap[i].querySelector('.marquee_contents');
        var marqueeContentsWidth = marqueeContents.offsetWidth;
        
        normalMarquee(mqWrap[i], marqueeInner, marqueeContentsWidth);

        addText(marqueeInner, marqueeContents, mqWrapWidth);
    }

    function normalMarquee (mqWrap, mqInner, mqContentsWidth) {
        var mqWrap = mqWrap;
        var mqInner = mqInner;
        var mqContentsWidth = mqContentsWidth;
        var xPos = 0;
        var fastVal = 1.25;
        
        if (mqWrap.classList.contains('back')) {
            var xPosVal = function (xPosition) {
                return xPosition - 1;
            }
            var xPosFast = function (xPosition) {
                return xPosition - fastVal;
            }
        }
        else {
            var xPosVal = function (xPosition) {
                return xPosition + 1;
            }
            var xPosFast = function (xPosition) {
                return xPosition + fastVal;
            }
        }

        function activer() {
            mqInner.style.transform = 'translate3d(' + xPos + 'px, 0, 0)';
            xPos = xPosVal(xPos);

            if (activerEventer !== undefined && activerEventer.classList.contains('over')) {
                xPos = xPosFast(xPos);
            }

            if (Math.abs(mqContentsWidth) <= Math.abs(xPos)) {
                xPos = 0;
            }
            return requestAnimationFrame(activer);
        }

        activer();
    }
}

function HoverMarquee () {
    var mqWrap = document.querySelectorAll('.marquee_wrap.hover');

    for (var i = 0; i < mqWrap.length; i++) {
        var mqWrapWidth = mqWrap[i].offsetWidth;
        var marqueeInner = mqWrap[i].querySelector('.marquee_inner');
        var marqueeContents = mqWrap[i].querySelector('.marquee_contents');
        var marqueeContentsWidth = marqueeContents.offsetWidth;
        var hoverMarqueeActiver = mqWrap[i].parentElement;

        hoverMarquee(mqWrap[i], marqueeInner, marqueeContentsWidth, hoverMarqueeActiver);

        addText(marqueeInner, marqueeContents, mqWrapWidth);
    }

    function hoverMarquee (mqWrap, mqInner, mqContentsWidth, hoverActiver) {
        var mqWrap = mqWrap;
        var mqInner = mqInner;
        var mqContentsWidth = mqContentsWidth;
        var hoverActiver = hoverActiver;
        var requestId;
        var xPos = 0;
        var fastVal = 1.25;

        if (mqWrap.classList.contains('back')) {
            var xPosVal = function (xPosition) {
                return xPosition - 1;
            }
            var xPosFast = function (xPosition) {
                return xPosition - fastVal;
            }
        }
        else {
            var xPosVal = function (xPosition) {
                return xPosition + 1;
            }
            var xPosFast = function (xPosition) {
                return xPosition + fastVal;
            }
        }

        function activer() {
            mqInner.style.transform = 'translate3d(' + xPos + 'px, 0, 0)';
            xPos = xPosVal(xPos);

            if (Math.abs(mqContentsWidth) <= Math.abs(xPos)) {
                xPos = 0;
            }

            return requestId = requestAnimationFrame(activer);
        }

        hoverActiver.addEventListener('mouseenter', function () {
            requestId = requestAnimationFrame(activer);
        })

        hoverActiver.addEventListener('mouseleave', function () {
            setTimeout(function () {
                cancelAnimationFrame(requestId);
            }, 200);
        })

    }
}

function addText (mqInner, marqueeContents, mqWrapW) {
    var mqInner = mqInner;
    var mqInnerW = mqInner.offsetWidth;
    var mqContentsClone = marqueeContents.cloneNode(true);

    mqInner.append(mqContentsClone);
    mqInnerW = mqInner.offsetWidth;

    if (mqWrapW * 2 < mqInnerW) {
        return;
    }
    addText(mqInner, marqueeContents, mqWrapW);
}

function includeHeader () {
    var headerElementes = document.getElementById('header');
    var includePath = headerElementes.dataset.includePath;
    if (includePath) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                headerElementes.outerHTML = this.responseText;
                InitGnb();
            }
        };
        xhttp.open('GET', includePath, true);
        xhttp.send();
    }
}

globalInit();