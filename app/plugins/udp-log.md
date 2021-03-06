---
sitemap: true
id: page-plugin
title: Plugins - UDP Log
header_title: UDP Log
header_icon: /assets/images/icons/plugins/udp-log.png
header_btn_text: Report Bug
header_btn_href: https://github.com/Mashape/kong/issues/new
header_btn_target: _blank
breadcrumbs:
  Plugins: /plugins
---

Log request and response data to an UDP server

---

## Installation

Add the plugin to the list of available plugins on every Kong server in your cluster by editing the [kong.yml][configuration] configuration file

```yaml
plugins_available:
  - udplog
```

Every node in the Kong cluster should have the same `plugins_available` property value.

## Configuration

Configuring the plugin is straightforward, you can add it on top of an [API][api-object] (or [Consumer][consumer-object]) by executing the following request on your Kong server:

```bash
$ curl -X POST http://kong:8001/plugins_configurations/
    --data "name=udplog" \
    --data "api_id=API_ID" \
    --data "value.host=127.0.0.1" \
    --data "value.port=9999" \
    --data "value.timeout=1000"
```

parameter                     | description
 ---                          | ---
`name`                        | The name of the plugin to use, in this case: `udplog`
`api_id`                      | The API ID that this plugin configuration will target
`consumer_id`<br>*optional*   | The CONSUMER ID that this plugin configuration will target
`value.host`                  | The IP address or host name to send data to
`value.port`                  | The port to send data to on the final server
`value.timeout`               | Default `10000`. An optional timeout in milliseconds when sending data to the final server

[api-object]: /docs/{{site.data.kong_latest.version}}/admin-api/#api-object
[configuration]: /docs/{{site.data.kong_latest.version}}/configuration
[consumer-object]: /docs/{{site.data.kong_latest.version}}/admin-api/#consumer-object
