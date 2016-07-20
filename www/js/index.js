/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 console.log('orzott start');
 console.debug('orzott debug');

showMessage =function (msg, clearObj,timeout ){
    timeout = typeof timeout !== 'undefined' ? timeout : 3; //default paramétert csak igy eszi meg.
	$('#dmsg .msgtxt').html(msg);
	$('#dmsg').show();
    if (timeout>0) {
        window.setTimeout(function(){
            messageHide();
            if (clearObj!='') {
                $('#'+clearObj).val('');
            }
        },timeout*1000);
    }
}
messageHide = function(){
    $('#dmsg').hide();
}

function printer (pid,pname) {
	this.id =pid;
	this.name = pname;
	}
function depthMeter (pid,pname) {
	this.id =pid;
	this.name = pname;
	}
var app = {
	printerId:"",
	printerName:"",
	printerConnected:false,
	printers : [],

	depthMeterId:"",
	depthMeterName:"",
	depthMeterConnected:false,
	depthMeters : [],
	depthMeterData:"",
	
	currentModule:"",
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        showLogin();
        console.log('Received Event: ' + id);
		
    },
	onBackKeyDown:function() {
    },	
	/* bt */
	getPrinters:function(){
        //alert('getprinters');
		if(typeof bluetoothSerial != 'undefined'){ 
				bluetoothSerial.list(function(devices) {
					app.printers.length=0;
					devices.forEach(function(device) {
						//alert(device.class);
						if (device.class=='1664') {//7936 melysegmero, 1664 nyomtato
							p = new printer(device.id,device.name); 
							app.printers.push(p);
							//app.printerId = device.id;app.printerName=device.name;app.manageConnection(true)
						}
					})
					printerDialog.show();
				})
				
			
		}
		else {
			showMessage('bt serial undefined');
			printerDialog.show();
		}	
		
	},
	getDepthMeters:function(){
        //alert('getmeters');
		if(typeof bluetoothSerial2 != 'undefined'){ 
                if ($('#btimg')) {
                    $("#btimg").attr("src","img/bluetooth.png");
                }

				bluetoothSerial2.list(function(devices) {
					app.depthMeters.length=0;
					devices.forEach(function(device) {
						//alert(device.class);
						if (device.class=='7936') {//7936 melysegmero, 1664 nyomtato
							p = new depthMeter(device.id,device.name); 
							app.depthMeters.push(p);
							//app.printerId = device.id;app.printerName=device.name;app.manageConnection(true)
						}
					})
					depthMeterDialog.show();
				})
				
			
		}
		else {
			showMessage('bt2 serial undefined');
			depthMeterDialog.show();
		}	
		
	},	
	BTEnabled:function(delayedFunc){
        //alert('printer btenabled');
		if(typeof bluetoothSerial != 'undefined'){ 
            //alert('btenabled start');
			var btAssign = function() {
				app.manageConnection(true,delayedFunc);
			}
			bluetoothSerial.isEnabled(
				btAssign,
				function(){showMessage('bluetooth to printer not enabled')}
			); 

		}
		else {
			showMessage('bt serial undefined');
		}
	},
	BT2Enabled:function(delayedFunc){
        //alert('meter btenabled 1');	
		if(typeof bluetoothSerial2 != 'undefined'){ 
			var btAssign = function() {
                //alert('meter btenabled 3');	
				app.manageConnection2(true,delayedFunc);
			}
            //alert('meter btenabled 2');	
			bluetoothSerial2.isEnabled(
				btAssign,
				function(){showMessage('bluetooth to depthmeter not enabled')}
			); 

		}
		else {
			showMessage('bt2 serial undefined');
		}
	},
	BTDisabled:function(){
		app.manageConnection(false,null);
	},
	BT2Disabled:function(){
		app.manageConnection2(false,null);
	},
	
   manageConnection: function(needConnect,delayedFunc) {
	    /* printer */
        //alert('printer managecon');
		if(typeof bluetoothSerial != 'undefined') {
			// connect() will get called only if isConnected() (below)
			// returns failure. In other words, if not connected, then connect:
            //alert('manageConnection start');
			var connect = function () {
				// attempt to connect:
				//alert("attempt to connect printer");
				bluetoothSerial.connect(
					app.printerId,  // device to connect to
					app.openPort(delayedFunc),    // start listening if you succeed
					app.showErrorPrinter    // show the error if you fail
				);
				
			};

			// disconnect() 
			var disconnect = function () {
				bluetoothSerial.disconnect(
					app.closePort,     // stop listening to the port
					app.showErrorPrinter      // show the error if you fail
				);
			};

			// here's the real action of the manageConnection function:
			if (needConnect) bluetoothSerial.isConnected(null, connect);
			else bluetoothSerial.isConnected(disconnect,null);
		}
    },
   manageConnection2: function(needConnect,delayedFunc) {
	   /* depthmeter */
       //alert('meter managecon 1');
	   try {
		if(typeof bluetoothSerial2 != 'undefined') {
			// connect() will get called only if isConnected() (below)
			// returns failure. In other words, if not connected, then connect:
			var connect = function () {
				// attempt to connect:
                //alert('meter managecon 3');
				bluetoothSerial2.connect(
					app.depthMeterId,  // device to connect to
					app.openPort2(delayedFunc),    // start listening if you succeed
					app.showErrorDepthMeter    // show the error if you fail
				);
				
			};

			// disconnect() 
			var disconnect = function () {
				bluetoothSerial2.disconnect(
					app.closePort2,     // stop listening to the port
					app.showErrorDepthMeter      // show the error if you fail
				);
				
				
			};
            //alert('meter managecon 2');
            //alert(needConnect);
			// here's the real action of the manageConnection function:
			if (needConnect) bluetoothSerial2.isConnected(delayedFunc, connect);
			else bluetoothSerial2.isConnected(disconnect,null);
		}
	   }
	   finally {
		   
	   }
    },
