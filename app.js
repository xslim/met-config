var api_host = "http://localhost:3000";

function el(selector) {
  return document.querySelector(selector);
}

function defaultFor(arg, val) { return typeof arg !== 'undefined' ? arg : val }

function getJSON(url, callback) {
  request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function() {
    if (this.status >= 200 && this.status < 400){
      // Success!
      data = JSON.parse(this.response);
      callback(data);
    } else {
      // We reached our target server, but it returned an error
    }
  };
  request.onerror = function() {
    // There was a connection error of some sort
  };
  request.send();
}

function api_connect() {
  api_host = el("#api_host").value;
  localStorage.setItem('api_host', api_host);
  console.log('Connecting to '+api_host);
  
  getJSON(api_host+'/websites', function(data){
    console.log(data);
  });
  
}

if (localStorage.getItem('api_host')) {
  el("#api_host").value = localStorage.getItem('api_host');
}
