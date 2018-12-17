function getEvent(){
  /**This function gets the events that currently logged in person is registered for
   * and returns a list of related session keys, the calendar event id for that session on that persons calendar
   * and the key for each record
   */
    var query = app.models.session_registrants.newQuery();
    query.filters.email_address._equals = Session.getActiveUser().getEmail();
    
    var events = [];
    var results = query.run();
    events =  results.map(function(key){
        return [key.Offerings._key, key.event_id, key._key];
    });
    //return the list of events the user is registered for and the event id
    return events;       
  }  
  function deleteEvent(key,cal){  
    /**calls getevents to get key and event id then matches the event to delete the correct event from the users calendar
     * @param {string} key is the current record related record key from Offerings
     * @param {string} cal is the calendar to delete the event from
    **/
    var event = getEvent();
    for(var i = 0; i < event.length; i++){
      //Checks each array item returned from getEvent() to match to the current current related record key
      if(event[i][0] == key){
        console.log("Event id: "+event[i][1]);
        var record = app.models.session_registrants.getRecord(event[i][2]);
        var getCal = CalendarApp.getCalendarById(cal);
        try {
            //deletes event from calendar and then deletes the record
           getCal.getEventById(event[i][1]).deleteEvent();
           app.models.session_registrants.deleteRecords([event[i][2]]);
        }catch(err){
          //if cal event doesn't exisit and throws an error we still delete the record
          app.models.session_registrants.deleteRecords([event[i][2]]);
        }
      }
      
    }
    
  }
  
  function createEvent(key,cal){
    /**This function creates a new event on the master training calendar 
     * @param {string} key is the record key for this sessions record
     * @param {string} cal is the calendar to place the event on, in this case the master training calendar
     */
    //Gets the record by key and then sets the paramaters for the calendar event and the event details in the record
    var record = app.models.session_registrants.getRecord(key);
    var name = record.session_name;
    var start = new Date(record.start);
    var end  = new Date(record.end);
    var options = {location: record.location};
    //Creates the event
    var event = CalendarApp.getCalendarById(cal).createEvent(name,start,end,options);
    //Gets the eventid to store in case we need to modify or delete the event
    record.event_id = event.getId();
    //saves the record
    app.saveRecords([record]);
  }
  
  function createSession(key,cal){
    /**Creates a session on the users calendar that mirrors the session they are signing up for
     * @param {string} key is the key for the this users registration
     * @param {string} cal is the calendar of the users primary calendar or 'primary'
     */
     //Gets the record and then creates an event with that records details
     record = app.models.Offerings.getRecord(key);
     name = record.title;
    
    var start = new Date(record.start);
    var end  = new Date(record.end);
    var options = {location: record.location};
    //Creates the event
    var event = CalendarApp.getCalendarById(cal).createEvent(name,start,end,options);
    //Gets the eventid to store in case we need to modify or delete the event
    record.event_id = event.getId();
    //saves the record
    app.saveRecords([record]);
  }
  
  function presenter_dets(value,key){
    /**sets the details of the presenter for a given session from the presenter database
     * @param {string} value is the current value passed from the clients side widget
     * @param {string} key is the record key for this item in presenters
     */
    var presenter = app.models.Presenters.getRecord(value);
    var presenter_details = app.models.Session_Presenters.getRecord(key);
    presenter_details.name = presenter.name;
    presenter_details.image_url = presenter.imgURL;
    presenter_details.title = presenter.title;
    presenter_details.domain = presenter.domain;
    app.saveRecords([presenter_details]);
    return true;
  }
  