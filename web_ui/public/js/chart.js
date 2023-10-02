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


// Khởi tạo biểu đồ trống
var ctx = document.getElementById('myChart').getContext('2d');
var hori = document.getElementById('myChart1').getContext('2d');
var pie = document.getElementById('myChart2').getContext('2d');

var myChart = new Chart(ctx, {
    type: 'bar',  // Loại biểu đồ (line, bar, pie, ...)
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

var myChart2 = new Chart(pie, {
    type: 'pie',  // Loại biểu đồ (line, bar, pie, ...)
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

document.getElementById("datepicker").addEventListener("focus", function() {
    var base_url = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-xtvas/endpoint/web_browser/findOne"
    var date = document.getElementById("datepicker").value;
    const dateList = date.split("/");
    var newDate = dateList[1] + "/" + dateList[0] + "/" + dateList[2];
    var xhr = new XMLHttpRequest();
    // Create an object with the data you want to send
    var dataToSend = {
        from: "web browser"
    };
    var url = base_url + "?date=" + newDate;
    var jsonData = JSON.stringify(dataToSend);
    xhr.open("GET", url); // change to POST if you want
    xhr.setRequestHeader("Content-Type", "application/json"); // Specify JSON content type
    xhr.responseType = 'json';
    xhr.send(jsonData);
    xhr.onload = function() {
      if (xhr.status === 200) 
      {
        var data = xhr.response["rainy"];
        if (data) {
            var labels = Object.keys(data); // Lấy danh sách các label
            var values = Object.values(data); // Lấy danh sách các giá trị
            
            // Cập nhật dữ liệu và labels của biểu đồ
            myChart.data.labels = labels;
            myChart.data.datasets[0].data = values;
            
            // Cập nhật biểu đồ
            myChart.update();
        }
        //const response = JSON.stringify(xhr.response);
        //document.getElementById("content").innerHTML = response;
      }
    };
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


//


