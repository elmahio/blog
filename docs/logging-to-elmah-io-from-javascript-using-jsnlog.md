# Logging from JSNLog

##### [Thomas Ardal](http://elmah.io/about/), August 29, 2014 in [Tutorials](/category/tutorials/)

> This post has been adapted as part of our official documentation. To read the most updated version, please check out [Logging from JSNLog](http://docs.elmah.io/logging-to-elmah-io-from-jsnlog/)


Using JSNLog you will be able to log JavaScript errors to elmah.io. In this sample, we will focus about logging JavaScript errors from a ASP.NET MVC web application, but you can use JSNLog to log anything to elmah.io, so please check out their documentation.

Start by installing the JSNLog.Elmah package:

```powershell
Install-Package JSNLog.Elmah
```

This installs and setup JSNLog into your project, using ELMAH as an appender. Then install elmah.io:

```powershell
Install-Package elmah.io
```

Remember to input a valid log id during the installation. Add the JSNLog code before any script imports in your _Layout.cshtml file:

```csharp
@Html.Raw(JSNLog.JavascriptLogging.Configure())
```

You are ready to log errors from JavaScript til elmah.io. To test that everything is installed correctly, launch your web application and execute the following JavaScript using Chrome Developer Tools or similar:

```javascript
JL().fatal("log message");
```

Navigate to you log at elmah.io and observe the new error. As you can see, logging JavaScript errors is now extremely simple and can be build into any try-catch, jQuery fail handlers and pretty much anywhere else. To log every JavaScript error, add the following to the bottom of the _Layout.cshtml file:

```javascript
<script>
window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
 
    // Send object with all data to server side log, using severity fatal,
    // from logger "onerrorLogger"
    JL("onerrorLogger").fatalException({
        "msg": "Exception!",
        "errorMsg": errorMsg, "url": url,
        "line number": lineNumber, "column": column
    }, errorObj);
         
    // Tell browser to run its own error handler as well  
    return false;
}
</script>
```

