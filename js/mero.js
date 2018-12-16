var headers = new Headers();

headers.append('Accept', 'application/json'); // This one is enough for GET requests
headers.append('Content-Type', 'application/json');


// $( ".push").click(function() {
//     var cat_index = document.getElementById("category").options.selectedIndex;
//     var cat_value= document.getElementById("category").options[cat_index].value;
//
//     var age_index = document.getElementById("age").options.selectedIndex;
//     var age_value= document.getElementById("age").options[age_index].value;
//
//     var hard_index = document.getElementById("hardness").options.selectedIndex;
//     var hard_value= document.getElementById("hardness").options[hard_index].value;
//
//     var place_index = document.getElementById("place").options.selectedIndex;
//     var place_value= document.getElementById("place").options[place_index].value;
//
//     window.location.href = `/searchmero?cat=${cat_value}&age=${age_value}&hard=${hard_value}&place=${place_value}`;
// });
