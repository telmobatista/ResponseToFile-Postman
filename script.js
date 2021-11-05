const express = require('express'),
  app = express(),
  fs = require('fs'),
  shell = require('shelljs'),
   // Modify the folder path in which responses need to be stored
  folderPath = './Responses/',
  defaultFileExtension = 'json', // Change the default file extension
  bodyParser = require('body-parser'),
  DEFAULT_MODE = 'writeFile',
  path = require('path');
  var request = require('request');
  var json2csv = require('json2csv').parse;
  var newLine = '\r\n';
  //var fields = ['id','guid','title','summary','filefield','version','isoldversion','isreleased','isarchived','ischangerequest','isdeleted','showTOC','masterLang','contentLang','versiondate','validfrom','validuntil','showfrom','showuntil','creatordate','changedate','publishdate','resubmissionDate','statustitle','statusid','statusname','mandatorkey','homeCategoryId','doctypetitle','doctypeid','doctypeguid','doctypeclass','workflowtitle','workflowid','workflowguid','resubmissionWorkflow','creationWf','creationWfId','creationWfGuid','readstatus','readurgentstatus','componentType','content11','description','categories','metadata','attachments'];
  var fields = ['IsMasterLanguage','External_Id__c','External_Guid__c','title','UrlName','summary','Beschreibung__c','Language','External_Category_Id__c','ContainsAttachments__c','Files','datacategorygroup.AVS','datacategorygroup.AVSLinie_del','datacategorygroup.Abrechnung'];

  // Create the folder path in case it doesn't exist
  let folderPathAttach = folderPath + '/Attachments';
  let folderPathData = folderPath + '/Data';
  let folderPathImages = folderPath + '/Data/images';
  var csvfile = path.join(folderPath, 'file')+'.csv';
  shell.mkdir('-p', folderPath);
  shell.mkdir('-p', folderPathData);
  shell.mkdir('-p', folderPathImages);
  shell.mkdir('-p', folderPathAttach);
  shell.mkdir('-p', "./OriginalResponses/");
  shell.rm(csvfile);
  shell.rm('Archive.zip');

var username = "schnelch";
var password = "noventi2021";
var  baseurl = "https://ahelp.awinta.net/serviceconnector/services/rest/";
var  auth = "Basic " + Buffer.from(username + ":" + password).toString("base64");

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

function myreplace(mytext, oldText,newText){
  while (mytext.indexOf(oldText) > -1) {
    mytext = mytext.replace(oldText, newText);
  }
  return mytext;
}


 // Change the limits according to your response size
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); 

app.get('/', (req, res) => res.send('Hello, I write data to file. Send them requests!'));

