/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define("sap/ui/test/TestUtils",["jquery.sap.global","sap/ui/core/Core","sap/ui/thirdparty/URI","jquery.sap.script","jquery.sap.sjax"],function(q,C,U){"use strict";var r=/\/\$batch($|\?)/,j="application/json;charset=UTF-8;IEEE754Compatible=true",m={},M="\r\nContent-Type: application/http\r\n"+"Content-Transfer-Encoding: binary\r\n\r\nHTTP/1.1 ",R=q.sap.getUriParameters().get("realOData"),a=/^(GET|DELETE|PATCH|POST) (\S+) HTTP\/1\.1$/,p=R==="true"||R==="proxy",b=p||R==="direct",T;if(b){document.title=document.title+" (real OData)";}function d(A,e,P){var s=QUnit.objectType(A),E=QUnit.objectType(e),n;if(s!==E){throw new Error(P+": actual type "+s+" does not match expected type "+E);}if(s==="array"){if(A.length<e.length){throw new Error(P+": array length: "+A.length+" < "+e.length);}}if(s==="array"||s==="object"){for(n in e){d(A[n],e[n],P==="/"?P+n:P+"/"+n);}}else if(A!==e){throw new Error(P+": actual value "+A+" does not match expected value "+e);}}function c(A,e,s,E){try{d(A,e,"/");QUnit.assert.push(E,A,e,s);}catch(f){QUnit.assert.push(!E,A,e,(s||"")+" failed because of "+f.message);}}T={deepContains:function(A,e,s){c(A,e,s,true);},notDeepContains:function(A,e,s){c(A,e,s,false);},useFakeServer:function(s,B,f){function g(S,x,y){var z=y.requestBody,A,D=[""];A=n(z);z.split(A).slice(1,-1).forEach(function(E){var F,G,H,I;E=E.slice(E.indexOf("\r\n\r\n")+4);G=n(E);F=a.exec(G);if(!F){I=u(G);}else if(F[1]==="DELETE"){I="204 No Data\r\n\r\n\r\n";}else if(F[1]==="POST"||F[1]==="PATCH"){I="200 OK\r\nContent-Type: "+j+"\r\n\r\n"+o(E);}else{H=x[S+F[2]];if(H){try{I="200 OK\r\nContent-Type: "+j+"\r\n\r\n"+JSON.stringify(JSON.parse(H[2]))+"\r\n";q.sap.log.info(G,null,"sap.ui.test.TestUtils");}catch(e){I=h(G,500,"Internal Error","Invalid JSON");}}else{I=u(G);}}D.push(M+I);});D.push("--\r\n");y.respond(200,{"Content-Type":"multipart/mixed;boundary="+A.slice(2)},D.join(A));}function h(e,x,S,y){q.sap.log.error(e,y,"sap.ui.test.TestUtils");return x+" "+S+"\r\nContent-Type: text/plain\r\n\r\n"+y+"\r\n";}function i(){var H,e,x,y,z={};for(y in f){x=f[y];H=x.headers||{};if(x.source){e=v(B+x.source);H["Content-Type"]=H["Content-Type"]||k(x.source);}else{e=x.message||"";}z[y]=[x.code||200,H,e];}return z;}function k(N){if(/\.xml$/.test(N)){return"application/xml";}if(/\.json$/.test(N)){return j;}return"application/x-octet-stream";}function l(e){e.respond(200,{"Content-Type":j},e.requestBody);}function n(e){return e.slice(0,e.indexOf("\r\n"));}function o(e){return e.slice(e.indexOf("\n\r\n")+3);}function t(e,x){var y=x.url;if(r.test(y)){g(y.slice(0,y.indexOf("/$batch")+1),e,x);}else{l(x);}}function u(e){return h(e,404,"Not Found","No mock data found");}function v(P){var e=m[P],x;if(!e){x=q.sap.sjax({url:P,dataType:"text"});if(!x.success){throw new Error(P+": resource not found");}m[P]=e=x.data;}return e;}function w(){var e,S,x=i(),y;S=s.useFakeServer();S.autoRespond=true;for(y in x){S.respondWith("GET",y,x[y]);}S.respondWith("DELETE",/.*/,[204,{},""]);S.respondWith("PATCH",/.*/,l);S.respondWith("POST",/.*/,t.bind(null,x));e=S.restore;S.restore=function(){sinon.FakeXMLHttpRequest.filters=[];e.apply(this,arguments);};sinon.xhr.supportsCORS=q.support.cors;sinon.FakeXMLHttpRequest.useFilters=true;sinon.FakeXMLHttpRequest.addFilter(function(z,y){return z!=="DELETE"&&z!=="PATCH"&&z!=="POST"&&!(z==="GET"&&y in x);});}B=q.sap.getResourcePath(B).replace(/(^|\/)resources\/(~[-a-zA-Z0-9_.]*~\/)?/,"$1test-resources/")+"/";w();},withNormalizedMessages:function(f){sinon.test(function(){var o=sap.ui.getCore(),g=o.getLibraryResourceBundle;this.stub(o,"getLibraryResourceBundle").returns({getText:function(k,A){var s=k,t=g.call(o).getText(k),i;for(i=0;i<10;i+=1){if(t.indexOf("{"+i+"}")>=0){s+=" "+(i>=A.length?"{"+i+"}":A[i]);}}return s;}});f.apply(this);}).apply({});},isRealOData:function(){return b;},getRealOData:function(){return R?"&realOData="+R:"";},getBaseUri:function(){var e;if(document.baseURI){return document.baseURI;}e=document.getElementsByTagName("base");return e[0]&&e[0].href||location.href;},proxy:function(A){var P;if(!p){return A;}P=q.sap.getResourcePath("sap/ui").replace("resources/sap/ui","proxy");return new U(P+A,T.getBaseUri()).pathname().toString();},setupODataV4Server:function(s,f,S,F){var e={};if(b){return;}if(!F){F="/";}else if(F.slice(-1)!=="/"){F+="/";}Object.keys(f).forEach(function(u){var A=u[0]==="/"?u:F+u;e[A]=f[u];});T.useFakeServer(s,S||"sap/ui/core/qunit/odata/v4/data",e);}};return T;},true);
