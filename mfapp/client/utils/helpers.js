sap.ui.define([], function() {
   "use strict";

   return {
      
      
      getFileData: function(file)
      {
    	  return new Promise(function(resolve, reject)
    			  {
    		  			// Create a File Reader object
    		  			var reader = new FileReader();
    		  			var t = this;
    		  			
    		  			reader.onload = function(e) 
    		  			{
    		  				var csv = e.target.result;
    		  				
    		  				var lines=csv.split("\n");

    		  				var result = [];

    		  				var headers=lines[0].split(",");

    		  				for(var i=1;i<lines.length;i++)
    		  				{

    		  				  var obj = {};
    		  				  var currentline=lines[i].split(",");

    		  				  for(var j=0;j<headers.length;j++){
    		  					  obj[headers[j]] = currentline[j];
    		  				  }

    		  				  result.push(obj);
    		  				 }
    		  				
    		  				resolve(result);
    		  				  
//    		  			    var strCSV = e.target.result;
//    		  			    var arrCSV = strCSV.match(/[\w .]+(?=,?)/g);
//    		  			    var noOfCols = 2;
//
//    		  			    // To ignore the first row which is header
//    		  			    var hdrRow = arrCSV.splice(0, noOfCols);
//
//    		  			    var data = [];
//    		  			    while (arrCSV.length > 0) 
//    		  			    {
//    		  			    	var obj = {};
//    		  			    	// extract remaining rows one by one
//    		  			    	var row = arrCSV.splice(0, noOfCols)
//    		  			    	for (var i = 0; i < row.length; i++) 
//    		  			    	{
//    		  			    		obj[hdrRow[i]] = row[i].trim()
//    		  			    	}
//    		  			    	// push row to an array
//    		  			    	data.push(obj)
//    		  			   	
//    		  			    }
//
//    		  			  resolve(data);
    		  			}   
    		  			
    		  			reader.readAsBinaryString(file);
    		  			
    			  }); 
    	
    		
  			
  			
  			    
  			
    		  
    		  
  			
    	
      }

   }
});