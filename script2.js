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

var json2csv = require('json2csv').parse;
var newLine = '\r\n';
var fsMode =  DEFAULT_MODE;
var fields = ['id','guid','title','summary','version','isoldversion','isreleased','isarchived','ischangerequest','isdeleted','showTOC','masterLang','contentLang','versiondate','validfrom','validuntil','showfrom','showuntil','creatordate','changedate','publishdate','resubmissionDate','statustitle','statusid','statusname','mandatorkey','homeCategoryId','doctypetitle','doctypeid','doctypeguid','doctypeclass','workflowtitle','workflowid','workflowguid','resubmissionWorkflow','creationWf','creationWfId','creationWfGuid','readstatus','readurgentstatus','componentType','content','description','categories','metadata','attachments'];

//shell.mkdir('-p', folderPath);
var folderPath1 = folderPath + '/data';

var appendThis = [
{"id":"801","content":"<p tid=\"3\"><span style=\"font-size: 12.0pt;\" _mce_style=\"font-size: 12pt;\"><span style=\"color: rgb(136,136,136);font-family: Arial , sans-serif;\" _mce_style=\"font-family: Arial , sans-serif; color: #888888;\"><strong>Parametereinstellung für die Sortierung im Rabattsubstitutionsdialog</strong></span></span></p> \n<p tid=\"4\"><strong><span style=\"color: black;font-family: Arial , sans-serif;font-size: 10.0pt;\" _mce_style=\"font-size: 10pt; font-family: Arial , sans-serif; color: black;\">Vorgehensweise </span></strong></p> \n<ul tid=\"5\"> \n <li tid=\"6\"><strong><span style=\"color: black;font-family: Arial , sans-serif;font-size: 10.0pt;\" _mce_style=\"font-size: 10pt; font-family: Arial , sans-serif; color: black;\">Ordner PROKAS7 Systempflege - Pflege Betriebsparameter </span><span style=\"color: black;font-family: Arial , sans-serif;font-size: 10.0pt;\" _mce_style=\"font-size: 10pt; font-family: 'Arial','sans-serif'; color: black;\">(für Apotheken mit Programmstarter 4 Verwaltung -&gt; 4 Pflege -&gt; 1 Betriebsparameter)</span></strong></li> \n <li tid=\"7\"><strong>Pfeil-Button hinter \"Alle\" anwählen</strong></li> \n <li tid=\"8\"><strong><span style=\"color: black;font-family: Arial , sans-serif;font-size: 10.0pt;\" _mce_style=\"font-size: 10pt; font-family: Arial , sans-serif; color: black;\">Kategorie&nbsp;\"Steuerungsparameter\"</span></strong></li> \n <li tid=\"9\"><strong><span style=\"color: black;font-family: Arial , sans-serif;font-size: 10.0pt;\" _mce_style=\"font-size: 10pt; font-family: Arial , sans-serif; color: black;\">Parameter&nbsp;\"Rabattsubstitutionsdialog Sortierung\"&nbsp;</span></strong></li> \n <li tid=\"10\"><strong><span style=\"color: black;font-family: Arial , sans-serif;font-size: 10.0pt;\" _mce_style=\"font-size: 10pt; font-family: Arial , sans-serif; color: black;\">gewünschten Wert eintragen</span></strong></li> \n <li tid=\"11\"><strong>Button \"Speichern\" </strong></li> \n <li tid=\"12\"><strong>Button \"Beenden\"</strong></li> \n</ul> \n<p tid=\"13\">Wie Sie die Sortierung im Rabattsubstitutionsdialog verändern.&nbsp;</p> \n<p tid=\"14\">Öffnen Sie im <strong>Ordner PROKAS7 Warenwirtschaft</strong> das Programm <strong>Pflege Betriebsparameter </strong><strong><span style=\"font-size: 10.0pt;\" _mce_style=\"font-size: 10pt; font-family: 'Arial','sans-serif'; color: black;\"><span style=\"color: black;\"><span style=\"font-family: Arial , sans-serif;\">(für Apotheken mit Programmstarter 4 Verwaltung -&gt; 4 Pflege -&gt; 1 Betriebsparameter)</span></span></span></strong>.&nbsp;Betätigen Sie&nbsp;den <strong>Pfeil-Button</strong> hinter der <strong>Zeile \"Alle\"</strong>.</p> \n<p tid=\"16\"><img alt=\"\" src=\"openAttachment.do?entity.id=801&amp;mandatorKey=MANDATOR_USU&amp;att.author=Knuffinke%2C+Andrea&amp;att.description=Clipboard+image&amp;att.fileName=clipboard_image_2.png&amp;att.mimeType=image%2Fpng&amp;att.creationDate=1622115238136&amp;att.fileSize=42874&amp;att.id=63011&amp;att.isPartOfHTML=true&amp;att.isDocument=false\"></p> \n<p tid=\"19\">Wählen Sie in der folgenden Auflistung die Kategorie&nbsp;<span style=\"color: rgb(0,0,0);\" _mce_style=\"color: #000000;\"><strong>\"Steuerungsparameter\"</strong>. Unterlegen Sie den <strong>Parameter \"</strong></span><strong>Rabattsubstitutionsdialog Sortierung</strong><span style=\"color: rgb(0,0,0);\" _mce_style=\"color: #000000;\"><strong>\"</strong> und </span>tragen Sie rechts&nbsp;im Eingabefeld den gewünschten Wert ein.</p> \n<p tid=\"15\"><img alt=\"\" src=\"openAttachment.do?entity.id=801&amp;mandatorKey=MANDATOR_USU&amp;att.author=Knuffinke%2C+Andrea&amp;att.description=Clipboard+image&amp;att.fileName=clipboard_image_3.png&amp;att.mimeType=image%2Fpng&amp;att.creationDate=1622115238164&amp;att.fileSize=221366&amp;att.id=63012&amp;att.isPartOfHTML=true&amp;att.isDocument=false\">&nbsp;<br> <br> <span style=\"color: rgb(199,52,139);\"><span _mce_style=\"color: #000000;\"><span style=\"font-family: Arial , sans-serif;font-size: 10.0pt;\" _mce_style=\"font-size: 10pt; font-family: Arial , sans-serif;\"><span _mce_style=\"color: #ff0000;\">Hinweis:</span></span></span></span><span style=\"color: rgb(0,0,0);\" _mce_style=\"color: #000000;\"><span style=\"font-family: Arial , sans-serif;font-size: 10.0pt;\" _mce_style=\"font-size: 10pt; font-family: Arial , sans-serif;\"> Die Standardeinstellung bei diesem Parameter ist die <strong>5</strong> -&gt; \"nach Lager, Rohgewinn, Name\".</span></span></p> \n<p tid=\"20\"><span style=\"color: rgb(0,0,0);\" _mce_style=\"color: #000000;\"><span style=\"font-family: Arial , sans-serif;font-size: 10.0pt;\" _mce_style=\"font-size: 10pt; font-family: Arial , sans-serif;\">Bestätigen&nbsp;Sie die Eingabe mit dem <strong>Button \"Speichern\"</strong> und verlassen Sie das Programm mit dem <strong>Button \"Beenden\"</strong>.</span></span></p>\n","description":"","title":"Pflege Betriebsparameter - Sortierung im Rabattsubstitutionsdialog","guid":"d53c1cf9-6511-4c81-9027-f69b2e61cf85","categories":[],"metadata":{},"attachments":[]}
];
//console.log('appendThis ['+appendThis+']');
//console.log('appendThis ['+typeof(appendThis)+']');
/*fs.stat('file.csv', function (err, stat) {
  if (err == null) {
    console.log('File exists');

    //write the actual data and end with newline
    var csv = json2csv(appendThis,{fields:fields, header: false }) + newLine;

    fs.appendFile('file.csv', csv, function (err) {
      if (err) throw err;
      console.log('The "data to append" was appended to file!');
    });
  } else {
    //write the headers and newline
    console.log('New file, just writing headers');
    var csv = json2csv(appendThis,{fields:fields, header: true }) + newLine;
    console.log('File exists:csv:'+csv);
    fs.writeFile('file.csv', csv, function (err) {
      if (err) throw err;
      console.log('file saved');
    });
  }
});*/

