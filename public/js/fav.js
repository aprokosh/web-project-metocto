function unfav (button) {
    let id = button.value;
    $.post('/unfav', { id: id });
    document.getElementById(id).innerHTML = '';
}

function getFav () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getfav', true);

    xhr.onload = function () {
        let mero = JSON.parse(xhr.responseText);
        let qq = '';
        if (mero.data.length == 0){
            qq += '<div><h1> В избранном пока ничего нет</h1>';
        }
        for (let i = 0; i < mero.data.length; ++i) {
            let this_id = mero.data[i].id;
            qq += '<div class="mero">';
            qq += '<h3>' + mero.data[i].name + '<span id="' + this_id + '"><img src="style/img/star.png"><span></h3>';
            qq += '<block>';
            qq += '<div> Возраст: ' + mero.data[i].age + '</div>';
            qq += '<div> Категория: ' + mero.data[i].type + '</div>';
            qq += '<div> Сложность: ' + mero.data[i].hard + '</div>';
            qq += '<div> Место проведения: ' + mero.data[i].place + '</div>';
            qq += '<div> Описание: ' + mero.data[i].desc + '</div>';
            qq += '<div><a href=' + mero.data[i].link + '>Ссылка</a></div>';
            qq += '<button type="button" onclick="unfav(this)" value="' + this_id + '" class="btn btn-warning">Убрать из избранного</button>';
            qq += '</block></div>';
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

getFav();