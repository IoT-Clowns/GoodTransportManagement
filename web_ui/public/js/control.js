
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


const search_text = document.getElementById("product_searching");
search_text.addEventListener("change", function () {
    var text = search_text.value;
    console.log(text);
    var base_url = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-xtvas/endpoint/web_browser/product_searching";

    if(productChecker.checked == 1) // product searching
    {
        var url = base_url + "?pattern=" + text;
    }
    var xhr = new XMLHttpRequest();
    var dataToSend = {
        from: "web browser"
    };
    var jsonData = JSON.stringify(dataToSend);
    xhr.open("GET", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = 'json';
    xhr.send(jsonData);
    xhr.onload = function() 
    {
        if (xhr.status === 200) 
        {
            var data = xhr.response;
            alert(data);
            console.log(data);
            const element = document.getElementById('search-result');
            element.style.display = 'block'; // Hide the element
        }
    };
})