/*
const regexpWithoutE = /(src=\\"(.+?)")/ig;
let a = JSON.stringify(appendThis[0].content);
console.log(a);
let ar = a.match(regexpWithoutE);
console.log(ar);
for (let index = 0; index < ar.length; index++) {
    let element = ar[index];
    console.log(element);
    console.log(a.indexOf(element));
    while (a.indexOf(element) > -1) {
        a = a.replace(element, "Telmo");
        console.log("replaced");
    } 
}
console.log(a);
*/

/*
https://ahelp.awinta.net/serviceconnector/services/rest/documents/id:{{docId}}?references=true&referencedDocs=true
Username: schnelch
Password: noventi2021
*/
//request = require('request'),
/*var request = require('request-promise');
var username = "schnelch",
    password = "noventi2021",
    url = "https://ahelp.awinta.net/serviceconnector/services/rest/documents/id:800?references=true&referencedDocs=true",
    auth = "Basic " + Buffer.from(username + ":" + password).toString("base64");
    */
/*
request(
    {
        url : url,
        headers : {
            "Authorization" : auth
        }
    },
    function (error, response, body) {
        // Do more stuff with 'body' here
        console.log("error: "+error);
        console.log("response: "+response);
        console.log("body: "+body);
    }
);
*/
/*var entityId = "11273";
var attId = "30556";
var  baseurl = "https://ahelp.awinta.net/serviceconnector/services/rest/";
let requestFile = baseurl+"documents/"+entityId+"/attachments/"+attId;
console.log(requestFile);*/
/*request({ method:"Get", url: requestFile, json: true, headers : { "Authorization" : auth }})
.then(json => json.map(item => item.url))
.then(urls => Promise.all(urls.map(url => request(url))))
.then(arrayOfResultsFromEachPreviousRequest => {
  // ...
  arrayOfResultsFromEachPreviousRequest.map(x => {
    console.log("x"+x);
  })
  console.log("request end");
});
   */           
