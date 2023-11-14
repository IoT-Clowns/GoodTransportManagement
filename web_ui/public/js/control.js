
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
            const element = document.getElementById('product-search-result');
            if(data == null)
            {
                element.style.display = 'none';
            }
            else
            {
                console.log(data);
                document.getElementById("product-name").textContent = "Product Name: " + data[0]["_name"];
                document.getElementById("product-id").textContent = "Product Id: " + data[0]["_id"];
                document.getElementById("product-type").textContent = "Product type: " + data[0]["_type"];
                document.getElementById("product-description").textContent = "Description: " + data[0]["_description"];
                document.getElementById("avail-station").textContent = "";
                for (const station of data[0]["avail_station"]) 
                {
                    document.getElementById("avail-station").textContent += `Station: ${station._station} Quantity: ${station._quantity} ____  `  ;
                }

                element.style.display = 'block';    
            }
        }
    };
})




