# Logging from Serilog

##### [Thomas Ardal](http://elmah.io/about/), April 10, 2014 in [Tutorials](/category/tutorials/)

> This post has been adapted as part of our official documentation. To read the most updated version, please check out [Logging from Serilog](http://docs.elmah.io/logging-to-elmah-io-from-serilog/)

Serilog is a great addition to the flowering .NET logging community, described as “A no-nonse logging library for the NoSQL era” on their project page. Serilog works as other logging frameworks like log4net and NLog, but offers a great fluent API and the concept of sinks (a bit like appenders in log4net). Sinks are superior to appenders, because they threat errors as objects rather than strings, a perfect fit for elmah.io which itself is build on NoSQL. Serilog already comes with native support for elmah.io, which makes it easy to integrate with any application using Serilog.

In this example we’ll use a ASP.NET MVC project as an example. Neither Serilog nor elmah.io are bound to log errors from web applications, why adding this type of logging to your windows and console applications is just as easy. Add the Serilog.Sinks.ElmahIO NuGet package to your project:

```powershell
Install-Package Serilog.Sinks.ElmahIO
```

During the installation you will be prompted to input your log id, as with any other installation of elmah.io. To configure Serilog, add the following code to the Application_Start method in global.asax.cs (where LOG_ID is your log id):

```csharp
var log =
    new LoggerConfiguration()
        .WriteTo.ElmahIO(new Guid("LOG_ID"))
        .CreateLogger();
Log.Logger = log;
```

First we create a new LoggerConfiguration and tell it to write to elmah.io. The log object can be used to log errors and you should register this in your IoC container. In this case we don’t use IoC, why the log object is set as the public static Logger property, which makes it accessible from everywhere.

When unhandled exceptions occur, ELMAH ships the errors to elmah.io through the elmah.io NuGet package. No Serilog or even magic is happening there. The fun part begins when we log handled exceptions to Serilog:

```csharp
try {
    // Do some stuff which may cause an exception
}
catch (Exception e) {
    Log.Error(e, "The actual error message");
}
```

The Error method tells Serilog to log the error in the configured sinks, which in our case logs to elmah.io. Simple and beautiful.