/*const got = require('got');

(async () => {
  try {
    const res = await got(requestFile, { json: false, headers : { "Authorization" : auth } });
    var body = '';
    console.log("body: "+res);
        res.setEncoding('binary');
        res.on('error', function(err) {
          console.log("err: "+err);
          })
          .on('data', function(chunk) {
            body += chunk
            console.log("chunk: "+chunk);
          })
          .on('end', function() {
            let filePath1 = path.join(folderPath1, 'Download GH_umfirmieren_Bsp_Fiebig_Palapharm.png');
            //var path = '/tmp/' + Math.random().toString().split('.').pop()
            console.log("writeFile: ");
            fs.writeFile(filePath1, body, 'binary', function(err) {
              if (err) {
                console.log('Error');
              } else {
                console.log('Success');
              }
            });
          });
    //console.log("body: "+response);
    //console.log("url: "+response.body.url);
   // console.log("explanation: "+response.body.explanation);
  /* let filePath1 = path.join(folderPath1, 'Download GH_umfirmieren_Bsp_Fiebig_Palapharm.png');
   let options = undefined;
   fs[fsMode](filePath1, response, 'binary', (err) => {
    if (err) {
      console.log('Error');
    } else {
      console.log('Success');
    }
  });*/
  /*
  } catch (error) {
    console.log(error);
    console.log("Error:"+error.response.body+" Reeror");
  }
})();

*/

/*var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
let filePath1 = path.join(folderPath1, 'Download GH_umfirmieren_Bsp_Fiebig_Palapharm.png');
download({ url: requestFile,  headers : { "Authorization" : auth }}, filePath1, function(){
  console.log('done');
});*/

