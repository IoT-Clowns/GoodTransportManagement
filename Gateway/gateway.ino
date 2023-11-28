#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Arduino.h>
#include "time.h"
#include <Keypad.h>
#include <HardwareSerial.h>
#include <LoRa_E32.h>
LoRa_E32 e22ttl(16, 17, &Serial2, 18, UART_BPS_RATE_19200);
// -------------- Key pad pin definition --------------
const byte ROWS = 4;
const byte COLS = 4;
char keys[ROWS][COLS] = {
    {'1', '2', '3', 'A'},
    {'4', '5', '6', 'B'},
    {'7', '8', '9', 'C'},
    {'*', '0', '#', 'D'}
};
uint8_t colPins[COLS] = {27, 13, 23, 4};
uint8_t rowPins[ROWS] = {32, 25, 26, 14};
// -----------------------------------------------------

// ----------------

class OrderManager {
private:
    LiquidCrystal_I2C lcd;
    Keypad keypad;

public:
    OrderManager() : lcd(0x27, 20, 4), keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS) {}

    void setupWiFi() {
        const char *ssid = "Nhattung";
        const char *pass = "12345678910";

        Serial.print("Connecting to Wi-Fi");
        lcd.init();
        lcd.backlight();
        lcd.setCursor(0, 0);
        lcd.print("Connecting wifi ");
        WiFi.begin(ssid, pass);

        while (WiFi.status() != WL_CONNECTED) {
            Serial.print(".");
            delay(300);
        }

        Serial.println();
        Serial.print("Connected with IP: ");
        lcd.setCursor(0, 1);
        lcd.print("WiFi connected ");
        Serial.println(WiFi.localIP());
        Serial.println();

        configTime(0, 0, "pool.ntp.org");
    }

    String getData() {
        HTTPClient http;
        String id = "654dabbd6bd31991867845d2";
        String url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-vqinw/endpoint/MQ?id=" + id;
        http.begin(url);

        String response;

        int httpResponseCode = http.GET();

        if (httpResponseCode == HTTP_CODE_OK) {
            response = http.getString();
            Serial.println("Received data:");
            Serial.println(response);
        } else {
            Serial.print("Error accessing URL. HTTP Response code: ");
            Serial.println(httpResponseCode);
        }

        http.end();

        return response;
    }

    void displayOrderDetails(JsonVariant jsonVariant) {
        // Your order details display code
    }

     void handleKeyPress() {
        char key = keypad.getKey();
        switch (key) {
        case 'B':
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("Get orders first");
            Serial.println("Get first");
            break;
        case 'A':
            Serial.println("get");
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("Getting data");
            String jsonString = getData();
            
            DynamicJsonDocument doc(1024);
            deserializeJson(doc, jsonString);

            JsonArray response = doc.as<JsonArray>();
            Serial.println(response.size());
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print(" Quantity: ");
            lcd.print(response.size());
            lcd.setCursor(0, 1);
        
            JsonVariant jsonVariant;
            int i = 0;

            char key1;
            while ((key1 = keypad.getKey()) != '#') {
                if (key1) {
                    String orderId;
                    switch (key1) {
                    case 'B':
                        if (i < response.size()) {
                            lcd.clear();
                            lcd.setCursor(0, 0);
                            lcd.print("Order 1:");
                            lcd.print(i + 1);
                            lcd.print(":");
                            jsonVariant = response[i]; //goi tin thu i 5 thu: 
                            String jsonString;
                            serializeJsonPretty(jsonVariant, jsonString);
                            Serial.println(jsonString);

                            String objectid = jsonVariant["_id"];// object id
                            String userid = jsonVariant["_userId"];
                            String state = jsonVariant["status"];// pending, done
                            JsonVariant timestamp = jsonVariant["timestamp"];
                            String start = timestamp["_start"];
                            String end1 = timestamp["_end"];
                            
                            
                            JsonArray productArray = jsonVariant["_product"].as<JsonArray>(); // 
                            size_t productArraySize = productArray.size(); // số cặp quantity và product id 
                            Serial.println("Number of elements in _product array: " + String(productArraySize));
                            String order[5+productArraySize*2] = {objectid, userid, state, start,end1};
                            Serial2.println(productArraySize);
                            unsigned int count=5;
                            for (size_t k = 0; k < productArraySize; k++) 
                            {
                              JsonVariant product = productArray[k];
                              String productId = product["_productId"];
                              // Serial2.println(productId);
                              int quantity = product["_quantity"];
                              // Serial2.println(quantity);
                              order[count++]=productId;
                              order[count++]=quantity;

                            }
                            
                           
                            Serial.println(sizeof(order) / sizeof(order[0]));
                            unsigned int j;
                            
                            for (j = 0; j < sizeof(order) / sizeof(order[0]); j++) { // so phan tu goi tin
                                lcd.setCursor(0, j % 4);
                                lcd.print(order[j]);
                                
                                if (j % 4 == 3) {
                                    delay(2000);
                                    lcd.clear();
                                }
                                Serial.println(order[j]);
                                Serial2.println(order[j]);
                            }
                            String a="0";
                            Serial2.println(a);
                            // abc (productArraySize)
                            memset(order, 0, sizeof(order));
                            i++;
                        } else {
                            lcd.clear();
                            lcd.setCursor(0, 0);
                            lcd.print("Chi co ");
                            lcd.print(response.size());
                            lcd.print(" don hang!");
                        }
                         if (e22ttl.available()) {
                            ResponseContainer response = e22ttl.receiveMessage();
                            String message = response.data;
                            Serial.print(message);
                            }
                        break;
                    }
                }
            }
            
            delay(100);
            break;
        }
        delay(100);
    }
};

OrderManager orderManager;

void setup() {
    Serial.begin(19200);
    e22ttl.begin();
    Serial2.begin(19200, SERIAL_8N1, 16, 17);
    orderManager.setupWiFi();
    configTime(0, 0, "pool.ntp.org");
}

void loop() {
    orderManager.handleKeyPress();
    delay(100);
  
}
