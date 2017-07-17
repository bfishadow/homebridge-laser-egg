# homebridge-laser-egg
## About
This is a Homebridge plugin to add HomeKit support to the first generation Laser Egg air quality monitors.

Laser Egg is a sleek AQI monitor. However the 1st gen Laser Eggs don’t have HomeKit support, while the newer model does. This plugin will save some money if you don’t need more features but the HomeKit integration.

This plugin was inspired by [https://github.com/ToddGreenfield/homebridge-airnow](https://github.com/ToddGreenfield/homebridge-airnow), a plugin which fetch data through API. The Laser Egg doesn’t have an API. Yet we analyzed the iOS app traffic and find the data points. These data, however, are not encrypted.

@Ohdarling contributed all the codes. @bfishadow found the data source and wrote this readme.

## Usage
1. Install this plugin by `npm install -g homebridge-laser-egg`
2. Update the `config.json` file to add accessory.

## Config
### Get the right ID
Each Laser Egg has a unique UDID. But the API uses another ID called *Laser Egg ID*. You will call manufacturer’s API to get the `laser_egg_id`.
1. Go to Kaiterra app and click *details* icon, a \> in a circle.
2. Click *configure* icon, a gear in a circle.
3. In the *Device Information* section, you will find a blue *copy*. Click on this to copy the UDID string.
4. Visit the this link in Safari: [http://api-ios.origins-china.cn:8080/topdata/getTopByTimeId?timeId=YOUR\_UDID\_HERE](http://api-ios.origins-china.cn:8080/topdata/getTopByTimeId?timeId=YOUR_UDID_HERE) Replace `YOUR_UDID_HERE` with the actual UDID.
5. You will find a JSON dataset. The five digits following "`id`": will be the *Laser Egg ID*. Write it down. You will need this in the Homebridge configuration. 

All step by step screenshots are in the `readme files` folder.
### Sample
Here’s the sample config file. In this case you have two laser eggs in your home. 

```json
{
   "accessories":[
      {
         "accessory":"laser-egg",
         "name":"Laser Egg 1",
         "laser_egg_id":"12345",
         "polling":"5"
      },
      {
         "accessory":"laser-egg",
         "name":"Laser Egg 2",
         "laser_egg_id":"12346",
         "polling":"5"
      }
   ]
}
```

Here are the explanations for each data field. All fields are required.
1. `accessory`  The name of the HomeKit accessory. Use "`laser-egg`" (all lowercase).
2. `name`  The name for the accessory. It will show in the Home app. Don’t make it too long. Otherwise it will be hard to identify.
3. `laser_egg_id`  It will guide the plugin which Laser Egg data to fetch.
4. `polling`  The interval in minutes of fetching data. Five is enough. Please don’t abuse the API.
