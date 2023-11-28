#include <LiquidCrystal_I2C.h>
#include <TimerOne.h>
#include <Servo.h>
#include <Keypad.h>
#include <Wire.h>
#include <SoftwareSerial.h>

SoftwareSerial lora(8, 9); //TX, RX
char *mail_box = (char *)malloc(1);
uint8_t size = 0;
const byte ROWS = 4; // Number of rows on the keypad
const byte COLS = 4; // Number of columns on the keypad

byte rowPins[ROWS] = {4, 5, 7 }; // Row pins
byte colPins[COLS] = {12, 13, 8}; // Column pins
const char keys[ROWS][COLS] = {
  {'1', '2', '3'},
  {'4', '5', '6'},
  {'7', '8', '9'}
};
Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);
LiquidCrystal_I2C lcd(0x27, 20, 4);
Servo servo1;
Servo servo2;
Servo servo3;
Servo servo4;

int servo1Angle;
int servo2Angle;
int servo3Angle;
int servo4Angle;

int joystickX1;
int joystickY1;
int joystickX2;
int joystickY2;

bool joystick1Pressed = false;
bool joystick2Pressed = false;

bool crane_mode = true;
unsigned long time;

void setup() 
{
  lora.begin(19200);
  lcd.init();
  lcd.backlight();  // turn on light LCD
  lcd.blink();
  //Setup pins connection
  servo1.attach(9);
  servo2.attach(10);
  servo3.attach(11);
  servo4.attach(6);
  //setup initial state
  // Read the joystick values
  joystickX1 = analogRead(A0);
  joystickY1 = analogRead(A1);
  joystickX2 = analogRead(A2);
  joystickY2 = analogRead(A3);

  // Scale the joystick values to the servo range (0-180)
  servo1Angle = map(joystickX1, 0, 1023, 0, 180);
  servo2Angle = map(joystickY1, 0, 1023, 0, 180);
  servo3Angle = map(joystickX2, 0, 1023, 180, 0);
  servo4Angle = map(joystickY2, 0, 1023, 180, 0);
  //lcd display
  lcd.print("Hello from IoTclowns");
  // Timer1.initialize(150000);//Khởi động ngắt, thời gian đặt cho nó là 150000us=0.15s.
  // Timer1.attachInterrupt(timer_ISR); 
}



void crane_control()
{
  /*  RESERVED
  // Check if the joysticks are pressed
  if (digitalRead(2) == HIGH) {
    joystick1Pressed = true;
  } else {
    joystick1Pressed = false;
  }

  if (digitalRead(3) == HIGH) {
    joystick2Pressed = true;
  } else {
    joystick2Pressed = false;
  }
  */
  // Get the signal from joystick
  joystickX1 = analogRead(A0);
  joystickY1 = analogRead(A1);
  joystickX2 = analogRead(A2);
  joystickY2 = analogRead(A3);
  // Convert value
  int servo1move = map(joystickX1, 0, 1023, 0, 180);
  int servo2move = map(joystickY1, 0, 1023, 0, 180);
  int servo3move = map(joystickX2, 0, 1023, 180, 0);
  int servo4move = map(joystickY2, 0, 1023, 180, 0);
  // Check if servo come to the limit range 
  // Then set the servo positions
  
  /*  DEBUG
  lcd.print((String)servo1Angle);
  delay(500);
  lcd.clear();
  */
  
  if((!(servo1Angle <= 0 || servo1Angle >= 180)))
    servo1Angle += (servo1move - 90)/20;
  else
  {
    if(servo1Angle < 0)
      if(((servo1move - 90)/20) > 0)
        servo1Angle += (servo1move - 90)/20;
      else
        servo1Angle = -2;
    else
      if(((servo1move - 90)/20) < 0)
        servo1Angle += (servo1move - 90)/20;
      else
      servo1Angle = 182;
  } 
  if(!(servo2Angle <= 0 || servo2Angle >= 180))
    servo2Angle += (servo2move - 90)/20;
  else
  {
    if(servo2Angle < 0)
      if(((servo2move - 90)/20) > 0)
        servo2Angle += (servo2move - 90)/20;
      else
        servo2Angle = -2;
    else
      if(((servo2move - 90)/20) < 0)
        servo2Angle += (servo2move - 90)/20;
      else
        servo2Angle = 182;
  } 
  if(!(servo3Angle <= 0 || servo3Angle >= 180))
    servo3Angle += (servo3move - 90)/20;
  else
  {
    if(servo3Angle < 0)
      if(((servo3move - 90)/20) > 0)
        servo3Angle += (servo3move - 90)/20;
      else
        servo3Angle = -2;
    else
      if(((servo3move - 90)/20) < 0)
        servo3Angle += (servo3move - 90)/20;
      else
        servo3Angle = 182;
  } 
  if(!(servo4Angle <= 0 || servo4Angle >= 180))
    servo4Angle += (servo4move - 90)/20;
  else
  {
    if(servo4Angle < 0)
      if(((servo4move - 90)/20) > 0)
        servo4Angle += (servo4move - 90)/20;
      else
        servo4Angle = -2;
    else
      if(((servo4move - 90)/20) < 0)
        servo4Angle += (servo4move - 90)/20;
      else
        servo4Angle = 182;
  } 
  delay(50);
  servo1.write(servo1Angle);
  servo2.write(servo2Angle);
  servo3.write(servo3Angle);
  servo4.write(servo4Angle);
}
void keypad_control()
{
  char key = keypad.getKey();
  // If a button is pressed, print the key character to the serial port
  if (key != NO_KEY) 
  {
    switch(key)
    {
      case '1':
        if (crane_mode == true)
        {
          crane_mode = false;
          lcd.clear();
          lcd.print("Mail mode");
        }
        else
        {
          crane_mode = true;
          lcd.clear();
          lcd.print("Crane mode");
        }
        
        break;
      case '2':
        lcd.print("New good taking");
        break;
      case '9':

        lcd.clear();
        break;
    }
  }
}
void mail_control()
{
  lcd.clear();
  for(uint8_t i=0; i <= size; ++i)
    lcd.print(mail_box[i]); 
}
void check_mail()
{
  if(lora.available() > 1)
  {
    unsigned char input = lora.read();
    mail_box = realloc(mail_box, 1);
    mail_box[size] = 0;
    size++;
  }
}
void loop() 
{
  keypad_control();
  check_mail();
  if(crane_mode == true)
    crane_control();
  else
    mail_control();
  lcd.display();
  // Delay for 10ms
  //lcd.clear();
}
