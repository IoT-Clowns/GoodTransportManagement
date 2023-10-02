
document.getElementById('myToggle1').onclick = function() {
    var checkbox = document.getElementById('myToggle1');
    var dienthoaiValue = checkbox.checked ? 1 : 0;

    firebase.database().ref("/thiet-bi-1").set({ dienthoai: dienthoaiValue });
};
document.getElementById('myToggle2').onclick = function() {
    var checkbox = document.getElementById('myToggle2');
    var dienthoaiValue = checkbox.checked ? 1 : 0;

    firebase.database().ref("/thiet-bi-2").set({ dienthoai: dienthoaiValue });
};
document.getElementById('myToggle3').onclick = function() {
    var checkbox = document.getElementById('myToggle3');
    var dienthoaiValue = checkbox.checked ? 1 : 0;

    firebase.database().ref("/thiet-bi-3").set({ dienthoai: dienthoaiValue });
};
