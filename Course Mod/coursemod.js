function createDoc() {
    /**This script creates a new document on form submission for faculty to submit for a new course.
     * *params It doesn't take any arguments
     */
    //Gets the attached spreadsheet and then the form responses sheet
     var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Form Responses 1');
    
    //Get the last row with data
    var lastRow = sheet.getLastRow();
    
    //Get the course name for the new document
    var courseName = sheet.getRange(lastRow,getColumnNrByName(sheet, "New Course/Modified Title")).getValue();
    
    //copy template to a specified folder
    templateDocFile = DriveApp.getFileById("1OSjzpWnJOZQcKCiBDBYErURhsZr8GkmjZoqxqn3zn2U");
    var dir = DriveApp.getFolderById("0B2hVd2JQ5PLtcWl4UmRmbHQ3Y2c");
    //set copied doc name here
    newDocFile = templateDocFile.makeCopy(courseName, dir);
    
    //get the correct name and information for the person/email to send first
    var personOne = sheet.getRange(lastRow, getColumnNrByName(sheet, "Discipline Coordinator Name")).getValue();
    var emailOne= sheet.getRange(lastRow, getColumnNrByName(sheet, "Discipline Coordinator Email")).getValue();
   
    //fill in fields on the copied doc <<>> tags are what get filled in the new document
    newDoc = DocumentApp.openById(newDocFile.getId());
    newDoc.getBody().replaceText("<<Modify Existing>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Are you Modifying an Existing Course? ")).getValue());
    newDoc.getBody().replaceText("<<ESubject>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Current Disciplinary Code")).getValue());
    newDoc.getBody().replaceText("<<ECourse Number>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Course Number")).getValue());
    newDoc.getBody().replaceText("<<ECourse Title>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Existing Course Title")).getValue());
    newDoc.getBody().replaceText("<<NCNumber>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "New Course Level")).getValue());
    newDoc.getBody().replaceText("<<Disciplinary Code>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Disciplinary Code")).getValue());
    newDoc.getBody().replaceText("<<NCTitle>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "New Course/Modified Title")).getValue());
    newDoc.getBody().replaceText("<<Special Topic>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Will this be offered as a Special Topics course? (eg., numbered 289, 389 or 489)")).getValue());
    newDoc.getBody().replaceText("<<Course Credits>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Course Credits")).getValue());
    newDoc.getBody().replaceText("<<Course Term>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Course Term")).getValue());
    newDoc.getBody().replaceText("<<Course Frequency>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Course Frequency")).getValue());
    newDoc.getBody().replaceText("<<Grade Option>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Grade Option")).getValue());
    newDoc.getBody().replaceText("<<Submitted By>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Submitted by")).getValue());
    //creates an new date with today's date
    var today = new Date();
    var month = today.getMonth()+1;
    newDoc.getBody().replaceText("<<Date Proposed>>", month + '/' + today.getDate() + '/' + today.getYear());
    
    newDoc.getBody().replaceText("<<Course Prerequisites>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Course Prerequisites")).getValue());
    newDoc.getBody().replaceText("<<Course Catalog Description>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Course Catalog Description")).getValue());
    newDoc.getBody().replaceText("<<Reason for new course or modification>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Reason for new course or modification")).getValue());
    newDoc.getBody().replaceText("<<Special Instructions>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Special Instructions")).getValue());
    newDoc.getBody().replaceText("<<Core>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Is this a Writing Intensive Course or Core Curriculum ?")).getValue());
    newDoc.getBody().replaceText("<<Core Curriculum Area>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Core Curriculum Area: ")).getValue());
    newDoc.getBody().replaceText("<<Core Area Justification>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Core Area Justification:  How does this course satisfy the area description? ")).getValue());
    newDoc.getBody().replaceText("<<acquisition of intellectual>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Core Curriculum Goals: Choose the top two Core Curriculum goals that your course will meet: [Goal 1. The acquisition of intellectual and cognitive skills.]")).getValue());
    newDoc.getBody().replaceText("<<Understanding the world>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Core Curriculum Goals: Choose the top two Core Curriculum goals that your course will meet: [Goal 2. Understanding the world and one's place in it.]")).getValue());
    newDoc.getBody().replaceText("<<Understanding religious>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Core Curriculum Goals: Choose the top two Core Curriculum goals that your course will meet: [Goal 3. Understanding religious and spiritual dimensions of life.]")).getValue());
    newDoc.getBody().replaceText("<<development of creativity>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Core Curriculum Goals: Choose the top two Core Curriculum goals that your course will meet: [Goal 4. The development of creativity and self-expression.]")).getValue());
    newDoc.getBody().replaceText("<<development of personal>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Core Curriculum Goals: Choose the top two Core Curriculum goals that your course will meet: [Goal 5. The development of personal character and virtue.]")).getValue());
    newDoc.getBody().replaceText("<<Core Program Goals Justification>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Core Program Goals Justification:  How does this course satisfy the goals identified above?")).getValue());
    newDoc.getBody().replaceText("<<email>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Email Address")).getValue());
    
    newDoc.getBody().replaceText("<<WritingIntensive>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Consider this course as Writing Intensive ")).getValue());  
    newDoc.getBody().replaceText("<<SyllabusLink>>", sheet.getRange(lastRow, getColumnNrByName(sheet, "Attach link to syllabus in Google Drive ")).getValue());  
    
    
    newDoc.saveAndClose();
    var document = newDoc.getUrl();
    //adds the first person to be emailed and given editing rights to the document
    newDoc.addEditor(emailOne);
    //send email to first person with link to the current document
    MailApp.sendEmail(emailOne, "You have a New Course to Review", "Good day " + personOne + 
                      ",\n\nYou have a new course to review.\n\nFor video instructions on how to fill out this form please copy and paste this link into your address bar: \n https://www.youtube.com/watch?v=QmNvbg7g4cQ \n\nPlease go to the Add-Ons menu, select CourseApprovalModification, and then select your role to fill in your approval. A pop will ask you to authorize Google to access your account. Click Authorize. Then, when the next popup comes up, scroll to the bottom and click allow. You must fill in all text boxes and choose appropriate responses for any checkboxes. Please do not modify any of the <<TAGS>> in the document. If you deny a course, you may enter the reasons directly into the Notes section of the document. Thank you." + document);
    
  }
  // gets the specified column number via name so it can be more dynamic
  function getColumnNrByName(sheet, name) {
    
    var range = sheet.getRange(1, 1, 1, sheet.getMaxColumns());
    var values = range.getValues();
    
    for (var row in values) {
      for (var col in values[row]) {
        if (values[row][col] == name) {        
          return parseInt(col)+1;
        }
      }
    }
    
    throw 'failed to get column by name: ' + name;
  }
  