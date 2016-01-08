ajax 404:
http://stackoverflow.com/questions/30048453/phonegap-cordova-ajax-requests-404-not-found-error
cordova plugin add cordova-plugin-whitelist (lehet hogy elõtte remove kell)

bluetooth:
cordova plugin add com.megster.cordova.bluetoothserial


nem csatlakozik a webservicehez:
index.html
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://192.168.1.105 http://192.168.22.171 http://redmine.akh.hu http://192.168.22.144;media-src *"></meta>