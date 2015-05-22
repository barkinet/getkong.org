---
sitemap: true
id: page-plugin
title: Plugins - HTTP Log
header_title: HTTP Log
header_icon: /assets/images/icons/plugins/http-log.png
header_btn_text: Report Bug
header_btn_href: https://github.com/Mashape/kong/issues/new
header_btn_target: _blank
breadcrumbs:
  Plugins: /plugins
---

Log request and response data to a HTTP server

---

## Installation

Add the plugin to the list of available plugins on every Kong server in your cluster by editing the [kong.yml][configuration] configuration file

```yaml
plugins_available:
  - httplog
```

Every node in the Kong cluster should have the same `plugins_available` property value.

## Configuration

Configuring the plugin is straightforward, you can add it on top of an [API][api-object] (or [Consumer][consumer-object]) by executing the following request on your Kong server:

```bash
$ curl -X POST http://kong:8001/plugins_configurations/ \
    --data "name=httplog" \
    --data "api_id=API_ID" \
    --data "value.http_endpoint=http://mockbin.org/bin/:id/" \
    --data "value.method=POST" \
    --data "value.timeout=1000" \
    --data "value.keepalive=1000"
```

parameter                               | description
 ---                                    | ---
`name`                                  | The name of the plugin to use, in this case: `httplog`
`api_id`                                | The API ID that this plugin configuration will target
`consumer_id`<br>*optional*             | The CONSUMER ID that this plugin configuration will target
`value.host`                            | The host name of the http server to send data to
`value.method`                            | Default `POST`. An optional method used to send data to the http server, other supported values are PUT, PATCH
`value.timeout`                         | Default `10000`. An optional timeout in milliseconds when sending data to the final server
`value.keepalive`                       | Default `60000`. An optional value in milliseconds that defines for how long an idle connection will live before being closed

[api-object]: /docs/{{site.data.kong_latest.version}}/admin-api/#api-object
[configuration]: /docs/{{site.data.kong_latest.version}}/configuration
[consumer-object]: /docs/{{site.data.kong_latest.version}}/admin-api/#consumer-object