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

            if (detailOffsetTop <= realityMainWrap.scrollTop + 50) {
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
                    animatedShow();
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

    var animatedShow = function () {
        var scrollWrap = document.querySelector('.main_wrap');
        var $showElem = document.querySelectorAll('.js-showAni');
        var scrollWrapHeight = scrollWrap.offsetHeight;
        var scrollTimer;

        var scrollEventer = function (currentScroll) {
            for(var i = 0; i < $showElem.length; i++) {
                if (($showElem[i].getBoundingClientRect().top + $showElem[i].offsetHeight * 0.1) - scrollWrapHeight < 0) {
                    $showElem[i].classList.add('on');
                }
            }
        }

        scrollWrap.addEventListener('scroll', function () {
            if(!scrollTimer) {
                scrollTimer = setTimeout(function () {
                    scrollTimer = null;
                    scrollEventer(scrollWrap.scrollTop + scrollWrap.offsetHeight);
                }, 200)
            }
        })
    };

    realitySliderWrap.addEventListener('click', function (e) {
        var detailDataSet = eventPath(e, this);

        if (detailDataSet === false) {
            return;
        }
        
        realityDetailOpen(detailDataSet, realityLoaded);
    });

    NormalMarquee(marqueeWrap);
}

var InitPlay = function () {
    var sliderEmoji = document.getElementsByClassName('js-sliderEmoji')[0];

    var playNavSlider = new Swiper('.play_nav_slider', {
        slidesPerView: "auto",
        spaceBetween: 20,
        freeMode: {
            sticky: true,
        }
    });

    var thumbChanger = function () {
        var thumbChangerBtn = document.getElementsByClassName('nav_slider_box');

        for (var i = 0; i < thumbChangerBtn.length; i++) {
            thumbChangerBtn[i].addEventListener('click', function () {
                var categoryData =  this.dataset.item;
                var beforeThumb = document.querySelectorAll('.activeThumb');
                var thisThumb = document.querySelectorAll('.' + categoryData);

                activeToggler(beforeThumb, thisThumb);
                orderChanger(this);
            })
        }
    }

    var activeToggler = function (beforeThum, thisThum) {
        for (var i = 0; i < beforeThum.length; i++) {
            beforeThum[i].classList.remove('activeThumb');
        }
        for (var i = 0; i < thisThum.length; i++) {
            thisThum[i].classList.add('activeThumb');
        }
    }

    var orderChanger = function (changerBtn) {
        var currentSliderBox = changerBtn.parentElement;
        var thumbChangerBox = document.getElementsByClassName('nav_slider_item');

        var nextOrderChanger = function (target) {
            var nextElem = target.nextElementSibling;
            if (nextElem === null) {
                return;
            }
            nextElem.style.order = "-1";

            if (nextElem.nextElementSibling !== null) {
                return nextOrderChanger(nextElem);
            }
        }

        for (var i = 0; i < thumbChangerBox.length; i++) {
            thumbChangerBox[i].style.order = "";
        }

        nextOrderChanger(currentSliderBox);
    }

    var emojiTyping = function (typingWrap, delayWrap) {
        var i = 0;
        var typingDelay = 150;
        var $typingWrap = typingWrap;
        var $typingContents = $typingWrap.innerHTML.replace(/<br>/gi, "\n");
        var $delayWrap = delayWrap;
        var $delayContents = $delayWrap != undefined ? $delayWrap.dataset.text.replace(/<br>/gi, "\n").length : 0;
        var $delayCount = ($delayContents * typingDelay) + ($delayContents == 0 ? 0 : 550);
        var $emoji = $typingWrap.nextElementSibling;

        $typingWrap.dataset.text = $typingContents;
        $emoji.classList.remove('on');
        $typingWrap.textContent = "";

        setTimeout(function () {
            insertText();
        }, $delayCount);

        function insertText () {
            $typingWrap.innerHTML += $typingContents[i];
            i++;

            if ($typingContents.length <= i) {
                $emoji.classList.add('on');
                return;
            }
            else {
                setTimeout(function () {
                    return insertText();
                }, typingDelay)
            }
        }
    }

    sliderEmoji.addEventListener('click', function () {
        emojiTyping(document.getElementsByClassName('js-typing')[0]);
        emojiTyping(document.getElementsByClassName('js-typing')[1], document.getElementsByClassName('js-typing')[0]);
    })
    thumbChanger();
}

