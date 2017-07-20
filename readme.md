# homebridge-laser-egg
Scroll down for Chinese.

## About
This is a [Homebridge](https://github.com/nfarina/homebridge) plugin to add HomeKit support to the first generation [Laser Egg air quality monitors](http://originstech.com/products/laseregg/).

Laser Egg is a sleek AQI monitor. However the 1st gen Laser Eggs don’t have HomeKit support, while the newer model does. This plugin will save some money if you don’t need more features but the HomeKit integration.

This plugin was inspired by [homebridge-airnow](https://github.com/ToddGreenfield/homebridge-airnow), a plugin which fetch data through API. The Laser Egg doesn’t have an API. Yet we analyzed the iOS app traffic and find the data points. These data, however, are not encrypted.

[@ohdarling88](https://twitter.com/ohdarling88) contributed all the codes. [@bfishadow](https://twitter.com/bfishadow) found the data source and wrote this readme.

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
5. You will find a JSON dataset. The five digits following `"id":` will be the *Laser Egg ID*. Write it down. You will need this in the Homebridge configuration. 

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

# homebridge-laser-egg
## 关于
这是一个为第一代[镭豆空气质量监测器](http://originstech.com/products/laseregg/?lang=zh-hans)增加 HomeKit 支持的 [Homebridge](https://github.com/nfarina/homebridge) 插件。

“镭豆”是一个好用且漂亮的空气质量监测器。但第一代镭豆产品并没有支持苹果的 HomeKit，较新的型号才有。如果你不需要新款镭豆的其他功能，只需要 HomeKit 支援，又想省点钱，那么请使用本插件。

这个插件的灵感来自 [homebridge-airnow](https://github.com/ToddGreenfield/homebridge-airnow) 插件，它通过读取第三方 API 接口获取数据。虽然镭豆并没有开放 API 接口，但我们分析了 iOS 应用的流量，找到了数据源。更有趣的是，这些数据并未加密。

于是，[@ohdarling88](https://twitter.com/ohdarling88) 写了所有的代码，发现数据源的 [@bfishadow](https://twitter.com/bfishadow) 撰写了本教程。

## 用法
1. 通过这个指令安装本插件：`npm install -g homebridge-laser-egg`；
2. 修改 `config.json` 配置文件增加设备。

## 配置
### 取得正确的 ID
每一款镭豆都有一个独立的 UDID，但他们的 API 却在使用另一个称为 *Laser Egg ID* 的 ID。因此，你需要调用一次厂商的 API 来获取 `laser_egg_id` 才可以，详细步骤如下：
1. 打开“呼吸之间”应用（又名 Kaiterra），点击 *详情* 图标，看上去是一个带有 \> 的圆形。
2. 点击 *配置* 图标，看上去是一个带有齿轮的圆形。
3. 在 *设备信息* 部分，你能看到蓝色的 *复制* 字样，点击它就可以将 UDID 字符串复制到剪贴板。
4. 通过 Safari 访问以下链接： [http://api-ios.origins-china.cn:8080/topdata/getTopByTimeId?timeId=YOUR\_UDID\_HERE](http://api-ios.origins-china.cn:8080/topdata/getTopByTimeId?timeId=YOUR_UDID_HERE) 请将链接中的 `YOUR_UDID_HERE` 换成上一步复制到的 UDID 字符串。
5. 此时你应该能看到一组 JSON 数据，跟在 `"id":` 之后的那串数字就是 *Laser Egg ID*。请将它复制下来，接下来的配置过程中会用到。

如果有困难，可以参考 `readme files` 文件夹里的截屏，有详细的指导。
### 配置示例
以下是一个配置文件的部分，假设你家有两台镭豆。

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

以下是各个字段的含义，所有字段都是必须填写的。
1. `accessory`  HomeKit 配件的名称，这里必须使用 "`laser-egg`" （全部为小写字母）。
2. `name`  设备的名字（或昵称），这将显示在 Home 应用里。请不要设置得过长，以免被截断之后难以确认设备的位置。
3. `laser_egg_id`  这将告诉插件应该去获取哪一个镭豆的数据。
4. `polling`  数据抓取的间隔，以分钟为单位。我们认为五分钟已经足够，请不要滥用数据接口。
