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
    var realityMainWrap = document.getElementsByClassName('reality_main')[0];
    var marqueeWrap = document.querySelectorAll('.marquee_wrap');
    var detailOpener = realityMainWrap.querySelectorAll('.js-detailOpener');
    var realitySliderWrap = document.getElementsByClassName('reality_slider_wrap')[0];
    var openerCtrl = true;
    var transitionTime = 1000;
    var delay = 200;
    var timer;

    var realitySwiper = new Swiper(realitySliderWrap, {
        slidesPerView: "auto",
        centeredSlides: true,
        loop: true,
        mousewheel: true,
    });

    var realityDetailOpen = function (dataSet, loadedCallback) {
        if (false === dataSet) {
            return false;
        }
        var detailFile = dataSet;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var newSection = document.createElement('section');
                realityMainWrap.append(newSection);
                newSection.outerHTML = this.responseText;
                loadedCallback(); 
            }
        };
        xhttp.open('GET', detailFile, true);
        xhttp.send();
    }

    var realityLoaded = function () {
        var detailWrap = document.querySelector('.reality_detail');
        var detailMarquee = detailWrap.querySelectorAll('.marquee_wrap');
        var allImg = detailWrap.querySelectorAll('img');
        var allImgLength = allImg.length
        var imgLoadChecker = 0;

        for (var i = 0; i < allImgLength; i++) {
            allImg[i].onload = function () {
                imgLoadChecker++;

                if (imgLoadChecker == allImgLength) {
                    console.log('loaded');
                }
            }
        }


        var headerLogo = document.querySelector('.header_zepeto_logo');
        var detailContents = detailWrap.querySelector('.reality_detail_contents');
        var detailOffsetTop = detailContents.offsetTop;
        var closeBtn = detailWrap.querySelector('.detail_btn_close');

        var logoColorChanger = function () {
            detailOffsetTop = detailContents.offsetTop;

            if (detailOffsetTop <= realityMainWrap.scrollTop) {
                closeBtn.classList.add('reverse');
                headerLogo.classList.add('original');
            }
            else {
                closeBtn.classList.remove('reverse');
                headerLogo.classList.remove('original');
            }
        }

        var scrollEvent = function () {
            if (!timer) {
                timer = setTimeout(function () {
                    timer = null;
    
                    logoColorChanger();
                }, delay);
            }
        }

        var closeDetail = function () {
            realityMainWrap.classList.remove('opend');
            setTimeout(function () {
                realityMainWrap.removeEventListener('scroll', scrollEvent);
                closeBtn.removeEventListener('click', closeDetail);
                detailWrap.remove();
                openerCtrl = true;
            }, transitionTime);
        }

        var detailItemSwiper = new Swiper('.detail_itemslider_wrap', {
            slidesPerView: "5",
            centeredSlides: true,
            loop: true,
            spaceBetween: 60,
        });

        realityMainWrap.classList.add('opend');

        realityMainWrap.addEventListener('scroll', scrollEvent);

        closeBtn.addEventListener('click', closeDetail);

        NormalMarquee(detailMarquee);
    }

    realitySliderWrap.addEventListener('click', function (e) {
        realityDetailOpen(eventPath(e, this), realityLoaded);
    });

    NormalMarquee(marqueeWrap);
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

function eventPath(evt, listner) {
    var target = evt.target;
    var eventListener = listner;

    if (target === window) {
        return false;
    }

    function findData(node) {
        var parentNode = node.parentNode;

        if (parentNode.hasClass('js-detailOpener')) {
            return parentNode.dataset.detailOpener;
        }
        else if (parentNode == eventListener) {
            return false;
        }
        else {
            return findData(parentNode);
        }
    }

    return findData(target);
}

HTMLElement.prototype.hasClass = function (cls) {
    var i;
    var classes = this.className.split(" ");
    for(i = 0; i < classes.length; i++) {
        if(classes[i] == cls) {
            return true;
        }
    }
    return false;
};

globalInit();