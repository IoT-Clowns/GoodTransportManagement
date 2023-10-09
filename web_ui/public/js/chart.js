// Empty chart initialization
var ctx = document.getElementById('myChart').getContext('2d');
var hori = document.getElementById('myChart1').getContext('2d');
var pie = document.getElementById('myChart2').getContext('2d');

// Barchart construction
var myChart = new Chart(ctx, {
    type: 'bar',  // Loại biểu đồ (line, bar, pie, ...)
    data: {
        labels: [],  // Labels cho các điểm dữ liệu
        datasets: [{
            label: 'Order quantity per product',
            data: [],  // Dữ liệu của biểu đồ
            fill: false,  // Tắt fill màu giữa các điểm
            borderWidth: 1,  // Độ rộng viền đường
            backgroundColor: ['#eae7d6','#a4d3c2',"#5d7b6f","#d7f9fa","#b0d4b8"]
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
// Scatterchart construction
var myChart1 = new Chart(hori, {
    type: 'scatter',  // Loại biểu đồ (line, bar, pie, ...)
    data: {
        labels: [],  // Labels cho các điểm dữ liệu
        datasets: [{
            label: 'Rainfall (in millimetre)',
            data: [],  // Dữ liệu của biểu đồ
            fill: false,  // Tắt fill màu giữa các điểm
            borderWidth: 1,  // Độ rộng viền đường
            backgroundColor: ['#eae7d6','#a4d3c2',"#5d7b6f","#d7f9fa","#b0d4b8"]
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
// Piechart construction
var myChart2 = new Chart(pie, {
    type: 'pie',  // Loại biểu đồ (line, bar, pie, ...)
    data: {
        labels: [],  // Labels cho các điểm dữ liệu
        datasets: [{
            label: 'Relative of product quantity between stations',
            data: [],  // Dữ liệu của biểu đồ
            fill: false,  // Tắt fill màu giữa các điểm
            borderWidth: 1,  // Độ rộng viền đường
            backgroundColor: ['#eae7d6','#a4d3c2',"#5d7b6f","#d7f9fa","#b0d4b8"]
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

document.getElementById("datepicker").addEventListener("focus", function() {
    var date = document.getElementById("datepicker").value;
    fetchData(date, "bar");
    fetchData(date, "pie");
    fetchData(date, "scatter");
});

function fetchData(date, chartType) {
    const dateList = date.split("/");
    var newDate = dateList[1] + "/" + dateList[0] + "/" + dateList[2];
    var chartConfig = {};
    var base_url = "";
    
    switch (chartType) {
        case "bar":
            base_url = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-xtvas/endpoint/web_browser/barChart";
            chartConfig = myChart;
            break;
        case "pie":
            base_url = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-xtvas/endpoint/web_browser/pieChart";
            chartConfig = myChart2;
            break;
        case "scatter":
            base_url = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-xtvas/endpoint/web_browser/scatterChart";
            chartConfig = myChart1;
            break;
        default:
            return; // Invalid chart type
    }

    var xhr = new XMLHttpRequest();
    var dataToSend = {
        from: "web browser"
    };
    var url = base_url + "?date=" + newDate;
    var jsonData = JSON.stringify(dataToSend);
    xhr.open("GET", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = 'json';
    xhr.send(jsonData);

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                if(chartType === "bar") 
                    var data = xhr.response[0]["products"];
                else
                    var data = xhr.response;
                var labels = Object.keys(data);
                var values = Object.values(data).map(item => {
                    if (chartType === "pie") {
                        return item.totalProducts;
                    } else if (chartType === "scatter") {
                        return item.totalMinutes;
                    } else {
                        return item._quantity;
                    }
                })
                
                chartConfig.data.labels = labels;
                chartConfig.data.datasets[0].data = values;
                chartConfig.update();
            } catch {
                chartConfig.data.labels = [0];
                chartConfig.data.datasets[0].data = [0];
                chartConfig.update();
            }
        }
    };
}

/*
const firebaseConfig = {
  apiKey: "AIzaSyCE6qI-TG65bYmBhj7gNTKbby1EKKKPH6U",
  authDomain: "temperature-12-9.firebaseapp.com",
  databaseURL: "https://temperature-12-9-default-rtdb.firebaseio.com",
  projectId: "temperature-12-9",
  storageBucket: "temperature-12-9.appspot.com",
  messagingSenderId: "1036130638941",
  appId: "1:1036130638941:web:6510f64e9def89fe2d41b4",
  measurementId: "G-MSE8SLN2QG"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Lắng nghe dữ liệu từ Firebase và cập nhật biểu đồ
var dbRef = firebase.database().ref("luong_mua"); // Thay đổi "data" thành đường dẫn Firebase của bạn
dbRef.on("value", function(snapshot) {
    var data = snapshot.val();
    
    // Lấy dữ liệu từ Firebase và cập nhật biểu đồ
    console.log(data)
    if (data) {
        var labels = Object.keys(data); // Lấy danh sách các label
        var values = Object.values(data); // Lấy danh sách các giá trị
        
        // Cập nhật dữ liệu và labels của biểu đồ
        myChart.data.labels = labels;
        myChart.data.datasets[0].data = values;
        
        // Cập nhật biểu đồ
        myChart.update();
    }
});
var dbRef1 = firebase.database().ref("nhiet-do"); // Thay đổi "data" thành đường dẫn Firebase của bạn
dbRef1.on("value", function(snapshot) {
    var data = snapshot.val();
    
    // Lấy dữ liệu từ Firebase và cập nhật biểu đồ
    if (data) {
        var labels = Object.keys(data); // Lấy danh sách các label
        var values = Object.values(data); // Lấy danh sách các giá trị
        
        // Cập nhật dữ liệu và labels của biểu đồ
        myChart1.data.labels = labels;
        myChart1.data.datasets[0].data = values;
        
        // Cập nhật biểu đồ
        myChart1.update();
    }
});

var dbRef2 = firebase.database().ref("do-am"); // Thay đổi "data" thành đường dẫn Firebase của bạn
dbRef2.on("value", function(snapshot) {
    var data = snapshot.val();
    
    // Lấy dữ liệu từ Firebase và cập nhật biểu đồ
    if (data) {
        var labels = Object.keys(data); // Lấy danh sách các label
        var values = Object.values(data); // Lấy danh sách các giá trị
        
        // Cập nhật dữ liệu và labels của biểu đồ
        myChart2.data.labels = labels;
        myChart2.data.datasets[0].data = values;
        
        // Cập nhật biểu đồ
        myChart2.update();
    }
});
*/


