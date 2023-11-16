#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>
const int ledPin = 25;
const char* ssid = "Dinhquang";
const char* password = "12345678";
const char* url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-vqinw/endpoint/MQ?id=65068bd144ee34b32c85f568"; // URL để nhận dữ liệu
Servo myservo;
 int a = 0;

int pos = 0; 
void setup() {
  Serial.begin(115200);
  myservo.attach(13);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Nhận dữ liệu
  receiveData();
}

void loop() {
  // Không cần gì trong hàm loop
  receiveData();
  delay(200);
}

void receiveData() {
  HTTPClient http;

  // Tạo URL để gửi yêu cầu GET
  http.begin(url);

  // Gửi yêu cầu GET và đợi phản hồi
  int httpResponseCode = http.GET();
  
  DynamicJsonDocument doc(1024);

  if (httpResponseCode == HTTP_CODE_OK) {
    // Đọc dữ liệu từ phản hồi
    String response = http.getString();

    // Xử lý dữ liệu nhận được
    Serial.println("Received data:");
    Serial.println(response);
    
    DeserializationError error = deserializeJson(doc, response);
  

if (!error) {
  const char* concacValue = doc["concac"];
  Serial.println(a);

  // Kiểm tra nếu giá trị là "1"
  if (strcmp(concacValue, "1") == 0 && a == 0) {
    // Bật chân số 25
    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, HIGH);
    Serial.println("LED is ON");
    a = 1;
    // Rotate servo motor to 180 degrees
    for (pos = 0; pos <= 180; pos += 1) {
      // Thực hiện quay từ 0 đến 180 độ
      myservo.write(pos);
      delay(15);
    }
  } else if (strcmp(concacValue, "0") == 0 && a == 1) {
    // Kiểm tra nếu giá trị là "0"
    Serial.println("LED is OFF");
    digitalWrite(ledPin, LOW);
    a = 0;
    // Rotate servo motor to 0 degrees
    for (pos = 180; pos >= 0; pos -= 1) {
      // Thực hiện quay từ 180 đến 0 độ
      myservo.write(pos);
      delay(15);
    }
  }

    } else {
      Serial.println("JSON parsing failed");
    }
  } else {
    Serial.print("Error accessing URL. HTTP Response code: ");
    Serial.println(httpResponseCode);
  }

  // Giải phóng kết nối
  http.end();
}