# homebridge-laser-egg
This is the original work of @bfishadow and others mentioned at https://github.com/bfishadow/homebridge-laser-egg
This fork updates the plugin for API changes made by kaiterra. Below is the updated isntructions

## About
This is a [Homebridge](https://github.com/nfarina/homebridge) plugin to add HomeKit support to the first generation [Laser Egg air quality monitors](http://originstech.com/products/laseregg/).
Laser Egg is a sleek AQI monitor. However the 1st gen Laser Eggs don’t have HomeKit support, while the newer model does. This plugin will save some money if you don’t need more features but the HomeKit integration.

## Usage
1. Install this plugin by `npm install -g homebridge-laser-egg`
2. Update the `config.json` file to add accessory.

## Config
### Getting the UDID & API key
To get this plugin to work you will need your device's unique ID (UDID) and API key from the kaiterra website. You can get both by following the below:

1. I am assuming you've already got the device working and added to the kaiterra/live air app.
2. Go to the Kaiterra app and click on the *gear* icon.
3. Under device and firmware version, you will find your UDID. Note this down.
4. Now go to https://dashboard.kaiterra.com/login and login with your credentials
5. Go to account settings, and generate an API key. Note this down

### Sample config
Here’s the sample config fileb

```json
{
    "accessories": [
        {
            "accessory": "laser-egg",
            "name": "Laser Egg",
            "laser_egg_id": "YOUR_UDID_HERE",
            "laser_egg_key": "YOUR_API_KEY_HERE",
            "polling": "5"
        }
]
```

Here are the explanations for each data field. All fields are required.
1. `accessory`  The name of the HomeKit accessory. Use "`laser-egg`" (all lowercase).
2. `name`  The name for the accessory. It will show in the Home app. Don’t make it too long. Otherwise it will be hard to identify.
3. `laser_egg_id`  This is your device's unique ID i.e. UDID
4. `laser_egg_key` This is the API access key you generated from the kaiterra website. 
5. `polling`  The interval in minutes of fetching data. Five is enough. Please don’t abuse the API.