var InitPlayDetail = function () {
    var Ghost = function () {
        var groomNameInput = document.getElementsByClassName('js-groomName')[0];
        var brideNameInput = document.getElementsByClassName('js-brideName')[0];
        var thumbGroomName = document.getElementsByClassName('js-thumbGroomName')[0];
        var thumbBrideName = document.getElementsByClassName('js-thumbBrideName')[0];
        var thumbGroomImg = document.getElementsByClassName('js-thumbGroom')[0];
        var thumbBrideImg = document.getElementsByClassName('js-thumbBride')[0];
        var descGroomName = document.getElementsByClassName('js-descGroomCharacter')[0];
        var descBrideName = document.getElementsByClassName('js-descBrideCharacter')[0]
        var groomName = document.getElementsByClassName('js-descGroomName')[0];
        var brideName = document.getElementsByClassName('js-descBrideName')[0];
        var btnNameConfirm = document.getElementsByClassName('js-nameConfirm')[0];
        var btnCharacterSelector = document.querySelectorAll('.js-characterSelector');
        var groomCharacterList = [];
        var brideCharacterList = [];

        var JOKER = new Character('JOKER', '조커');
        var REAPER = new Character('REAPER', '저승사자');
        var JACK = new Character('JACK O  LANTERN', '잭오랜턴');
        var JIANGSHI  = new Character('JIANGSHI', '강시');
        var MUMMY = new Character('MUMMY', '미라');
        var HARLEQUIN = new Character('HARLEQUIN', '할리퀸');
        var SALLY = new Character('SALLY', '샐리');
        var GHOST = new Character('VIRGIN GHOST', '처녀귀신');
        
        groomCharacterList.push(JOKER, REAPER, JACK, JIANGSHI);
        brideCharacterList.push(MUMMY, HARLEQUIN, SALLY, GHOST);

        var characterSelector = function (button) {
            var beforeActive;
            for (var i = 0; i < button.length; i++) {
                button[i].addEventListener('click', function () {
                    if (this.hasClass('js-groomSelector')) {
                        beforeActive = document.getElementsByClassName('js-groomSelector active')[0];
                        descGroomName.innerHTML = groomCharacterList[getIndex(this)].koname;
                        thumbGroomName.innerHTML = groomCharacterList[getIndex(this)].enname;
                        thumbGroomImg.src = "./img/play/play_ghost_thumb_groom_" + (getIndex(this) + 1) + ".png";
                        thumbGroomImg.dataset.type = (getIndex(this) + 1);
                    }
                    else {
                        beforeActive = document.getElementsByClassName('js-brideSelector active')[0];
                        descBrideName.innerHTML = brideCharacterList[getIndex(this)].koname;
                        thumbBrideName.innerHTML = brideCharacterList[getIndex(this)].enname;
                        thumbBrideImg.src = "./img/play/play_ghost_thumb_bride_" + (getIndex(this) + 1) + ".png";
                        thumbBrideImg.dataset.type = (getIndex(this) + 1);
                    }

                    if(beforeActive !== undefined) {
                        beforeActive.classList.remove('active');
                    };

                    this.classList.add('active');
                })
            }
        }

        btnNameConfirm.addEventListener('click', function () {
            groomName.innerHTML = groomNameInput.value;
            brideName.innerHTML = brideNameInput.value;
        })

        characterSelector(btnCharacterSelector);

        function Character(enname, koname) {
            this.enname = enname;
            this.koname = koname;
        }
    }
    var nextBtn = document.getElementsByClassName('game_btn_next');
    var progressBar = document.getElementsByClassName('inner_bar')[0];
    var nextAction = function (target, idx) {
        var currentContentsWrap = target.parentElement;
        var idx = idx;

        target.addEventListener('click', function () {
            progressBar.style.width = (25 * idx) + 50 + "%";
            currentContentsWrap.classList.add('end');
            currentContentsWrap.classList.remove('on');
            currentContentsWrap.nextElementSibling.classList.add('on');
        })
    }
    for (var i = 0; i < nextBtn.length; i++) {
        nextAction(nextBtn[i], i);
    }

    Ghost();

}

