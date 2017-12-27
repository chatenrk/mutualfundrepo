/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
window.sapUiSupportReport=window.sapUiSupportReport||{};window.sapUiSupportReport.filter=(function(){'use strict';function u(){var g=document.querySelectorAll('[data-groupName]');for(var i=0;i<g.length;i++){var c=g[i];var d=c.getAttribute('data-expandableElement');var e=c.getAttribute('data-groupName');var h=c.getAttribute('data-groupNumber');var j=document.querySelectorAll('#'+d+' > tr');var n=0;var l=0;for(var k=0;k<j.length;k++){var m=j[k];var o=m.querySelectorAll('tr.filterable:not(.filtered)');var p=o.length;if(p===0){m.classList.add('filtered');}else{l++;n+=p;m.querySelector('span.rule-issue-number').innerText='('+p+' issues)';}}if(l===0){c.classList.add('filtered');}else{c.classList.remove('filtered');c.querySelector('span').innerText=' '+h+'. '+e+' ('+l+' rules, '+n+' issues)';}}}function s(c){if(c.classList.contains('filter-active')){return;}var d=document.getElementsByClassName('filter-active');for(var k=0;k<d.length;k++){d[k].classList.remove('filter-active');}c.classList.add('filter-active');}function r(){var c=document.querySelectorAll('.filtered');for(var i=0;i<c.length;i++){c[i].classList.remove('filtered');}}function f(c){r();if(c==='Total'){return;}var e=document.querySelectorAll('.filterable:not([data-severity="'+c+'"])');for(var i=0;i<e.length;i++){e[i].classList.add('filtered');}}function a(e){s(this);var c=this.getAttribute('data-severity');f(c);u();}function b(){try{var c=document.getElementsByClassName('filter');if(!c){return;}for(var i=0;i<c.length;i++){if(c[i].classList.contains('filter-initialized')){continue;}c[i].addEventListener('click',a);c[i].classList.add('filter-initialized');}}catch(e){console.log('There was a problem initializing filters.');}}return{init:b};}());
