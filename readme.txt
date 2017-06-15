ajax 404:
http://stackoverflow.com/questions/30048453/phonegap-cordova-ajax-requests-404-not-found-error
cordova plugin add cordova-plugin-whitelist (lehet hogy elõtte remove kell)
*************
bluetooth:
cordova plugin add com.megster.cordova.bluetoothserial
további bt eszközökhöz duplikálni kell a plugint:
https://github.com/don/BluetoothSerial/issues/58
1) I have two versions of the plugin in my plugin folder - com.megster.cordova.bluetoothserial & com.megster.cordova.bluetoothserial2.

2) File name changes in com.megster.cordova.bluetoothserial2:

BluetoothSerial.java -> BluetoothSerial2.java
BluetoothSerialService.java -> BluetoothSerialService2.java
bluetoothSerial.js - > bluetoothSerial2.js
3) Code changes in com.megster.cordova.bluetoothserial2:

bluetoothSerial2.js -> all references to BluetoothSerial modified to BluetoothSerial2
plugin.xml -> all references to BluetoothSerial modified to BluetoothSerial2, all references to BluetoothSerialService modified to BluetoothSerialService2,
fetch.json -> all references to BluetoothSerial modified to BluetoothSerial2

utána
cordova platform remove android
cordova platform add android

platforms/android/project.properties-ben 
target=android-21
utána build
majd
target=android-19
ismét build
************


nem csatlakozik a webservicehez:
index.html
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://192.168.1.105 http://192.168.22.171 http://redmine.akh.hu http://192.168.22.144;media-src *"></meta>

service.php-ban kikommentezni:
header('Access-Control-Allow-Origin: *');  