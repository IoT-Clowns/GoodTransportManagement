
// document.getElementById('myToggle1').onclick = function() {
//     var checkbox = document.getElementById('myToggle1');
//     var dienthoaiValue = checkbox.checked ? 1 : 0;

//     firebase.database().ref("/thiet-bi-1").set({ dienthoai: dienthoaiValue });
// };
// document.getElementById('myToggle2').onclick = function() {
//     var checkbox = document.getElementById('myToggle2');
//     var dienthoaiValue = checkbox.checked ? 1 : 0;

//     firebase.database().ref("/thiet-bi-2").set({ dienthoai: dienthoaiValue });
// };
// document.getElementById('myToggle3').onclick = function() {
//     var checkbox = document.getElementById('myToggle3');
//     var dienthoaiValue = checkbox.checked ? 1 : 0;

//     firebase.database().ref("/thiet-bi-3").set({ dienthoai: dienthoaiValue });
// };



const productChecker = document.getElementById("myToggle1");

productChecker.addEventListener("change", function () {
    
    var checkbox = document.getElementById('myToggle1');
    if (checkbox.checked ? 1 :0)
    {
        orderChecker.checked = 0; // Turn off order checker
    }
})
const orderChecker = document.getElementById("myToggle2");

orderChecker.addEventListener("change", function () {
    var checkbox = document.getElementById('myToggle2');
    if (checkbox.checked ? 1 :0)
    {
        productChecker.checked = 0; // Turn off product checker
    }
})