var s = "<p style=\"text-align: left;\" _mce_style=\"text-align: left;\" tid=\"3\"><strong><span style=\"color: rgb(136,136,136);font-size: 12.0pt;\" _mce_style=\"font-size: 12pt; color: #888888;\">Die Vorgangshistorie</span></strong></p> \n<p style=\"text-align: left;\" _mce_style=\"text-align: left;\" tid=\"4\">In der Vorgangshistorie finden&nbsp;Sie alle Kundenvorgänge des <span style=\"color: rgb(255,0,0);\" _mce_style=\"color: #ff0000;\"><span style=\"color: rgb(0,0,0);\" _mce_style=\"color: #000000;\">aktuellen Tages und des jeweiligen Arbeitsplatzes</span>.</span></p> \n<p style=\"text-align: left;\" _mce_style=\"text-align: left;\" tid=\"5\">Sie können hier einen&nbsp;<a href=\"docShow.do?isReference=true&amp;isPartOfHTML=true&amp;entity.id=881&amp;entity.GUID=e3959a2a-f29a-4bd1-9673-485639784258&amp;mandatorKey=MANDATOR_USU\" target=\"documentShow\">Bildschirmkasse - Bon nachdrucken</a>, <a href=\"docShow.do?isReference=true&amp;isPartOfHTML=true&amp;entity.id=849&amp;entity.GUID=84d55d21-7491-48fd-8d01-3c5a2a485c79&amp;mandatorKey=MANDATOR_USU\" target=\"documentShow\">Bildschirmkasse - Einem Kunden nachträglich einen Vorgang zuordnen</a>, einen&nbsp;<a href=\"docShow.do?isReference=true&amp;isPartOfHTML=true&amp;entity.id=880&amp;entity.GUID=caad1cbe-bd80-40f3-bf3a-96f3e876ff64&amp;mandatorKey=MANDATOR_USU\" target=\"documentShow\">Bildschirmkasse - Vorgang zum Ändern wiederaufnehmen</a>&nbsp;<br> und ein vergessenes <a href=\"docShow.do?isReference=true&amp;isPartOfHTML=true&amp;entity.id=850&amp;entity.GUID=2641dd09-b35c-4197-ba9f-d099309cd27b&amp;mandatorKey=MANDATOR_USU\" target=\"documentShow\">Bildschirmkasse - Rezept nachträglich aus der Vorgangshistorie bedrucken</a>.</p> \n<p style=\"text-align: left;\" _mce_style=\"text-align: left;\" tid=\"6\"><strong>Vorgehensweise</strong></p> \n<ul tid=\"7\"> \n <li tid=\"8\"> \n  <div style=\"text-align: left;\" _mce_style=\"text-align: left;\" tid=\"9\"> \n   <strong>Bildschirmkasse</strong> \n  </div> </li> \n <li tid=\"10\"> \n  <div style=\"text-align: left;\" _mce_style=\"text-align: left;\" tid=\"11\"> \n   <strong>Button \"Vorgangshistorie\"</strong> \n  </div> </li> \n <li tid=\"12\"> \n  <div style=\"text-align: left;\" _mce_style=\"text-align: left;\" tid=\"13\"> \n   <strong>Button \"Beenden\"</strong> \n  </div> </li> \n</ul> \n<p style=\"text-align: left;\" _mce_style=\"text-align: left;\" tid=\"14\">Wie Sie die Vorgangshistorie öffnen.</p> \n<p style=\"text-align: left;\" _mce_style=\"text-align: left;\" tid=\"15\">Wählen&nbsp;Sie&nbsp;an der entsprechenden <strong>Bildschirmkasse </strong>den <strong>Button \"Vorgangshistorie\"</strong>.</p> \n<p style=\"text-align: left;\" _mce_style=\"text-align: left;\" tid=\"16\"><img width=\"411\" height=\"380\" alt=\"\" src="Responses/data/images/clipboard_image_1.png">&nbsp;&nbsp;</p> \n<p style=\"text-align: left;\" _mce_style=\"text-align: left;\" tid=\"17\">Folgender Dialog&nbsp;öffnet sich:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p> \n<p style=\"text-align: left;\" _mce_style=\"text-align: left;\" tid=\"18\"><img alt=\"\" src="Responses/data/images/clipboard_image_2.png"></p> \n<p style=\"text-align: left;\" _mce_style=\"text-align: left;\" tid=\"19\">Mit dem <strong>Button \"Beenden\"</strong>&nbsp;verlassen Sie den&nbsp;Dialog.&nbsp;</p>\n";

fs[fsMode]("file.html", s, undefined, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Success');
  }
});