app.post('/write', (req, res) => {
  let extension = req.body.fileExtension || defaultFileExtension,
    fsMode = req.body.mode || DEFAULT_MODE,
    uniqueIdentifier = req.body.uniqueIdentifier ? typeof req.body.uniqueIdentifier === 'boolean' ? Date.now() : req.body.uniqueIdentifier : false,
    filename = `${req.body.requestName}${uniqueIdentifier || ''}`,
    filePath = `${path.join(folderPath, filename)}.${extension}`,
    options = req.body.options || undefined;
    var respData = JSON.parse( req.body.responseData);
    let filename1 = `${req.body.requestName}${uniqueIdentifier || ''}`;
    let filePath1 = path.join(folderPathData, filename1)+'.html';

    if(respData!= null && respData != '' && respData.length == 1){
      respData = respData[0];
      //console.log("ResponseData:"+JSON.stringify(respData));
      respData.Beschreibung__c = "Data/"+filename1+'.html';
      respData.External_Id__c=respData.id;
      respData.External_Guid__c = respData.guid;
      respData.Language = respData.contentLang;
      respData.IsMasterLanguage = (respData.contentLang == respData.masterLang)?"1":"0";
      respData.UrlName = respData.title.replace(/[:;._()&?`\s"/]/g, '-').replace(/(-+)/g, '-').replace(/\-$/,'');//myreplace(myreplace(respData.title," ","-"),"_","-");
      respData.LastPublishedDate = respData.publishdate;
      respData.External_Category_Id__c = respData.homeCategoryId;
      respData.ContainsAttachments__c = false;
      respData.Files = "";
      respData.datacategorygroup =  { AVS : "",  AVSLinie_del :"", Abrechnung : ""};

      let contentData = respData.content; 
      //const regexpWithoutE = /(src=\\"openAttachment(.+?)")|(href=\\"openAttachment(.+?)")|(src=\\"https://ahelp.awinta.net/knowledgebase/openAttachment(.+?)")|(href=\\"https://ahelp.awinta.net/knowledgebase/openAttachment(.+?)")/ig;
      //const regexpWithoutE = /(src=\\"(.*?)openAttachment(.+?)")|(href=\\"(.*?)openAttachment(.+?)")/ig;
      const regexpWithoutE = /(src=\\"(.+?)")|(href=\\"(.+?)")/ig;
      let a = JSON.stringify(contentData);
      let ar = a.match(regexpWithoutE);
      if(ar != null){
        console.log("ar:["+filename+"]:"+ar.length);
          for(let element of ar){
            let myurl = element.split("\"")[1];
            console.log("myurl:["+myurl+"]");

            const regexpdocIdandAttrId = /(entity.id=\d+)|(att.id=\d+)/ig;
            const regexfilename = /((?<=att.fileName=).*?(?=&))/ig;
            let ar1 = myurl.match(regexpdocIdandAttrId);
            if(ar1 != null){
              let entityId,attfilename,attId;
              for(let element1 of ar1){
                let splitEl = element1.split("=");
                if(splitEl[0] == "entity.id"){
                  entityId = splitEl[1];
                }
                if(splitEl[0] == "att.id"){
                  attId = splitEl[1];
                }
              }
              let ar2 = myurl.match(regexfilename);
              if(ar2!= null && ar2.length == 1){
                attfilename = ar2[0];
              }
              console.log("entityId: "+entityId+" attId: "+attId+" attfilename: "+attfilename);

              if(attfilename && attfilename.length > 0){
                let requestFile = baseurl+"documents/"+entityId+"/attachments/"+attId;
                console.log(requestFile);
                let filePath2 = attfilename.endsWith("pdf")?path.join(folderPathAttach, attfilename):path.join(folderPathImages, attfilename);
                filePath2 = filePath2.replace("+","_");
                download({ url: requestFile,  headers : { "Authorization" : auth }}, filePath2, function(){
                  console.log('download Complete');
                });
                if(attfilename.endsWith("pdf")){
                  respData.ContainsAttachments__c = true;
                  let file1 = filePath2.replace("Responses/","");
                  respData.Files = respData.Files.length==0?file1:respData.Files+"+"+file1;
                  SaveInCsv('attachments.csv',{"Filepath":filePath3,"External_Id__c":respData.External_Id__c},['External_Id__c','Filepath']);
                }
                let f2 = filePath2.replace("Responses/Data/","");
                if(element.startsWith("src=")){
                  a = myreplace(a,element, ("src=\\\""+f2+"\\\""+ attfilename.endsWith("pdf")?" target=\\\"LinkAttach_"+attfilename+"\\\" ":""));
                } else if(element.startsWith("href=")){
                  a = myreplace(a,element, ("href=\\\""+f2+"\\\""+ attfilename.endsWith("pdf")?" target=\\\"LinkAttach_"+attfilename+"\\\" ":""));
                }
              } else if(attId == undefined && entityId != undefined){
                if(element.startsWith("src=")){
                  a = myreplace(a,element,"src=\\\""+entityId+"\\\" target=\\\"LinkDoc_"+entityId+"\\\" ");
                } else if(element.startsWith("href=")){
                  a = myreplace(a,element,"href=\\\""+entityId+"\\\" target=\\\"LinkDoc_"+entityId+"\\\" ");
                }
              }
          }
        }
      }

      a = myreplace(myreplace(myreplace(myreplace(a,"ü","&uuml;"),"ö","&ouml;"),"ä","&auml;"),"´","&acute;");
      a = myreplace(myreplace(myreplace(a,"Ü","&Uuml;"),"Ö","&Ouml;"),"Ä","&Auml;");
      //a = myreplace(myreplace(a,"ß","&szlig;"),"-","&ndash;");
      a = myreplace(a,"ß","&szlig;");
      a = myreplace(myreplace(a,"„","&bdquo;"),"“","&ldquo;");
      a = myreplace(a,"﻿","");



      console.log("a:::"+a)
      fs[fsMode](filePath1, JSON.parse(a), options, (err) => {
        if (err) {
          console.log(err);
        } 
      });

      SaveInCsv(csvfile,respData,fields);

      fs[fsMode]("OriginalResponses/"+filename1+'.html', req.body.responseData, options, (err) => {
        if (err) {
          console.log(err);
          res.send('Error');
        } else {
          res.send('Success');
        }
      });
    }
});

app.listen(3000, () => {
  console.log('ResponsesToFile App is listening now! Send them requests my way!');
  console.log(`Data is being stored at location: ${path.join(process.cwd(), folderPath)}`);
});


function SaveInCsv(filename,json,csvFields){
  fs.stat(filename, function (err, stat) {
    if (err == null) {
      //write the actual data and end with newline
      var csv = json2csv(json,{fields:csvFields, header: false }) + newLine;
      fs.appendFile(filename, csv, function (err1) {
        if (err1) throw err1;
      });
    } else {
      var csv2 = json2csv(json,{fields:csvFields, header: true }) + newLine;
      fs.writeFile(filename, csv2, function (err1) {
        if (err1) throw err1;
      });
    }
  });
}


//<a data-lightning-target="_blank" href="/articles/de/Knowledge/aCare-Medikation-ändern-bearbeiten" target="_blank">aCare - Medikation &auml;ndern / bearbeiten</a>