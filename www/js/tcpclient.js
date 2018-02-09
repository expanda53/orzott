var tcpClient = {
    send: function(ip,port,dataString,cbOk){
        dataString+="\r\n";
        //if (teszt) alert('ip:'+ip+' port:'+port);
        var tsocket = new Socket();
        tsocket.open(
          ip,
          port,
          function() {
            // invoked after successful opening of socket
                var data = new Uint8Array(dataString.length);
                for (var i = 0; i < data.length; i++) {
                  data[i] = dataString.charCodeAt(i);
                }
                tsocket.write(data,
                    function(){/*showMessage("Nyomtatási parancs elküldve.");*/cbOk()},
                    function(errorMessage){showMessage(errorMessage)}
                );        
                tsocket.shutdownWrite();         
                tsocket.close();
                
              
          },
          function(errorMessage) {
            // invoked after unsuccessful opening of socket
              showMessage("error connecting " + ip + ":" + port+";"+errorMessage);
          }); 
          
        tsocket.onData = function(data) {
          // invoked after new batch of data is received (typed array of bytes Uint8Array)
        };
        tsocket.onError = function(errorMessage) {
          // invoked after error occurs during connection
            showMessage(errorMessage);
        };
        tsocket.onClose = function(hasError) {
          // invoked after connection close
        };          
    }
}