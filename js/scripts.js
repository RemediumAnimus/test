'use strict'
function ready(){

    var timerId;
    if (!localStorage.getItem("gift")) {
        localStorage.setItem("gift", 12);
    }

    function transitionEnd() {
        var el = document.createElement('div')

        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return transEndEventNames[name];
            }
        }

        return false
    }

    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];

        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());

    if ( !Modernizr.objectfit ) {
        for (var i=0; i<getElems('.n-fit').length; i++) {
            var container = getElems('.n-fit')[i];
            var imgUrl = container.getElementsByTagName('img')[0].getAttribute('src');
            container.getElementsByTagName('img')[0].style.display = 'none';

            if (imgUrl) {
                container.style.backgroundImage = 'url(' + imgUrl + ')'
            }
        }
    };

    function getElems(elem) {
        return document.querySelectorAll(elem);
    };

    function getElems(elem) {
        return document.querySelectorAll(elem);
    };

    var slider = new Slider(getElems('#slider')[0],{
        speed: 1.5,
    });

    getElems('.n-slider__arrR')[0].onclick = function(e) {
        slider.next();
    };

    getElems('.n-slider__arrL')[0].onclick = function(e) {
        slider.prev();
    };

    function openPop(elem){
        getElems(elem)[0].style.display = 'block';
        setTimeout(function(){
            getElems(elem)[0].classList.add('n-pop--active');
        },50);
    }

    function closePop(elem){
        setTimeout(function(){
            for (var i=0; i<getElems(elem).length; i++) {
                getElems(elem)[i].classList.remove('n-pop--active');
            }
        });
    }

    function transition() {
        var classes = this.classList;
        var end;
        for (var i=0; i<classes.length; i++) {
            if (classes[i] == 'end') {
                end = 'end';
            }
        }
        if (end) {
            this.classList.remove('end');
            this.style.display = 'none';
        } else {
            this.classList.add('end');
        }
    }

    getElems('.n-form')[0].addEventListener( transitionEnd(), transition, false );
    getElems('.n-res')[0].addEventListener( transitionEnd(), transition, false );


    var getDate = (function(){

        var date = new Date;
        date.setMonth(8);
        date.setDate(24);
        date.setHours(12, 0, 0, 0);

        return function(){
            timerId = window.requestAnimationFrame(getDate);
            var newDate = date - new Date;
            var minutes = Math.floor(newDate / 60000 % 60);
            var seconds = Math.floor(newDate / 1000 % 60);
            var hours = Math.floor(newDate / 3600000);

            getElems('.days')[0].innerHTML = hours;
            getElems('.hours')[0].innerHTML = minutes;
            getElems('.sec')[0].innerHTML = seconds;
        }

    })();

    getDate();

    getElems('.n-open')[0].onclick = function(e) {
        e.preventDefault();
        openPop('.n-form');
        formCheck(getElems('.n-send')[0], getElems('.n-form')[0]);
    }

    getElems('.n-close')[0].onclick = function(e) {
        e.preventDefault();
        closePop('.n-pop');
    }

    getElems('.n-close')[1].onclick = function(e) {
        e.preventDefault();
        closePop('.n-pop');
    }
}
document.addEventListener("DOMContentLoaded", ready);