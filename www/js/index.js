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
serverLog= function (log){
   ajaxCall('log',{'log':log},true, '');
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
    version:"v1.180209",
    printerType:"tcp",
	printerId:"",
	printerName:"",
	printerConnected:false,
    printerTplPrefix:"none",
	printers : [],

	depthMeterId:"",
	depthMeterName:"",
	depthMeterConnected:false,
	depthMeters : [],
	depthMeterData:"",
	
	currentModule:"",
    tcpServerIP:"192.168.1.105",
    tcpServerPort:"9099",
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
        /* login view */
            serverLog('received event : '+id);
        showLogin();
        //console.log('Received Event: ' + id);
		
    },
	onBackKeyDown:function() {
    },	
	/* bt */
	getPrinters:function(){
		if(typeof bluetoothSerial != 'undefined'){ 
				bluetoothSerial.list(function(devices) {
					app.printers.length=0;
					devices.forEach(function(device) {
						 // alert(JSON.stringify(device));
						if (device.class=='1664') {//7936 melysegmero, 1664 nyomtato
							p = new printer(device.id,device.name); 
							app.printers.push(p);
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
		if(typeof bluetoothSerial != 'undefined'){ 
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
		if(typeof bluetoothSerial2 != 'undefined'){ 
			var btAssign = function() {
				app.manageConnection2(true,delayedFunc);
			}
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
		if(typeof bluetoothSerial != 'undefined') {
			var connect = function () {
                showMessage('BT nyomtató csatlakoztatás...','',0);
                app.printerType="bt";
                d=[app.printerId,'abcd'];
				bluetoothSerial.connect(
                app.printerId,  // device to connect to, read printer display
					function(sett){app.openPort(sett,delayedFunc)},    // start listening if you succeed
					app.showErrorPrinter    // show the error if you fail
				);
			};

			var disconnect = function () {
				bluetoothSerial.disconnect(
					app.closePort,     // stop listening to the port
					app.showErrorPrinter      // show the error if you fail
				);
			};

			if (needConnect) bluetoothSerial.isConnected(null, connect);
			else bluetoothSerial.isConnected(disconnect,null);
		}
    },
   manageConnection2: function(needConnect,delayedFunc) {
	   /* depthmeter */
	   try {
            if(typeof bluetoothSerial2 != 'undefined') {
                var connect = function () {
                    bluetoothSerial2.connect(
                        app.depthMeterId,  // device to connect to
                        app.openPort2(delayedFunc),    // start listening if you succeed
                        app.showErrorDepthMeter    // show the error if you fail
                    );
                    
                };

                var disconnect = function () {
                    bluetoothSerial2.disconnect(
                        app.closePort2,     // stop listening to the port
                        app.showErrorDepthMeter      // show the error if you fail
                    );
                    
                    
                };
                if (needConnect) bluetoothSerial2.isConnected(delayedFunc, connect);
                else bluetoothSerial2.isConnected(disconnect,null);
            }
	   }
	   finally {
		   
	   }
    },
/*
    subscribes to a Bluetooth serial listener for newline
*/
    openPort: function(sett,delayedFunc) {
        /* printer */
        
        //Zebra RW 220 - allo
        //Zebra RW 420 - fekvo
        if (sett.indexOf("220")>=0)  app.printerTplPrefix="_portrait"; //220
        else app.printerTplPrefix=""; //420
        
        var pconnected = function(){
            app.printerConnected=true;
            app.btRefresh();
        }
        var pnotconnected = function(){
            app.printerConnected=false;
            app.btRefresh();
        }        
        console.log("Connected to: " + app.printerId);

		
        // set up a listener to listen for newlines
        // and display any new data that's come in since
        // the last newline:
        bluetoothSerial.subscribe('\n', function (data) {
			console.log(data);
        });
        
        showMessage('BT nyomtató csatlakoztatás...','',0);
        bluetoothSerial.isConnected(pconnected,pnotconnected);
        if (delayedFunc!=null) {
            window.setTimeout(
                function() {bluetoothSerial.isConnected(delayedFunc,null)}
                ,5000
            );            
        }
    },
    openPort2: function(delayedFunc) {
        /* depthmeter */
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
        showMessage('Mélységmérő csatlakoztatás...','',0);
        bluetoothSerial2.isConnected(dconnected,dnotconnected);
        if (delayedFunc!=null) {
            window.setTimeout(
                function() {bluetoothSerial2.isConnected(delayedFunc,null)}
                ,5000
            );            
        }		
    },
	onData: function(data) {
        /* depthmeter */
            data = data.replace("\n","");
            //serverLog('depthmeter data received:{' + data+ '} app.currentModule:{' + app.currentModule+'}');
			app.depthMeterData=data.replace('T','');
            try {
                frac =  Number('0.' + app.depthMeterData.split('.')[1]);
                //serverLog('frac:{' + frac+ '}');
                if (frac>0.7) {
                    //serverLog('frac>0.7');
                    app.depthMeterData = Math.round(app.depthMeterData);
                }
                else {
                    //serverLog('frac<=0.7');
                    app.depthMeterData = Math.floor(app.depthMeterData);
                }
                
            }
            catch (err) {
                serverLog('depthmeter data error:{' + app.depthMeterData+ '} errorMessage:{' + err.message+'}');
                app.depthMeterData = Math.round(app.depthMeterData);
            }
            /* data<=0.7 -> 0; data>0.7 -> 1*/
            //serverLog('depthmeter data rounded:{' + app.depthMeterData+'}');
            //app.depthMeterData = Math.round(app.depthMeterData);
			if (app.currentModule=='beerk' || app.currentModule=='elrak' || app.currentModule=='leltar') {
				if ( $('#gstat').is(":visible") ){
					$('#gstat').val(app.depthMeterData);				
					$('#gstat').trigger('change');
                    //serverLog('depthmeter data sent');
				}
			}
			else showMessage(data);
	},

/*
    unsubscribes from any Bluetooth serial listener and changes the button:
*/
    closePort: function() {
		/* printer */
        // unsubscribe from listening:
		app.printerConnected=false;
        bluetoothSerial.unsubscribe(
                function (data) {
					console.log(data);
                },
                app.showErrorPrinter
        );
    },
    closePort2: function() {
		/* depthMeter */
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
		showMessage('BT nyomtató csatlakoztatás nem sikerült. '+error);
        console.log("printer bluetooth error:"+error);
        $('#btNext').removeAttr('disabled');
        $('#tableprinter').removeAttr('disabled');
        
		this.printerConnected = false;
        if ($('#btimg')) {
            $("#btimg").attr("src","img/bluetooth-red.png");
        }
    },
    showErrorDepthMeter: function(error) {
        messageHide();
        showMessage('Mélységmérő csatlakoztatás nem sikerült.'+error);
        $('#btNext').removeAttr('disabled');
        $('#tableprinter').removeAttr('disabled');

        if ($('#btimg')) {
            $("#btimg").attr("src","img/bluetooth-red.png");
        }
		console.log("depthmeter bluetooth error:"+error);
		this.depthMeterConnected = false;
    },
    btRefresh: function(){
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
/*
if(!window.cordova){
	//alert('cordova not found');
} 
else {
	//alert('cordova ok');
}
*/
app.initialize();


/* 
  app.initialize->bindEvents->onDeviceReady->receivedEvent->(orzott.js)showLogin
*/