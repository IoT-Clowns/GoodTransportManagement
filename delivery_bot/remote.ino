#include <SoftwareSerial.h>

#define bluetoothTx 6  // Chân TX của module Bluetooth kết nối với chân RX của Arduino
#define bluetoothRx 7  // Chân RX của module Bluetooth kết nối với chân TX của Arduino

SoftwareSerial bluetooth(bluetoothTx, bluetoothRx);
SoftwareSerial lora(4, 5);
String u = "u";
String d = "d";
String r = "r";
String l = "l";

void setup() 
{
  Serial.begin(19200);
  bluetooth.begin(19200);
  lora.begin(19200);

  pinMode(A0, INPUT);
  pinMode(A1, INPUT);
}

void loop() 
{
  int xAxis = analogRead(A0);
  int yAxis = analogRead(A1);

  if (yAxis >= 600) 
  {
    bluetooth.print(u);
    Serial.println(u);
    delay(300);
  }
  if (yAxis <= 50) 
  {
    bluetooth.print(d);
    Serial.println(d);
    delay(300);
  }
  if (xAxis >= 600) 
  {
    bluetooth.print(r);
    Serial.println(r);
    delay(300);
  }
  if (xAxis <= 50) 
  {
    bluetooth.print(l);
    Serial.println(l);
    delay(300);
  }
  
  if (bluetooth.available()) 
  {
    String data = bluetooth.readString();
    Serial.println(data);  // In dữ liệu ra Serial (hiển thị trên máy tính)
  }
}