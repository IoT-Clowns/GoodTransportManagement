#include <SoftwareSerial.h>
#include <LiquidCrystal_I2C.h>
#include <wire.h>
SoftwareSerial mySerial(8, 9); // TX, RX

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();  // turn on light LCD
  lcd.blink();
  Serial.begin(19200);
  mySerial.begin(19200);

  lcd.setCursor(0,0);
  lcd.print("Chao moi nguoi");


}

void loop() {
    unsigned int j;
   if (mySerial.available() > 0) {
    String input = mySerial.readString();
    Serial.println(input);
     if (input != "0")
    {
      
      mySerial.println("Received");
      lcd.clear();
      lcd.print("Received");
    }
   
         
  }
}




   



