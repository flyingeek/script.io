var http = require("http");
var log = require("log");
var cache = require("/lib/cache");
log.setLevel("DEBUG"); //levels are ERROR | WARN | INFO | DEBUG | OFF
var frames = [];
var icon = "a3361";
var location = request.parameters.location || "333180";
function meteo1Request() {
    return http.request({
            "url": "http://ws.meteofrance.com/ws/getPluie/" + location + "0.json",
            "params": {}
    });
}
var api = cache.getCache(meteo1Request, "meteo1h_" + location, 300, 300);
var api = meteo1Request();
if (api.status != 200) {
        frames.push({"text": "ERROR", "icon": icon});
} else {
        var json = JSON.parse(api.body);
        var data = json["result"]['intervalles'];
        var data5 = [];
        data5.push(data[0].value);//0 0-5
        data5.push(data[1].value);//1 5-10
        data5.push(data[2].value);//2 10-15
        data5.push(data[3].value);//3 15-20
        data5.push(data[4].value);//4 20-25
        data5.push(data[5].value);//5 25-30
        data5.push(data[6].value);//6 30-35
        data5.push(data[7].value);//7 35-40
        data5.push(data[7].value);//8 40-45
        data5.push(data[8].value);//9 45-50
        data5.push(data[8].value);//10 50-55
        data5.push(data[9].value);//11 55-60
        data5.push(data[9].value);//12 60-65
        var chartData = data5.map(function(v) {
                var level = parseInt(v, 10);
                return (level <= 1) ? 0 : level * 2;
        });
        var delay = chartData.findIndex(function(v) {
             return v >= 2;
        });
        var chartFrame = {"index": 0, "chartData": chartData};
        if (delay === 0) {
                frames.push({"text": "NOW !", "icon": icon});
                frames.push(chartFrame);
        } else if (delay < 0) {
                frames.push({"text": "+ 1H", "icon": "i" + icon.substring(1)});
        } else {
                frames.push({"text": (delay * 5).toString(10) + " MN", "icon": icon});
                frames.push(chartFrame);
        }                             
}
response.addHeaders(configuration.crossDomainHeaders);
response.write(JSON.stringify({"frames": frames}));
response.close();
