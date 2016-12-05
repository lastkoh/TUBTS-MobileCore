var API_URL = "https://fyp-postgrest.herokuapp.com/"

function parseTimeStr(timeStr) {
  var d = new Date();
  var time = timeStr.split(':');
  d.setHours(parseInt(time[0]));
  d.setMinutes(parseInt(time[1]));
  d.setSeconds(parseInt(time[2]));

  return d;
}

function toStrParams(params) {
  var str = '?';
  for (var key in params) {
    var paramStr = key + '=' + params[key] + '&'
    str += paramStr;
  }

  return str.substring(0, str.length - 1);
}

function toTimeStr(now) {
  return now.getHours() + ":" + now.getMinutes() + ":00";
}

onmessage = function(e) {
  var json = JSON.parse(e.data);
  var xhr = new XMLHttpRequest();
  var payload = {
    'route_id': 'eq.' + json.route_id,
    'order': 'trigger_time.asc',
    'trigger_time': 'eq.' + toTimeStr(new Date())
  };
  xhr.open("GET", API_URL + "simulation" + toStrParams(payload), true);
  xhr.onload = function(e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var result = JSON.parse(xhr.responseText);
        console.log(result);
        if (result.length !== 0) {
          postMessage(JSON.stringify(result[result.length - 1]));
        } else {
          postMessage(null);
        }
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.onerror = function(e) {
    console.error(xhr.statusText);
  };
  xhr.send(null);
}