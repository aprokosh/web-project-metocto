var data;
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost:8080/files/lot1.json', true);

xhr.onload = function(){
    data = JSON.parse(xhr.responseText);
    document.getElementById("lotName").innerHTML = data.lotName;
    document.getElementById("lotDescription").innerHTML = data.lotDescription;
    document.getElementById("price").innerHTML = data.startingPrice;
    document.getElementById("timer").innerHTML = "00:" + data.timeSeconds;
    document.getElementById("picture").innerHTML = "<img src=\"" + data.picture + "\" alt='" +data.lotName + "'>";

};
xhr.send();

//Pusher.com
Pusher.logToConsole = true;

var pusher = new Pusher('38ecf7a6ace49c5cc386', {
    cluster: 'eu',
    forceTLS: true
});

var channel = pusher.subscribe('my-channel');
channel.bind('my-event', function(data) {
    alert(JSON.stringify(data));
});
//end pusher.com


const btn1 = document.getElementById("button1");
const btn2 = document.getElementById("button2");

btn1.onclick = function increaseRate(){
    //alert("Button 1 pressed");
    let score = document.getElementById("price").innerHTML;
    score++;
    document.getElementById("price").innerHTML = score;
}

Rx.Observable.fromEvent(btn2, 'click').subscribe(() => {//alert("Button 2 pressed");
    let score = document.getElementById("price").innerHTML;
    score++;
    document.getElementById("price").innerHTML = score;});



startTimer();

function startTimer(){
    let currentTimer = document.getElementById("timer").innerHTML;
    let arr = currentTimer.split(':');
    let minutes = arr[0];
    let seconds = arr[1];
    if(minutes == 0 && seconds == 0){
        alert('Time is up');
        document.getElementById("button1").disabled = true;
        document.getElementById("button2").disabled = true;

        return;
    }
    document.getElementById("timer").innerHTML = formatTime(minutes) + ":" + formatTime(seconds-1);
    setTimeout(startTimer, 1000);
}

function formatTime(time){
    time = Number.parseInt(time);
    if(time < 10) return "0" + time;
    else return time;
}
/*
const rxSeconds = 15;
Rx.Observable
	.timer(100, 1000)
  .map(i => rxSeconds - i)
  .take(rxSeconds + 1)
  .subscribe(i => document.getElementById("RxTimer").innerHTML = formatTime(i));
*/
$.getJSON('http://query.yahooapis.com/v1/public/yql?q=select%20%2a%20from%20yahoo.finance.quotes%20WHERE%20symbol%3D%27WRC%27&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback', function(data) {

});