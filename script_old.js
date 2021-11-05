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
  var HTMLParser = require('node-html-parser');
  var pd = require('pretty-data').pd;
  var json2csv = require('json2csv').parse;
  var newLine = '\r\n';
  var fields = ['id','guid','title','summary','filefield','version','isoldversion','isreleased','isarchived','ischangerequest','isdeleted','showTOC','masterLang','contentLang','versiondate','validfrom','validuntil','showfrom','showuntil','creatordate','changedate','publishdate','resubmissionDate','statustitle','statusid','statusname','mandatorkey','homeCategoryId','doctypetitle','doctypeid','doctypeguid','doctypeclass','workflowtitle','workflowid','workflowguid','resubmissionWorkflow','creationWf','creationWfId','creationWfGuid','readstatus','readurgentstatus','componentType','content11','description','categories','metadata','attachments'];

  // Create the folder path in case it doesn't exist
shell.mkdir('-p', folderPath);
let folderPath1 = folderPath + '/Data';
shell.mkdir('-p', folderPath1);
let folderPath2 = folderPath + '/Data/Images';
shell.mkdir('-p', folderPath2);

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

var stringToHTML = function(str) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(str, 'text/html');
  return doc.body;
};

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
    let filePath1 = path.join(folderPath1, filename1)+'.html';

    //console.log('appendThis ['+typeof(respData)+']');
    //console.log('respData :['+respData+']');

    if(respData!= null && respData != '' ){
      var csvfile = path.join(folderPath, 'file')+'.csv';
      fs.stat(csvfile, function (err, stat) {
        if (err == null) {
          //console.log('File exists');
          respData.filefield = "data/"+filename1+'.html';
          //write the actual data and end with newline
          var csv = json2csv(respData,{fields:fields, header: false }) + newLine;
          //console.log('csv: ['+csv+']');
          fs.appendFile(csvfile, csv, function (err1) {
            if (err1) throw err1;
            console.log('The "data to append" was appended to file!');
          });
        } else {
          //write the headers and newline
          //console.log('New file, just writing headers');
          var csv2 = json2csv(respData,{fields:fields, header: true }) + newLine;
          //console.log('csv: ['+csv2+']');
          fs.writeFile(csvfile, csv2, function (err1) {
            if (err1) throw err1;
            console.log('file saved');
          });
        }
      });

      let contentData = respData.content; 
      const regexpWithoutE = /(src=\\"(.*)openAttachment(.+?)")|(href=\\"(.*)openAttachment(.+?)")/ig;
      let a = JSON.stringify(contentData);
      console.log('file :'+a);
      let ar = a.match(regexpWithoutE);
      console.log("ar:["+filename+"]:"+ar);
      if(ar != null){
        for (let index = 0; index < ar.length; index++) {
            let element = ar[index];
            let myurl = element.split("\"")[1];
            console.log("myurl:["+myurl+"]");

            const regexpdocIdandAttrId = /(entity.id=\d+)|(att.id=\d+)/ig;
            const regexfilename = /((?<=att.fileName=).*?(?=&))/ig;
            let ar1 = myurl.match(regexpdocIdandAttrId);
            console.log("ar1: "+ar1);
            if(ar1 != null){
              let entityId,attfilename,attId;
              for (let index1 = 0; index1 < ar1.length; index1++) {
                let element1 = ar1[index1];
                let splitEl = element1.split("=");
                console.log("splitEl: "+splitEl);
                if(splitEl[0] == "entity.id"){
                  entityId = splitEl[1];
                }
                if(splitEl[0] == "att.id"){
                  attId = splitEl[1];
                }
                console.log(element1);
              }
              let ar2 = myurl.match(regexfilename);
              if(ar2!= null && ar2.length == 1){
                attfilename = ar2[0];
              }
              console.log(entityId);
              console.log(attfilename);
              console.log(attId);
              if(attfilename && attfilename.length > 0){
                let requestFile = baseurl+"documents/"+entityId+"/attachments/"+attId;
                console.log(requestFile);
                let filePath2 = path.join(folderPath2, attfilename);
                download({ url: requestFile,  headers : { "Authorization" : auth }}, filePath2, function(){
                  console.log('done');
                });
                console.log("filePath2:"+filePath2);
                console.log("folderPath:"+folderPath);
                let f2 = filePath2.replace("Responses/Data/","");
                console.log("f2:"+f2);
                console.log("replace: ["+element+"] by ["+f2+"]");
                console.log("P: "+a.indexOf(element));
                while (a.indexOf(element) > -1) {
                  a = a.replace(element, "src=\\\""+f2+"\\\"");
                  console.log("replace2: ["+element+"] by ["+f2+"]");
                }
              }

          }
        }
      }
      //var pdHtml= pd.xml(HTMLParser.parse(a).toString());
      fs[fsMode](filePath1, JSON.parse(a), options, (err) => {
        if (err) {
          console.log(err);
          res.send('Error');
        } else {
          res.send('Success');
        }
      });
    }
  }

 /* fs[fsMode](filePath, req.body.responseData, options, (err) => {
    if (err) {
      console.log(err);
      res.send('Error');
    }
    else {
      res.send('Success');
    }
  });*/
  //write Html

});

app.listen(3000, () => {
  console.log('ResponsesToFile App is listening now! Send them requests my way!');
  console.log(`Data is being stored at location: ${path.join(process.cwd(), folderPath)}`);
});
