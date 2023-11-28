  #include <WiFi.h>
  #include <DHT.h>
  #include <HTTPClient.h>
  #include <ArduinoJson.h>


  #include "time.h"

  #define DHTPIN 23
  #define SOILPIN 32
  #define LDRPIN 33
  #define LEDGREENPIN 15
  #define LEDREDPIN 16
  #define SOILPOWER 4

  DHT dht(DHTPIN, DHT11);

  unsigned long epochTime; 
  unsigned long dataMillis = 0;

  WiFiClient client;
  HTTPClient http;
  const char *ssid = "Dinhquang";
  const char *pass = "12345678";
  const char * ntpServer = "pool.ntp.org";
  const char* serverName = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-vqinw/endpoint/sensor";

  StaticJsonDocument<500> doc;

  void setup()
  {
      Serial.begin(115200);
      dht.begin();
      pinMode(LEDGREENPIN, OUTPUT);
      pinMode(LEDREDPIN, OUTPUT);
      pinMode(SOILPOWER, OUTPUT);

      digitalWrite(LEDGREENPIN, LOW);
      digitalWrite(LEDREDPIN, LOW);
      digitalWrite(SOILPOWER, LOW);

      WiFi.begin(ssid, pass);
      Serial.print("Connecting to Wi-Fi");
      while (WiFi.status() != WL_CONNECTED)
      {
          Serial.print(".");
          delay(300);
      }
      Serial.println();
      Serial.print("Connected with IP: ");
      Serial.println(WiFi.localIP());
      Serial.println();

      configTime(0, 0, ntpServer);
  }

  void loop()
  {

    if (millis() - dataMillis > 15000 || dataMillis == 0)
    {
        dataMillis = millis();

        epochTime = getTime();
        Serial.print("Epoch Time: ");
        Serial.println(epochTime);

        float temperature = dht.readTemperature();
        float humidity = dht.readHumidity();

        digitalWrite(SOILPOWER, HIGH);
        delay(10);
        float moisture = analogRead(SOILPIN);
        float moisturePercent = 100.00 - ( (moisture / 4095.00) * 100.00 );
        digitalWrite(SOILPOWER, LOW);

        float ldr = analogRead(LDRPIN);
        float ldrPercent = (ldr / 4095.00) * 100.00;

        Serial.print("Temperature: ");
        Serial.print(String(temperature));
        Serial.print(" C\nHumidity: ");
        Serial.print(String(humidity));
        Serial.print("\nMoisture: ");
        Serial.print(String(moisturePercent));
        Serial.print(" %");
        Serial.print("\nLight: ");
        Serial.print(String(ldrPercent));
        Serial.print(" %");
        Serial.println("\n");

        doc["sensors"]["temperature"] = "80*C";
  doc["sensors"]["humidity"] = "30%";
  doc["sensors"]["moisture"] = moisturePercent;
  doc["sensors"]["light"] = ldrPercent;
  doc["sensors"]["timestamp"] = epochTime;

        Serial.println("Uploading data... "); 
        POSTData();
    //    getData();
    }
  }

  // Function that gets current epoch time
  unsigned long getTime() {
    time_t now;
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) {
      return(0);
    }
    time(&now);
    return now;
    
  }

  void POSTData()
  {
      if(WiFi.status()== WL_CONNECTED){
        HTTPClient http;

        http.begin(serverName);
      http.addHeader("Content-Type", "application/json");
        http.addHeader("Accept", "application/json");
     // http.GET();
        http.addHeader("X-Forwarded-Proto", "http");
        http.addHeader("apiKey", "Mk3zDQj9hna4tDj7ykSgaKWMv7h34ik3mc6smpYTQYK7c4WTV9lIBOhPjvmeL5PM");

        String json;
    
        serializeJson(doc, json);
      
        Serial.println(json);
        int httpResponseCode = http.POST( json);
        Serial.println(httpResponseCode);
        int receive = http.GET();
        if (httpResponseCode == 200) {
          Serial.println("Data uploaded.");
          digitalWrite(LEDGREENPIN, HIGH);
          delay(200);
          String a = http.getString();
          Serial.println("Data from MongoDB:");
          
        Serial.println(a);
          Serial.println(receive);
          digitalWrite(LEDGREENPIN, LOW);
        } else {
          Serial.println("ERROR: Couldn't upload data.");
          digitalWrite(LEDREDPIN, HIGH);
          delay(200);
          digitalWrite(LEDREDPIN, LOW);
        

        }
          String payload = http.getString();
    DynamicJsonDocument description(32687);
    DeserializationError error = deserializeJson(description, payload);
    if (error) {
        Serial.println(error.f_str());
      
        return;
    }

      }
  }
  void getData() {
  
    HTTPClient http;
    http.begin("https://us-east-1.aws.data.mongodb-api.com/app/application-0-MQvqinw/endpoint/");
    http.addHeader("Content-Type", "application/json");
       http.addHeader("Accept", "application/json");
    
       http.addHeader("X-Forwarded-Proto", "http");
    //    http.addHeader("apiKey", "Mk3zDQj9hna4tDj7ykSgaKWMv7h34ik3mc6smpYTQYK7c4WTV9lIBOhPjvmeL5PM");
         http.addHeader("id","65068bd144ee34b32c85f568");

    
        String payload = http.getString();
    DynamicJsonDocument description(32687);
    DeserializationError error = deserializeJson(description, payload);
    if (error) {
        Serial.println(error.f_str());
      
        return;
    }
    http.end();
  }