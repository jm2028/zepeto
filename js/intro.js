"use strict"

var globalInit = function () {
    InitGnb();
    InitIntro();
    HoverMarquee();
}

var InitGnb = function () {
    var gnbWrap = document.querySelector('.gnb_wrap');
    var gnbOpener = document.querySelector('.gnb_opener');

    gnbOpener.addEventListener('click', function() {
        if (gnbWrap.classList.contains('open')) {
            gnbWrap.classList.remove('open')
        }
        else {
            gnbWrap.classList.add('open');
        }
    })
}

var InitIntro = function () {
    var introWrap = document.querySelector('.intro_wrap');
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

    NormalMarquee(introWrap);
}

function NormalMarquee(activerEventer) {
    var mqWrap = document.querySelectorAll('.marquee_wrap.normal');

    for (var i = 0; i < mqWrap.length; i++) {
        var mqWrapWidth = mqWrap[i].offsetWidth;
        var marqueeInner = mqWrap[i].querySelector('.marquee_inner');
        var mqInnerWidth = marqueeInner.offsetWidth;
        var marqueeContents = mqWrap[i].querySelector('.marquee_contents');
        var mqContentsClone = marqueeContents.cloneNode(true);
        var marqueeContentsWidth = marqueeContents.offsetWidth;
        
        normalMarquee(mqWrap[i], marqueeInner, marqueeContentsWidth);

        var mqClone = document.createElement('span');
        var mqText = document.createTextNode(marqueeContents.innerText);
        mqClone.appendChild(mqText);
        mqClone.classList.add('marquee_contents');
        marqueeInner.appendChild(mqClone);
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

            if (activerEventer.classList.contains('over')) {
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
        var mqInnerWidth = marqueeInner.offsetWidth;
        var marqueeContents = mqWrap[i].querySelector('.marquee_contents');
        var mqContentsClone = marqueeContents.cloneNode(true);
        var hoverMarqueeActiver = mqWrap[i].previousElementSibling;
        var marqueeContentsWidth = marqueeContents.offsetWidth;

        hoverMarquee(mqWrap[i], marqueeInner, marqueeContentsWidth, hoverMarqueeActiver);

        var mqClone = document.createElement('span');
        var mqText = document.createTextNode(marqueeContents.innerText);
        mqClone.appendChild(mqText);
        mqClone.classList.add('marquee_contents');
        marqueeInner.appendChild(mqClone);
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

        hoverActiver.addEventListener('mouseover', function () {
            requestId = requestAnimationFrame(activer);
        })

        hoverActiver.addEventListener('mouseout', function () {
            setTimeout(function () {
                cancelAnimationFrame(requestId);
            }, 200);
        })

    }
}

globalInit();