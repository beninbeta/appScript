function onOpen(e) {
    var ui = DocumentApp.getUi();
    // Or DocumentApp or FormApp.
    //creates menu for useres in the file area for users to select their role in the process
    DocumentApp.getUi().createAddonMenu()
        .addItem('1. Discipline Coordinator', 'showDiscoordSideBar')
        .addSeparator()
        .addItem('2. Associate Dean Approval/SSBE', 'showADeanSideBar')
        .addSeparator()
        .addItem("3. Academic Dean Approval", "showAcadDeanSideBar")
        .addSeparator()
        .addItem("4. Core Curriculum Approval", "showCoreSideBar")
        .addSeparator()
        .addItem("5. Registrar Approval", 'showRegistrarSideBar')
        .addToUi();
    //popup to remind users how to use the application as it can be a while between uses
    ui.alert("Please go to the Add-Ons menu, select CourseApprovalModification, and then select your role to fill in your approval.  You must fill in all text boxes and choose appropriate responses for any checkboxes.  Please do not modify any of the <<TAGS>> in the document. If you deny a course, you may enter the reasons directly into the Notes section of the document. Thank you.");
  }
  
  /**
   * Runs when the add-on is installed.
   *
   * @param {object} e The event parameter for a simple onInstall trigger. To
   *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
   *     running in, inspect e.authMode. (In practice, onInstall triggers always
   *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
   *     AuthMode.NONE.)
   */
  function onInstall(e) {
    onOpen(e);
  }
  //Creates new sidebar for each different person
  function showADeanSideBar() {
    var ui = HtmlService.createHtmlOutputFromFile('adean')
        .setTitle('Course Review')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    DocumentApp.getUi().showSidebar(ui);
  }
  
  function showDiscoordSideBar() {
    var ui = HtmlService.createHtmlOutputFromFile('discoord')
        .setTitle('Course Review')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    DocumentApp.getUi().showSidebar(ui);
  }
  
  function showAcadDeanSideBar() {
    var ui = HtmlService.createHtmlOutputFromFile('acadean')
        .setTitle('Course Review')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    DocumentApp.getUi().showSidebar(ui);
  }
  
  function showCoreSideBar() {
    var ui = HtmlService.createHtmlOutputFromFile('core')
        .setTitle('Course Review')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    DocumentApp.getUi().showSidebar(ui);
  }
  
  function showRegistrarSideBar() {
    var ui = HtmlService.createHtmlOutputFromFile('registrar')
        .setTitle('Course Review')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    DocumentApp.getUi().showSidebar(ui);
  }
  /**gets the ui, then replaces text upon approval or denial and sends email to next person or back to the submitter if denied
   * @param {string} fname First name current person
   * @param {string} lname Last name current person
   * @param {string} approval Response of current stage
   * @param {string} assocDeanName Name of next person
   * @param {string} assocDeanEmail Email of next person
   * @param {string} submitterEmail Email of the submitter
   **/
  function disCoord(fName, lName, approval, assocDeanName, assocDeanEmail, submitterEmail) {
    //DocumentApp.getUi().alert(assocDeanEmail);
    
    
    var currDoc = DocumentApp.getUi();
    //var getAnswers= PropertiesService.getUserProperties();
    //var name = ui.prompt("What is your name?").getResponseText();
    //var approval = ui.prompt(name + " do you approve of this course?", ui.ButtonSet.YES_NO).getSelectedButton();
    //copy signature items onto document
    DocumentApp.getActiveDocument().getBody().replaceText("<<discoord>>", fName + " " + lName);
    DocumentApp.getActiveDocument().getBody().replaceText("<<approval1>>", approval);
    var today = new Date();
    var month = today.getMonth()+1;
    DocumentApp.getActiveDocument().getBody().replaceText("<<date1>>", month + '/' + today.getDate() + '/' + today.getYear());
    
    
    //send email to the next person or back to submitter on denial
    approvalCheck(approval, submitterEmail, assocDeanEmail, assocDeanName)
   
    
  }

  /**gets the ui, then replaces text upon approval or denial and sends email to next person or back to the submitter if denied
   * @param {string} name  Name current person
   * @param {string} courseNum Course Number of Cousrs
   * @param {string} approval Response of current stage
   * @param {string} submitterEmail Email of the submitter
   **/
  function registrar(name, courseNum, approval, submitterEmail){
    var ui = DocumentApp.getUi();
    if(DocumentApp.getActiveDocument().getBody().findText("<100>")){
       DocumentApp.getActiveDocument().getBody().replaceText("<100>", courseNum);   
    }else if(DocumentApp.getActiveDocument().getBody().findText("<200>")){
       DocumentApp.getActiveDocument().getBody().replaceText("<200>", courseNum);
    }else if(DocumentApp.getActiveDocument().getBody().findText("<300>")){
       DocumentApp.getActiveDocument().getBody().replaceText("<300>", courseNum);
    }else if(DocumentApp.getActiveDocument().getBody().findText("<400>")){
       DocumentApp.getActiveDocument().getBody().replaceText("<400>", courseNum);
    }else if(DocumentApp.getActiveDocument().getBody().findText("<500>")){
       DocumentApp.getActiveDocument().getBody().replaceText("<500>", courseNum);
    }
    
    if(approval == 'Yes'){
      MailApp.sendEmail(submitterEmail, "Your Course has been Approved", "Here is your Course Document" + DocumentApp.getActiveDocument().getUrl());
    }else{
      approvalCheck(approval, submitterEmail, "youremail", "Bug Registrar");
    }
    //copy signature items onto document
    DocumentApp.getActiveDocument().getBody().replaceText("<<registrar>>", name);
    DocumentApp.getActiveDocument().getBody().replaceText("<<finalapproval>>", approval);
    var today = new Date();
    var month = today.getMonth()+1;
    
    DocumentApp.getActiveDocument().getBody().replaceText("<<date5>>", month + '/' + today.getDate() + '/' + today.getYear());
  }
  
  /**gets the ui, then replaces text upon approval or denial and sends email to next person or back to the submitter if denied
   * @param {string} fname First name current person
   * @param {string} lname Last name current person
   * @param {string} nc Is new Coure or not
   * @param {string} core Is a core course or not
   * @param {string} approval Response of current stage
   * @param {string} submitterEmail Email of the submitter
   **/
  function aDean(fName, lName, nc, core, approval, submitterEmail) {
    var ui = DocumentApp.getUi();
    DocumentApp.getActiveDocument().getBody().replaceText("<<assocdean>>", fName + " " + lName);
    DocumentApp.getActiveDocument().getBody().replaceText("<<approval2>>", approval);
    var today = new Date();
    var month = today.getMonth()+1;
    
    DocumentApp.getActiveDocument().getBody().replaceText("<<date2>>", month + '/' + today.getDate() + '/' + today.getYear());
    
    if(approval == 'Yes'){
    newCourseCheck(nc, core);
    }else{
      var bug = "Bug";
      var nextPerson = "youremail";
      approvalCheck(approval, submitterEmail,nextPerson, bug);
    }
  }
  
  /**gets the ui, then replaces text upon approval or denial and sends email to next person or back to the submitter if denied
   * @param {string} name Name current person
   * @param {string} core Is a core course or not
   * @param {string} approval Response of current stage
   * @param {string} submitterEmail Email of the submitter
   **/
  function acaDean(name, approval, core, submitter) {
    var ui = DocumentApp.getUi();
    
    
    //copy signature items onto document
    DocumentApp.getActiveDocument().getBody().replaceText("<<acadecdean>>", name);
    DocumentApp.getActiveDocument().getBody().replaceText("<<approval3>>", approval);
    var today = new Date();
    var month = today.getMonth()+1;
    
    DocumentApp.getActiveDocument().getBody().replaceText("<<date3>>", month + '/' + today.getDate() + '/' + today.getYear());
    //Send email to registrar.
    
    if(approval == 'Yes' && core == 'Yes'){
      //send to core  
      }else if(approval == 'Yes'  && core == 'No'){ 
        //send to Registrar
      }
      else{
        MailApp.sendEmail(submitter, "Course Approval Denied", "I regret to inform you that your course approval has been denied for the following course: " + DocumentApp.getActiveDocument().getUrl() + " Please take a look at the notes section to see why this class was not approved.");
    }
   
  }
   /** check to see if this is a new course and either send email next or replace text to NA
   * @param {string} nc Is a new course or not
   * @param {string} core Is a course course or not
   * 
   **/
  function newCourseCheck(nc, core){
    var ui = DocumentApp.getUi();
    if(nc == 'Yes'&& core == 'Yes'){ 
    }else if(nc == 'Yes' && core == 'No'){
    }else if(nc == 'No' && core == 'Yes'){
      DocumentApp.getActiveDocument().getBody().replaceText("<<acadecdean>>", "NA");
      DocumentApp.getActiveDocument().getBody().replaceText("<<approval3>>", "NA");
      DocumentApp.getActiveDocument().getBody().replaceText("<<date3>>", "NA");
    }else{
      DocumentApp.getActiveDocument().getBody().replaceText("<<acadecdean>>", "NA");
      DocumentApp.getActiveDocument().getBody().replaceText("<<approval3>>", "NA");
      DocumentApp.getActiveDocument().getBody().replaceText("<<date3>>", "NA");
      //send email to next person with link to the current document send to registrar.
    }
  }
  /**gets the ui, then replaces text upon approval or denial and sends email to next person or back to the submitter if denied
   * @param {string} name Name current person
   * @param {string} nextPerson Next person in the process
   * @param {string} Answer Response of current stage
   * @param {string} submitter Email of the submitter
   **/
  function approvalCheck(answer, submitter, nextPerson, name){
    var ui = DocumentApp.getUi();
    if(answer == 'Yes'){
      MailApp.sendEmail(nextPerson, "New/Existing Course to Review", name + ", Please review the attached course document for approval. You should open the document and from the addon menu (at the top of the screen) select Core Curriculm Approval. Then select your role in the process. You will then be asked to grant access to your Google Acount and select approve and follow the directions on the screen that slides out. " + DocumentApp.getActiveDocument().getUrl());
    }else{
        MailApp.sendEmail(submitter, "Course Approval Denied", "I regret to inform you that your course approval has been denied for the following course: " + DocumentApp.getActiveDocument().getUrl() + " Please take a look at the notes section to see why this class was not approved.");
    }
  }
  
  /**email the core team coordinator
   * @param {string} name Name current person
   * @param {string} nextPerson Next person in the process
   * @param {string} Answer Response of current stage
   * @param {string} submitter Email of the submitter
   **/
  function coreTeam(name, approval,nextPerson,submitter){
    var ui = DocumentApp.getUi();
    
    //copy signature items onto document
    DocumentApp.getActiveDocument().getBody().replaceText("<<corechair>>", name);
    DocumentApp.getActiveDocument().getBody().replaceText("<<approval4>>", approval);
    var today = new Date();
    var month = today.getMonth()+1;
    DocumentApp.getActiveDocument().getBody().replaceText("<<date4>>", month + '/' + today.getDate() + '/' + today.getYear());
    approvalCheck(approval, submitter, nextPerson, 'Registrar');
  }