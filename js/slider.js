var prefix = (function () {
    var styles = window.getComputedStyle(document.documentElement, ''),
        pre = (Array.prototype.slice
                .call(styles)
                .join('')
                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
    return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
    };
})();

function Slider(elem){

    function extend(a,b) {
        for (var p in b) {
            a[p] = b[p];
        }
        return a
    }

    var options = {
        speed: 2,
    };

    extend(options, arguments[1] || {});

    this.slider = elem;
    this.wrap = this.findChilds('.s-Wr')[0];
    this.slides = this.findChilds('.s-Sl');
    this.pag = this.findChilds('.s-pag')[0];
    this.index = 0;

    var self = this;
    var requestId;
    var target;
    var start = new Date().getTime();
    var go = false;
    var pagActive = false;
    var currentPos = 0;

    this.ease = function (pos) {
        return (-0.5 * (Math.cos(Math.PI*pos) -1));
    };

    this.animate = (function(){
        var pos = 0;
        var interval = 0;

        return function(direction, val){

            if (interval >= target ) {
                go = false;
                pagActive = false;
                interval = 0;
                completeAnimation(direction, pos, val);
                currentPos = window.innerWidth * -self.index;
                setTranslate(currentPos);
                return;
            }

            if (self.index && pagActive) {
                val = Math.abs(self.index - val);
                pagActive = false;
            };

            if (!go) {
                start = new Date().getTime();
            };

            target = parseInt(self.slides[0].offsetWidth) * val;

            var t = (new Date().getTime() - start) / (1000 * options.speed);
            pos = currentPos + (self.ease(t) * target + options.speed) * direction;
            interval = self.ease(t) * target + options.speed;

            setTranslate(pos);

            requestId = window.requestAnimationFrame(function(){
                self.animate(direction,val);
            });

            go = true;
        }
    })();

    this.next = function(){
        if (self.index != self.slides.length - 1 && !go) {
            this.animate(-1, 1);
        }
    };

    this.prev = function(){
        if (self.index != 0 && !go) {
            this.animate(1, 1);
        }
    };

    function renderPagination(){
        for (var i=0; i<self.slides.length; i++) {

            var elem = document.createElement("div");
            elem.className = "s-c";
            self.pag.appendChild(elem);
            elem.setAttribute('data-index',i);
            self.findChilds('.s-c')[0].classList.add('active');

            elem.onclick = function(){

                if (go) {
                    return;
                }

                pagActive = true;

                for (var i=0; i<self.findChilds('.s-c').length; i++) {
                    self.findChilds('.s-c')[i].className = "s-c";
                }

                this.classList.add('active');

                var index = this.getAttribute('data-index');

                if (self.index > index) {
                    self.animate(1,index);
                } else if (self.index < index){
                    self.animate(-1,index);
                }
            }
        }
    }

    renderPagination();

    function completeAnimation(direction, pos, val){
        self.index = self.index + val * -direction;
        for (var i=0; i<self.findChilds('.s-c').length; i++) {
            self.findChilds('.s-c')[i].className = "s-c";
            if (self.findChilds('.s-c')[i].getAttribute('data-index') == self.index) {
                self.findChilds('.s-c')[i].classList.add('active');
            }
        }
    }

    function setTranslate(pos) {
        self.wrap.style.webkitTransform = 'translate3d('+ pos +'px,0px,0px)';
        self.wrap.style.mozTransform = 'translate3d('+ pos +'px,0px,0px)';
        self.wrap.style.transform = 'translate3d('+ pos +'px,0px,0px)';
    }

    function resize() {
        if (self.index > 0) {
            currentPos = window.innerWidth * -self.index;
            setTranslate(currentPos);
        }

        self.wrap.style.width = window.innerWidth * self.slides.length + 'px';
        for (var i=0; i<self.slides.length; i++) {
            self.slides[i].style.width = self.wrap.offsetWidth / self.slides.length + 'px';
        }

        target = parseInt(self.slides[0].offsetWidth);
    }

    resize();
    window.addEventListener("resize", resize);
}

Slider.prototype.findChilds = function(elem){
    return this.slider.querySelectorAll(elem);
}