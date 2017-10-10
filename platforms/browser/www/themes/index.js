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
        
var pushNotification;       
var idToken = "";
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        app.receivedEvent('deviceready');  
        document.addEventListener("backbutton", function(){}, false);   
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var push = PushNotification.init({
            android: {
                senderID: "4155299667",
                icon: "images/logo_app.png"
            },
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true",
                senderID: "4155299667",
                icon: "images/logo_app.png"
            },
            windows: {}
        });

        push.on('registration', function(data) {
            // data.registrationId
            localStorage.setItem("idTokenSesion",data.registrationId); 
            //alert(data.registrationId)
            $("#btnLogin").removeAttr("disabled")
            $("#btnScanLogin").removeAttr("disabled")
            var datos = {
                name: "SSCA APPP MONITOR",
                email: "SSCA",
                regId: data.registrationId
            } 
            $.post("http://localhost/push/registro.php", datos)
            .done(function( data ) {
            });
        });

        push.on('notification', function(data) {
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
            
            //$("#mensajeEntrante").html(data.message + "");
            //$('#popupMensaje').fadeIn('slow');

            //var idPage = $.mobile.activePage.attr('id');
            //alert(JSON.stringify(data) + " " + idPage)
        });        

        push.on('error', function(e) {
            // e.message
            //alert(e.message)
        });
    }
};

