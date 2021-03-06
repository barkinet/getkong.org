---
sitemap: true
id: page-plugin
title: Plugins - Basic Authentication
header_title: Basic Authentication
header_icon: /assets/images/icons/plugins/basic-authentication.png
header_btn_text: Report Bug
header_btn_href: https://github.com/Mashape/kong/issues/new
header_btn_target: _blank
breadcrumbs:
  Plugins: /plugins
---

Add Basic Authentication to your APIs, with username and password protection.

---

## Installation

Add the plugin to the list of available plugins on every Kong server in your cluster by editing the [kong.yml][configuration] configuration file

```yaml
plugins_available:
  - basicauth
```

Every node in the Kong cluster must have the same `plugins_available` property value.

---

## Configuration

Configuring the plugin is straightforward, you can add it on top of an [API][api-object] (or [Consumer][consumer-object]) by executing the following request on your Kong server:

```bash
$ curl -X POST http://kong:8001/plugins_configurations/ \
    --data "name=basicauth" \
    --data "api_id=API_ID" \
    --data "value.hide_credentials=true"
```

parameter                    | description
 ---                         | ---
`name`                       | The name of the plugin to use, in this case: `basicauth`
`api_id`                     | The API ID that this plugin configuration will target
`consumer_id`<br>*optional*  | The CONSUMER ID that this plugin configuration will target
`value.hide_credentials`     | Default `false`. An optional boolean value telling the plugin to hide the credential to the final API server. It will be removed by Kong before proxying the request

---

## Usage

### Create a Consumer

You need to associate a credential to an existing [Consumer][consumer-object] object, that represents a user consuming the API. To create a [Consumer][consumer-object] you can execute the following request:

```bash
curl -d "username=user123&custom_id=SOME_CUSTOM_ID" http://kong:8001/consumers/
```

parameter                       | description
 ---                            | ---
`username`<br>*semi-optional*   | The username of the consumer. Either this field or `custom_id` must be specified.
`custom_id`<br>*semi-optional*  | A custom identifier used to map the consumer to another database. Either this field or `username` must be specified.

A [Consumer][consumer-object] can have many credentials.

### Create a Basic Authentication credential

You can provision new username/password credentials by making the following HTTP request:

```bash
curl -d "username=user123&password=secret&consumer_id=CONSUMER_ID" http://kong:8001/basicauth_credentials/
```

parameter                  | description
 ---                       | ---
`username`                 | The username to use in the Basic Authentication
`password`                 | The password to use in the Basic Authentication
`consumer_id`              | The [Consumer][consumer-object] entity to associate the credentials to

[api-object]: /docs/{{site.data.kong_latest.version}}/admin-api/#api-object
[configuration]: /docs/{{site.data.kong_latest.version}}/configuration
[consumer-object]: /docs/{{site.data.kong_latest.version}}/admin-api/#consumer-object