/*
    subscribes to a Bluetooth serial listener for newline
    and changes the button:
*/
    openPort: function(delayedFunc) {
        //alert('printer openport');
        var pconnected = function(){
            //alert('connected');
            app.printerConnected=true;
            //alert('printer connected');
            app.btRefresh();
            //messageHide();
        }
        var pnotconnected = function(){
            app.printerConnected=false;
            //alert('printer not connected');
            app.btRefresh();
            //messageHide();
        }        
        // if you get a good Bluetooth serial connection:
        console.log("Connected to: " + app.printerId);
        //alert('openport start');
		
        // set up a listener to listen for newlines
        // and display any new data that's come in since
        // the last newline:
        bluetoothSerial.subscribe('\n', function (data) {
			console.log(data);
			//alert('subscribe ok:'+data);
			//alert(data);
        });
        
        showMessage('Nyomtató csatlakoztatás...','',0);
        bluetoothSerial.isConnected(pconnected,pnotconnected);
        if (delayedFunc!=null) {
            window.setTimeout(
                function() {bluetoothSerial.isConnected(delayedFunc,null)}
                ,5000
            );            
        }
    },
    openPort2: function(delayedFunc) {
        //alert('meter openport 1');
        // if you get a good Bluetooth serial connection:
        console.log("Connected to: " + app.depthMeterId);
        var dconnected = function(){
            
            app.depthMeterConnected=true;
            app.btRefresh();
        }
        var dnotconnected = function(){
            app.depthMeterConnected=false;
            //alert('printer not connected');
            app.btRefresh();
        }        
		
        // set up a listener to listen for newlines
        // and display any new data that's come in since
        // the last newline:
        
        bluetoothSerial2.subscribe('\n', app.onData);
        //alert('meter openport 2');
        showMessage('Mélységmérõ csatlakoztatás...','',0);
        bluetoothSerial2.isConnected(dconnected,dnotconnected);
        if (delayedFunc!=null) {
            window.setTimeout(
                function() {bluetoothSerial2.isConnected(delayedFunc,null)}
                ,5000
            );            
        }		
    },
	onData: function(data) {
            console.log(data);
			app.depthMeterData=data;
			app.depthMeterData = Math.round(app.depthMeterData.replace('T',''));
			if (app.currentModule=='beerk' || app.currentModule=='elrak') {
				if ( $('#gstat').is(":visible") ){
					$('#gstat').val(app.depthMeterData);				
					$('#gstat').trigger('change');
				}
			}
			else showMessage(data);
	},

/*
    unsubscribes from any Bluetooth serial listener and changes the button:
*/
    closePort: function() {
		/* printer */
        // if you get a good Bluetooth serial connection:
        // unsubscribe from listening:
		app.printerConnected=false;
        bluetoothSerial.unsubscribe(
                function (data) {
                    //alert(data);
					console.log(data);
                },
                app.showErrorPrinter
        );
    },
    closePort2: function() {
		/* depthMeter */
        // if you get a good Bluetooth serial connection:
        // unsubscribe from listening:
		app.depthMeterConnected=false;
        bluetoothSerial2.unsubscribe(
                function (data) {
                    //alert(data);
					console.log(data);
                },
                app.showErrorDepthMeter
        );
    },
/*
    appends @error to the message div:
*/
    showErrorPrinter: function(error) {
        messageHide();
		showMessage('Nyomtató csatlakoztatás nem sikerült. '+error);
        console.log("printer bluetooth error:"+error);
        $('#btNext').removeAttr('disabled');
        $('#tableprinter').removeAttr('disabled');
        
		this.printerConnected = false;
        if ($('#btimg')) {
            $("#btimg").attr("src","img/bluetooth-red.png");
        }
        //alert("bluetooth error:"+error);
    },
    showErrorDepthMeter: function(error) {
        messageHide();
        showMessage('Mélységmérõ csatlakoztatás nem sikerült.'+error);
        $('#btNext').removeAttr('disabled');
        $('#tableprinter').removeAttr('disabled');

        if ($('#btimg')) {
            $("#btimg").attr("src","img/bluetooth-red.png");
        }
		console.log("depthmeter bluetooth error:"+error);
		this.depthMeterConnected = false;
        //alert("bluetooth error:"+error);
    },
    btRefresh: function(){
        //alert('btrefresh');


                if ($("#btimg")) $("#btimg").attr("src","img/bluetooth.png");        
                var dmnotconnected = function(){
                    if ($("#btimg")) $("#btimg").attr("src","img/bluetooth-red.png");
                    app.depthMeterConnected=false;
                }
                var pnotconnected = function(){
                    if ($("#btimg")) $("#btimg").attr("src","img/bluetooth-red.png");
                    app.printerConnected=false;
                }
                var dmconnected = function(){
                    app.depthMeterConnected=true;
                }
                var pconnected = function(){
                    app.printerConnected=true;
                }
                           
                if(typeof bluetoothSerial2 != 'undefined'){ 
                    bluetoothSerial2.isConnected(dmconnected, dmnotconnected);
                }
                if(typeof bluetoothSerial != 'undefined'){ 
                    bluetoothSerial.isConnected(pconnected, pnotconnected);
                }    
                else pnotconnected();    

        
    }
	
	
	/* bt eddig*/
};
if(!window.cordova){
	//alert('cordova not found');
} 
else {
	//alert('cordova ok');
}
app.initialize();


