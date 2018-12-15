function getEverything () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/geteverything', true);

    xhr.onload = function () {
        let opt = JSON.parse(xhr.responseText);
        let tt = '';
        let aa = '';
        let hh = '';
        let pp = '';
        for (let i = 0; i < opt.type.length; ++i) {
            tt+= '<option value="'+opt.type[i]+'" selected >'+ opt.type[i] +'</option>';
            }
        for (let i = 0; i < opt.age.length; ++i) {
            aa+= '<option value="'+opt.age[i]+'" selected >'+ opt.age[i] +'</option>';
        }
        for (let i = 0; i < opt.hard.length; ++i) {
            hh+= '<option value="'+opt.hard[i]+'" selected >'+ opt.hard[i] +'</option>';
        }
        for (let i = 0; i < opt.place.length; ++i) {
            pp+= '<option value="'+opt.place[i]+'" selected >'+ opt.place[i] +'</option>';
        }
        document.getElementById('category').innerHTML = tt;
        document.getElementById('age').innerHTML = aa;
        document.getElementById('hardness').innerHTML = hh;
        document.getElementById('place').innerHTML = pp;
    };
    xhr.send();
}

getEverything();