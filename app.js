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

function postJSON(url, payload, callback) {
  request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader("Content-Type", "application/json");
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
  request.send(JSON.stringify(payload));
}

function sendDelete(url, callback) {
  request = new XMLHttpRequest();
  request.open('DELETE', url, true);
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
    //console.log(data);
    var html = "";
    
    var i;
    var odd = "odd";
    for (i = 0; i < data.length; i++) { 
      var d = data[i];
      html += '<tr class="'+odd+'">';
      html += '<td><a href="#" data-toggle="modal" data-target="#wsModal" data-id="'+d._id+'">'+d._id+'</a></td>';
      html += '<td>'+d.url+'</td><td>'+d.added+'</td><td>'+d.locked+'</td><td>'+d.updated+'</td>';
      html += "</tr>\n";
      if (odd == "odd") {odd = "even"};
    }
    
    el("#data_t_body").innerHTML = html;
  });
  
}

if (localStorage.getItem('api_host')) {
  el("#api_host").value = localStorage.getItem('api_host');
}

$('#wsModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var id = button.data('id') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  
  if (id && id.length > 1) {
    modal.find('.modal-title').text('Editing ' + id);
  
  getJSON(api_host+'/websites/'+id, function(d){
    modal.find('.modal-body #ws-id').val(id); 
    modal.find('.modal-body #ws-url').val(d.url); 
    modal.find('.modal-body #ws-depth').val(d.depth);
    modal.find('.modal-body #ws-topn').val(d.topn);
    modal.find('.modal-body #ws-indexName').val(d.indexName);
    modal.find('.modal-body #ws-regex').val(d.regex);
  });
  } else {
    modal.find('.modal-title').text('Creating new website ');
    modal.find('.modal-body #ws-url').val('http://'); 
    modal.find('.modal-body #ws-depth').val(2);
    modal.find('.modal-body #ws-topn').val(50);
    modal.find('.modal-body #ws-indexName').val('website');
  }
  
  
  
})

function saveAction() {
  var modal = $('#wsModal');
  var id = modal.find('.modal-body #ws-id').val();
  var payload = {
    url: modal.find('.modal-body #ws-url').val(),
  };
  postJSON(api_host+'/websites/'+id, payload, function(data){
    //console.log(data);
    $('#wsModal').modal('hide');
    api_connect();
  });
}

function deleteAction() {
  var modal = $('#wsModal');
  var id = modal.find('.modal-body #ws-id').val();
  
  sendDelete(api_host+'/websites/'+id, function(data){
    $('#wsModal').modal('hide');
    api_connect();
  });
}
