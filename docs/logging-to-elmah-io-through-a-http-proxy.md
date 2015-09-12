# Logging through a HTTP proxy

##### [Thomas Ardal](http://elmah.io/about/), September 23, 2014 in [Tutorials](/category/tutorials/)

> This post has been adapted as part of our official documentation. To read the most updated version, please check out [Logging through a HTTP proxy](http://docs.elmah.io/logging-through-a-http-proxy/)

You may find yourself in a situation, where your production web servers isn’t allowed HTTP requests towards the public internet. This also impacts the elmah.io client, which requires access to the URL https://elmah.io/api. A popular choice of implementing this kind of restriction nowadays, seem to be through a HTTP proxy like squid.

Luckily the elmah.io client supports proxy configuration out of the box. Let’s look at how to configure a HTTP proxy through `web.config`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <configSections>
    <sectionGroup name="elmah">
      <section name="security" requirePermission="false" type="Elmah.SecuritySectionHandler, Elmah" />
      <section name="errorLog" requirePermission="false" type="Elmah.ErrorLogSectionHandler, Elmah" />
      <section name="errorMail" requirePermission="false" type="Elmah.ErrorMailSectionHandler, Elmah" />
      <section name="errorFilter" requirePermission="false" type="Elmah.ErrorFilterSectionHandler, Elmah" />
    </sectionGroup>
  </configSections>
  <elmah>
    <security allowRemoteAccess="false" />
    <errorLog type="Elmah.Io.ErrorLog, Elmah.Io" LogId="59AA232A-F80A-4414-801D-F305D8AE55D7" />
  </elmah>
  <system.net>
    <defaultProxy>
      <proxy usesystemdefault="True" proxyaddress="http://192.168.0.1:3128" bypassonlocal="False"/>
    </defaultProxy>
  </system.net>
</configuration>
```

The above example is of course greatly simplified.

The elmah.io client automatically picks up the `defaultProxy` configuration through the `system.net` element. `defaultProxy` tunnels every request from your server, including requests to elmah.io, through the proxy located on 192.18.0.1 port 3128 (or whatever IP/hostname and port your are using).