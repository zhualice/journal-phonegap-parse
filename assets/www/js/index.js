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
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        
        // Manually fire this event when testing in desktop browsers
        // this.onDeviceReady();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        // Init our parse SDK
        app.initializeParse();
        
        // test parse connectivity
        // app.testParse();
        
        app.getJournalEntries();
        
        app.initializeUI();
    },
    initializeParse: function() {
    	// Init with our app info and Key
    	var parseAppID = "",
        parseApiKey = "";
    	
    	if (parseAppID == "" || parseApiKey == "") {
    		alert("Setup a parse account and add your AppID and ApiKey in 'initializeParse'");
    	}
    	
    	Parse.initialize(parseAppID, parseApiKey);
    	
    	// Setup our JournalEntryObject for interaction with Parse
    	JournalEntryObject = Parse.Object.extend("JournalEntryObject");
    },
    testParse: function() {
    	// Create a test object and try to save it
    	var TestObject = Parse.Object.extend("TestObject");
    	var testObject = new TestObject();
    	
    	testObject.save({foo: "bar"}, {
    	  success: function(object) {
    		  console.log("Parse Test Successful!");
    	  }
    	});
    },
    initializeUI: function() {
    	var self= this,
    	$enrtiesPage = $("._entriesPage"),
    	$addEntryPage = $("._addEntryPage");
    	
    	$enrtiesPage.find("._addEntry").click(function(e) {
    		$enrtiesPage.hide();
    		$addEntryPage.show();
        });
        
    	$addEntryPage.find("._addEntry").click(function(e) {
        	var journalEntry = new JournalEntryObject(),
        	$title = $("#journalEntryTitle"),
        	$body = $("#journalEntryBody");
        	
        	journalEntry.set("title", $title.val());
        	journalEntry.set("body", $body.val());

        	if (journalEntry.get("title") == "") {
        		alert("Please enter a title for this journal entry.");
        		return;
        	}
        	
        	if (journalEntry.get("body") == "") {
        		alert("Please enter a body for this journal entry.");
        		return;
        	}
        	
        	journalEntry.save(null, {
    			success:function(object) {
    				console.log("Saved the object!");
    				$title.val("");
    				$body.val("");
    				
    				self.getJournalEntries();
    				
    				$addEntryPage.hide();
    				$enrtiesPage.show();
    			}, 
    			error:function(object,error) {
    				console.dir(error);
    				alert("Sorry, I couldn't save this journal entry.");
    			}
    		});
        });
        
    	$addEntryPage.find("._cancelEntry").click(function(e) {
        	$addEntryPage.hide();
        	$enrtiesPage.show();
        });
    },
    getJournalEntries: function() {
    	var query = new Parse.Query(JournalEntryObject);

    	query.find({
    		success:function(results) {
    			console.dir(results);
    			var s = "";
    			if (results.length > 0) {
	    			for(var i=0, len=results.length; i<len; i++) {
	    				var entry = results[i];
	    				s += "<li>";
	    				s += "<h2>"+entry.get("title")+"</h2>";
	    				s += "<p>" + entry.get("body") + "</p>";
	    				s += "<div class='created'>Created "+entry.createdAt + "</div>";
	    				s += "</li>";
	    			}
    			} else {
    				s = "<li class='loading'><h2>No journal entries found</h2></li>";
    			}
    			
    			$("._entries").html(s);
    		},
    		error:function(error) {
    			alert("Error when getting journal entries!");
    		}
    	});
    }
};
