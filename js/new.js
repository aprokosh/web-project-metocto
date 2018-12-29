function confirm (button) {
    let id = button.value;
    $.post('/confirm', { id: id });
    document.getElementById(id).innerHTML = '<img src="style/img/ok.png">';
}

function reject (button) {
    let id = button.value;
    let id1 = "info";
    id1 += id;
    $.post('/reject', { id: id });
    document.getElementById(id).innerHTML = '<img src="style/img/no.png">';
    document.getElementById(id1).innerHTML = 'Мероприятие удалено из базы';
}

function getNew () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getnew', true);

    xhr.onload = function () {
        let mero = JSON.parse(xhr.responseText);
        let qq = '';
        if (mero.data.length == 0){
            qq += '<div><h1>Нет новых мероприятий</h1>';
        }
        for (let i = 0; i < mero.data.length; ++i) {
            let this_id = mero.data[i].id;
            qq += '<div class="mero">';
            qq += '<h3>' + mero.data[i].name + '<span id="' + this_id + '"><span></h3>';
            qq += '<block>';
            qq += '<span id="info' + this_id + '">';
            qq += '<div> Возраст: ' + mero.data[i].age + '</div>';
            qq += '<div> Категория: ' + mero.data[i].type + '</div>';
            qq += '<div> Сложность: ' + mero.data[i].hard + '</div>';
            qq += '<div> Место проведения: ' + mero.data[i].place + '</div>';
            qq += '<div> Описание: ' + mero.data[i].desc + '</div>';
            qq += '<div><a href=' + mero.data[i].link + '>Ссылка</a></div>';
            qq += '<button type="button" onclick="confirm(this)" value="' + this_id + '" class="btn btn-outline-success">Принять</button>';
            qq += '<button type="button" onclick="reject(this)" value="' + this_id + '" class="btn btn-outline-danger">Отклонить</button>';
            qq += '</span></block></div>';
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
    }
    xhr.send()
}

getNew();