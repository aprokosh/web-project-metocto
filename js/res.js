function fav (button) {
    let id = button.value;
    $.post('/fav', { id: id });
    document.getElementById(id).innerHTML = '<img src="style/img/star.png">';
    document.getElementById('changebtn' + id).innerHTML = '<button type="button" onclick="unfav(this)" value="' + id + '" class="btn btn-warning">Убрать из избранного</button>';
}

function unfav (button) {
    let id = button.value;
    $.post('/unfav', { id: id });
    document.getElementById(id).innerHTML = '';
    document.getElementById('changebtn' + id).innerHTML = '<button type="button" onclick="fav(this)" value="' + id + '" class="btn btn-warning">В избранное</button>'
}

function getRes () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getmero', true);

    xhr.onload = function () {
        let mero = JSON.parse(xhr.responseText);
        let qq = '';
        if (mero.data.length === 0){
            qq += '<div><h1> Мероприятия с заданными параметрами не найдены</h1>';
            qq += '<input type="button" class="btn btn-info change" value="Изменить параметры"></div>';;
        }
        for (let i = 0; i < mero.data.length; ++i) {
            isFav = mero.data[i].f;
            if (isFav === false){
                let this_id = mero.data[i].id;
                qq += '<div class="mero">';
                qq += '<h3>' + mero.data[i].name + '<span id="' + this_id + '"><span></h3>';
                qq += '<block>';
                qq += '<div><a href=' + mero.data[i].link + '>Ссылка</a></div>';
                qq += '<div>' + mero.data[i].desc + '</div>';
                qq += '<div id="changebtn' + this_id + '"><button type="button" onclick="fav(this)" value="' + this_id + '" class="btn btn-warning">В избранное</button></div>'
                qq += '</block></div>';
            }
            else if (isFav===true){
                let this_id = mero.data[i].id;
                qq += '<div class="mero">';
                qq += '<h3>' + mero.data[i].name + '<span id="' + this_id + '"><img src="style/img/star.png"><span></h3>';
                qq += '<block>';
                qq += '<div><a href=' + mero.data[i].link + '>Ссылка</a></div>';
                qq += '<div>' + mero.data[i].desc + '</div>';
                qq += '<div id="changebtn' + this_id + '"><button type="button" onclick="unfav(this)" value="' + this_id + '" class="btn btn-warning">Убрать из избранного</button></div>';
                qq += '</block></div>';
            }
        }
        document.getElementById('result').innerHTML = qq;
        $('.mero h3').click(function () {
            if (!$(this).parent().find('block').is(':visible')) {
                $(this).parent().find('block').show(200)
            }
            else {
                $(this).parent().find('block').hide(200)
            }
        });
        $( ".change").click(function() {
            window.location.href = `/mero`;
        });
    }
    xhr.send()
};

getRes();