var InitFeatured = function () {
    var $featureWrap = document.getElementsByClassName('featured_wrap')[0];

    var featureIntro = function () {
        var $featureIntro = document.getElementsByClassName('featured_intro')[0];
        var $followWrap = document.getElementsByClassName('js-followWrap')[0];
        var $followCard = $followWrap.getElementsByClassName('js-followCard');
        var $photoBoothBtn = document.getElementsByClassName('btn_photobooth')[0];
        var $followWrapWidth = $followWrap.offsetWidth / 2;
        var $followWrapHeight = $followWrap.offsetHeight / 2;
        var xPos;
        var yPos;
        var timer;
        var delay = 30;
    
        $featureIntro.addEventListener('mousemove', function (e) {
            if (!timer) {
                timer = setTimeout(function () {
                    timer = null;
                    xPos = ($followWrapWidth - e.clientX) * - 0.1;
                    yPos = ($followWrapHeight - e.clientY) * - 0.1;
                    for (var i = 0; i < $followCard.length; i++) {
                        movingTarget($followCard[i], xPos, yPos);
                    }
                }, delay);
            }
        })
    
        $photoBoothBtn.addEventListener('click', function () {
            $featureWrap.classList.add('booth');
            document.querySelector('.header_zepeto_logo').classList.add('original');
        })
    
        function movingTarget (target, xpos, ypos) {
            target.style.transform = 'translate3d(' + xpos + 'px, ' + ypos + 'px, 0)';
        }
    };

    var featureBooth = function () {
        var itemCloth = 0;
        var itemShose = 0;
        var itemHat = 0;
        var itemBag = 0;
        var btnShopWrap = document.getElementsByClassName('shop_item_wrap')[0];
        var btnShopItem = btnShopWrap.getElementsByClassName('js-shopItem');
        var btnNext = document.getElementsByClassName('js-btnChoice')[0];
        var itemWrap = document.getElementsByClassName('item_wrap');
        var chararterImg = document.getElementById('character_img');
        var btnText = ['모자 선택하기', '가방 선택하기', '촬영 하러 가기']
        var textCounter = 0;

        for (var i = 0; i < btnShopItem.length; i++) {
            btnShopItem[i].addEventListener('click', function (e) {
                thumbChanger(this);
            })
        }

        function thumbChanger (target) {
            var $this = target;
            var $beforeActiveBtn = btnShopWrap.querySelector('.js-shopItem.on');
            
            if ($this.dataset.cloth) {
                itemCloth = $this.dataset.cloth;
            }
            else if ($this.dataset.shose) {
                itemShose = $this.dataset.shose;
            }
            else if ($this.dataset.hat) {
                itemHat = $this.dataset.hat;
            }
            else if ($this.dataset.bag) {
                itemBag = $this.dataset.bag;
            }

            chararterImg.src = './img/featured/equip/featured_booth_equip_cloth_' + itemCloth + '_' + itemShose + '_' + itemHat + '_' + itemBag + '.png';

            if ($beforeActiveBtn != undefined) {
                $beforeActiveBtn.classList.remove('on');
            }
            $this.classList.add('on');
        }

        btnNext.addEventListener('click', function () {
            var currentItem = btnShopWrap.querySelector('.item_wrap.on');
            var currentStep = document.querySelector('.shop_step.on');
            var $beforeActiveBtn = currentItem.querySelector('.js-shopItem.on');
            var nextItem = currentItem.nextElementSibling;
            var nextStep = currentStep.nextElementSibling;
            
            if ($beforeActiveBtn == undefined) {
                alert('아이템을 선택해 주세요.');
                return;
            };
            if (nextStep != undefined && nextStep.nextElementSibling == undefined) {
                btnNext.innerHTML = '촬영 하러 가기'
            };
            if (nextStep == undefined) {
                $featureWrap.classList.add('photo');
                return;
            }

            currentItem.classList.remove('on');
            currentStep.classList.remove('on');
            nextItem.classList.add('on');
            nextStep.classList.add('on');
            btnNext.innerHTML = btnText[textCounter];
            textCounter++;
        })
    }

    var featurePhoto = function () {
        var btnPhoto = document.querySelector('.js-btnPhoto');
        var poseWrapper = document.querySelector('.pose_slider_wrap');
        var photoWrapper = document.querySelector('.photo_wrap')
        var photoCharacter = document.querySelector('.js-imgCharacter');
        var btnReset = document.querySelector('.btn_reset')

        var photoPoseSwiper = new Swiper('.pose_slider_wrap', {
            slidesPerView: "5",
            centeredSlides: true,
            loop: true,
            spaceBetween: 60,
            navigation: {
                nextEl: '.pose_btn_next',
                prevEl: '.pose_btn_prev',
            },
        });

        photoPoseSwiper.on('resize', function () {
            photoPoseSwiper.updateSize();
        })

        btnPhoto.addEventListener('click', function () {
            var activeSlider = poseWrapper.querySelector('.swiper-slide-active');
            var currentImgSrc = activeSlider.querySelector('img').src;
            photoWrapper.classList.add('on');
            photoCharacter.src = currentImgSrc;
        })

        btnReset.addEventListener('click', function () {
            photoWrapper.classList.remove('on');
        })
        
    }

    featureIntro();
    featureBooth();
    featurePhoto();
    
}

var InitTutorial = function () {
    
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

function getIndex (target) {
    var i = 0;
    while((target = target.previousElementSibling) != null) {
        i++;
    }

    return i;
}

globalInit();