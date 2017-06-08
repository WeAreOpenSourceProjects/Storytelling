import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-csv-input',
    templateUrl: './csv-input.component.html',
    styleUrls: ['./csv-input.component.scss']
})
export class CsvInputComponent implements OnInit {
    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('fileDisplayArea') fileDisplayArea: ElementRef;
    constructor() { }
    @Output() csv2json: EventEmitter<any> = new EventEmitter();
    ngOnInit() {



    }

    //var csv is the CSV file with headers
    csvJSON(csv) {
      try{
        if(csv=="") return null;
        var lines = csv.split("\n");
        lines.forEach((l, i) => {
            if (l == "") lines.splice(i, 1);
        })
        var result = [];

        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {

            var obj = {};
            var currentline = lines[i].split(",");

            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);

        }
        //console.log(JSON.stringify(result));
        //return result; //JavaScript object
        //return JSON.stringify(result); //JSON
        return result;
      }
      catch(e){
        console.log(e);
        return null;
      }

    }
    CSVToArray(strData, strDelimiter) {
        // Check to see if the delimiter &œis defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp((
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"), "\"");
            } else {
                // We found a non-quoted value.
                var strMatchedValue = arrMatches[3];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        // Return the parsed data.
        return (arrData);
    }
    newInput(e) {
        let fileInput = this.fileInput.nativeElement;
        let fileDisplayArea = this.fileDisplayArea.nativeElement;
        let file = fileInput.files[0];
        let textType = /text.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = () => {
                //transfer to json
                console.log(reader.result);
                let json = this.csvJSON(reader.result);
                this.csv2json.emit(json);
                fileDisplayArea.innerText = reader.result;
            };

            reader.readAsText(file);
        } else {
            fileDisplayArea.innerText = "File not supported!"
        }
    }
}
