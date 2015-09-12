# Logging from BlogEngine.NET

##### [Thomas Ardal](http://elmah.io/about/), March 9, 2014 in [Tutorials](/category/tutorials/)

> This post has been adapted as part of our official documentation. To read the most updated version, please check out [Logging from BlogEngine.NET](http://docs.elmah.io/logging-to-elmah-io-from-blogengine-net/)

Because BlogEngine.NET is written in ASP.NET, it doesn’t really need any custom code to use ELMAH and elmah.io. In fact ELMAH works out of the box for most web frameworks by Microsoft. If you are building and deploying the code yourself, installing elmah.io is achieved using our NuGet package:

```powershell
Install-Package elmah.io
```

During the installation you need to input your log id, located in the settings. When installed, BlogEngine.NET starts reporting errors to elmah.io. To check it out, force an internal server error or similar, and visit /elmah.axd or the search area of your log at elmah.io.

Some of you may use the BlogEngine.NET binaries or even installed it using a one-click installer. In this case you will need to add elmah.io manually. To do that, use a tool like NuGet Package Explorer to download the most recent versions of ELMAH and elmah.io. Copy Elmah.dll and Elmah.Io.dll to the bin directory of your BlogEngine.NET installation. Also modify your web.config to include the ELMAH config as shown in the config example. Last but not least, remember to add the elmah.io error logger configuration as a child node to the ```<elmah>``` element:

```xml
<errorLog type="Elmah.Io.ErrorLog, Elmah.Io" LogId="LOG_ID" />
```

Where LOG_ID is your log id, located on the settings page.

To wrap this up, you may have noticed that there’s a [NuGet package](https://www.nuget.org/packages/Elmah.BlogEngine.Net/) to bring ELMAH support into BlogEngine.NET. This package adds the ELMAH assembly and config as well as adds a nice BlogEngine.NET compliant URL for browsing errors. Feel free to use this package, but remember to add it after the elmah.io package. Also make sure to cleanup the dual error log configuration:

```xml
<elmah>
  <security allowRemoteAccess="false" />
  <errorLog type="Elmah.Io.ErrorLog, Elmah.Io" LogId="LOGID" />
  <security allowRemoteAccess="true" />
  <errorLog type="Elmah.SqlServerCompactErrorLog, Elmah" connectionStringName="elmah-sqlservercompact" />
</elmah>
```