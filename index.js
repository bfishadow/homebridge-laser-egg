'use strict';
//
// Homebridge config.json sample, use following lines to add accessories.
// In this case you have two Laser Eggs in your house:
//
//  "accessories": [
//      {
//          "accessory": "laser-egg",
//          "name": "Laser Egg 1",
//          "laser_egg_id": "12345",
//          "polling": "5"
//      },
//      {
//          "accessory": "laser-egg",
//          "name": "Laser Egg 2",
//          "laser_egg_id": "12346",
//          "polling": "5"
//      }
//  ],
//
var lowerCase = require('lower-case');
var request = require('request');
var striptags = require('striptags');
var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory(
    'homebridge-laser-egg',
    'laser-egg',
    LaserEggAccessory
  );
};

function LaserEggAccessory(log, config) {
  this.log = log;
  this.name = config['name'];
  this.provider = lowerCase(config['provider']) || 'laser-egg';
  this.laser_egg_id = config['laser_egg_id'];
  this.laser_egg_key = config['laser_egg_key'];
  this.mpolling = config['polling'] || '0';
  this.polling = this.mpolling;

  if (!this.laser_egg_id) {
    throw new Error(
      "Laser Egg - You must provide a config value for 'laser_egg_id'."
    );
  }

  if (!this.laser_egg_key) throw new Error("Laser Egg - You must provide a config value for 'laser_egg_key'.");
  
  if (this.polling > 0) {
    var that = this;
    this.polling *= 60000;
    setTimeout(function() {
      that.servicePolling();
    }, this.polling);
  }

  this.log.info(
    'Laser Egg Polling (minutes) is: %s',
    this.polling === '0' ? 'OFF' : this.mpolling
  );
}

LaserEggAccessory.prototype = {
  servicePolling: function() {
    this.log.debug('Laser Egg Polling...');
    this.getObservation(
      function(p) {
        var that = this;
        that.airQualityService.setCharacteristic(Characteristic.AirQuality, p);
        setTimeout(function() {
          that.servicePolling();
        }, that.polling);
      }.bind(this)
    );
  },

  getAirQuality: function(callback) {
    this.getObservation(function(a) {
      callback(null, a);
    });
  },

  getObservation: function(callback) {
    var that = this;
    var url, pm2_5;

    url = "https://api.kaiterra.cn/v1/lasereggs/" + this.laser_egg_id + "?key=" + this.laser_egg_key;

    request(
      {
        url: url,
        json: true,
      },
      function(err, response, jsonObject) {
            if (!err && response.statusCode === 200 && String(jsonObject.id) === String(that.laser_egg_id)){
                that.log.debug("Laser Egg PM2.5: %d, PM10: %d", jsonObject["info.aqi"]["data"]["pm25"], jsonObject["info.aqi"]["data"]["pm10"]);
                that.airQualityService.setCharacteristic(Characteristic.StatusFault,0);
                if (jsonObject["info.aqi"]["data"].hasOwnProperty('pm25')) {
                    that.airQualityService.setCharacteristic(Characteristic.PM2_5Density, jsonObject["info.aqi"]["data"]["pm25"]);
                    pm2_5 = jsonObject["info.aqi"]["data"]["pm25"];
                }
                if (jsonObject["info.aqi"]["data"].hasOwnProperty('pm10')) {
                    that.airQualityService.setCharacteristic(Characteristic.PM10Density, jsonObject["info.aqi"]["data"]["pm10"]);
                }
        } else {
          that.log.error('Laser Egg Unknown Error from %s.', that.provider);
          that.airQualityService.setCharacteristic(
            Characteristic.StatusFault,
            1
          );
        }
        var aqi = that.calcAQI(pm2_5);
        that.log.debug('Laser Egg AQI: %d', aqi);
        callback(that.trans_aqi(aqi));
      }
    );
  },

  trans_aqi: function(aqi) {
    if (!aqi) {
      return 0; // Error or unknown response
    } else if (aqi <= 50) {
      return 1; // Return EXCELLENT
    } else if (aqi >= 51 && aqi <= 100) {
      return 2; // Return GOOD
    } else if (aqi >= 101 && aqi <= 150) {
      return 3; // Return FAIR
    } else if (aqi >= 151 && aqi <= 200) {
      return 4; // Return INFERIOR
    } else if (aqi >= 201) {
      return 5; // Return POOR
    } else {
      return 0; // Error
    }
  },

  calcAQI: function(pm2_5) {
    function Linear(AQIhigh, AQIlow, Conchigh, Conclow, Concentration) {
      var linear;
      var Conc = parseFloat(Concentration);
      var a;
      a = (Conc - Conclow) / (Conchigh - Conclow) * (AQIhigh - AQIlow) + AQIlow;
      linear = Math.round(a);
      return linear;
    }

    function getAQI(intPM25) {
      var Conc = parseFloat(intPM25);
      var c;
      var AQI;
      c = Math.floor(10 * Conc) / 10;
      if (c >= 0 && c < 12.1) {
        AQI = Linear(50, 0, 12, 0, c);
      } else if (c >= 12.1 && c < 35.5) {
        AQI = Linear(100, 51, 35.4, 12.1, c);
      } else if (c >= 35.5 && c < 55.5) {
        AQI = Linear(150, 101, 55.4, 35.5, c);
      } else if (c >= 55.5 && c < 150.5) {
        AQI = Linear(200, 151, 150.4, 55.5, c);
      } else if (c >= 150.5 && c < 250.5) {
        AQI = Linear(300, 201, 250.4, 150.5, c);
      } else if (c >= 250.5 && c < 350.5) {
        AQI = Linear(400, 301, 350.4, 250.5, c);
      } else if (c >= 350.5 && c < 500.5) {
        AQI = Linear(500, 401, 500.4, 350.5, c);
      } else {
        AQI = '555'; //Crazy bad for 555
      }
      return AQI;
    }

    return getAQI(pm2_5);
  },

  identify: function(callback) {
    this.log('Identify requested!');
    callback(); // success
  },

  getServices: function() {
    var services = [];
    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Laser Egg')
      .setCharacteristic(Characteristic.Model, 'Laser Egg')
      .setCharacteristic(
        Characteristic.SerialNumber,
        'Polling: ' + this.mpolling
      );
    services.push(informationService);

    this.airQualityService = new Service.AirQualitySensor(this.name);
    this.airQualityService
      .getCharacteristic(Characteristic.AirQuality)
      .on('get', this.getAirQuality.bind(this));
    this.airQualityService.addCharacteristic(Characteristic.StatusFault); // Used if unable to connect to AQI services
    this.airQualityService.addCharacteristic(Characteristic.PM2_5Density);
    this.airQualityService.addCharacteristic(Characteristic.PM10Density);
    services.push(this.airQualityService);

    return services;
  },
};
