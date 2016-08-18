function getElems(elem) {
    return document.querySelectorAll(elem);
};

function formCheck(btn, that) {

    var form = that,
        btn = btn;

    for (var i=0; i<form.querySelectorAll('.rfield').length; i++){
        form.querySelectorAll('.rfield')[i].classList.add('empty_field');
    }

    function checkInput(){
        for (var i=0; i<form.querySelectorAll('.rfield').length; i++) {
            if (form.querySelectorAll('.rfield')[i].value != '') {
                form.querySelectorAll('.rfield')[i].classList.add('ok');
                form.querySelectorAll('.rfield')[i].classList.remove('empty_field');
            } else {
                form.querySelectorAll('.rfield')[i].classList.add('empty_field');
                form.querySelectorAll('.rfield')[i].classList.remove('ok');
            }
        }
    }


    function lightEmpty(){
        for (var i=0; i<form.querySelectorAll('.empty_field').length; i++){
            form.querySelectorAll('.empty_field')[i].classList.add('false');
            form.querySelectorAll('.empty_field')[i].nextElementSibling.style.display = "block";
        }

        setTimeout(function(){
            for (var j=0; j<form.querySelectorAll('.rfield').length; j++){
                form.querySelectorAll('.rfield')[j].classList.remove('false');
                form.querySelectorAll('.rfield')[j].nextElementSibling.style.display = "none";
            }
        },2000);
    }


    setInterval(function(){
        checkInput();
        var sizeEmpty = form.querySelectorAll('.empty_field').length;

        if(sizeEmpty > 0){
            for (var i=0; i<btn.classList.length; i++) {
                if (btn.classList[i] == 'disabled') {
                    return false
                } else {
                    btn.classList.add('disabled');
                }
            }
        } else {
            btn.classList.remove('disabled');
        }



    },500);

    btn.onclick = function(e) {
        e.preventDefault();
        var end = false;
        for (var i=0; i<this.classList.length; i++) {
            if (this.classList[i] == "disabled") {
                lightEmpty();
                end = true;
                return false
            }
        }

        if (!end) {
            var val = localStorage.getItem("gift");
            val = parseInt(val) + 1;
            localStorage.setItem("gift", val);
            //form.submit();
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'data.json', true);
            xhr.send();

            xhr.onreadystatechange = function() {

                if (xhr.readyState != 4) return;

                if (xhr.status != 200) {
                    console.log(xhr.status + ': ' + xhr.statusText);
                } else {
                    var res = JSON.parse(xhr.responseText);
                    console.log(res);
                }

            }

            setTimeout(function(){
                getElems('.n-form')[0].classList.remove('n-pop--active');
            });

            getElems('.n-res')[0].style.display = 'block';
            setTimeout(function(){
                getElems('.n-pop__val')[0].innerHTML = localStorage.getItem("gift");
                getElems('.n-res')[0].classList.add('n-pop--active');
            },50);
        }
    };
}
