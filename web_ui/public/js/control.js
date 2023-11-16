
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
    
    if(productChecker.checked == 1) // product searching
    {
        var base_url = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-xtvas/endpoint/web_browser/product_searching";
        var url = base_url + "?pattern=" + text;
    }
    else if(orderChecker.checked == 1) // order searching
    {
        var base_url = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-xtvas/endpoint/web_browser/order_searching";
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
            const element = document.getElementById('product-search-result');
            const element2 = document.getElementById('order-status'); 
                
            if(productChecker.checked == 1 )
            {
                var data = xhr.response;
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
                    element2.style.display = 'none';   
                }    
            }
            else if(orderChecker.checked == 1)
            {
                var data = xhr.response;
                console.log(data);
                if(data == null)
                {
                    element2.style.display = 'none'; 
                }
                else
                {    
                    if(data["status"] == "pending")
                        goToStep(1);
                    else if(data["status"] == "processing")
                        goToStep(2);
                    else if(data["status"] == "shipping")
                        goToStep(3);
                    else if(data["status"] == "delivered")
                        goToStep(4);
                    else if(data["status"] == "finish")
                        goToStep(5);
                    element2.style.display = 'block';
                    element.style.display = 'none';    
                }    
            }
        }
    };
})
var currentStep;
var progressBarItems = document.querySelectorAll(".progressbar li");

// Hàm để chuyển đến một bước cụ thể
function goToStep(step) {
console.log("Button clicked for step:", step); // Log the click event

// Update the progress bar
for (var i = 0; i < progressBarItems.length; i++) {
  if (i < step - 1) {
    progressBarItems[i].classList.add("complete");
    progressBarItems[i].classList.remove("active");
  } else if (i === step - 1) {
    progressBarItems[i].classList.add("active");
    progressBarItems[i].classList.remove("complete");
  } else {
    progressBarItems[i].classList.remove("active", "complete");
  }
}
currentStep = step;
}





