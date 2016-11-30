# Error Logging Middleware in ASP.NET Core

##### [Thomas Ardal](http://elmah.io/about/), December ?, 2016

Most parts of elmah.io consist of small services. While they may not be microservices, they are in fact small and each do one thing. We recently started experimenting with ASP.NET Core (or just Core for short) for some internal services and are planning a number of blog posts about the experiences we have made while developing these services. This is the fifth part in the series. The previous posts are: [AppSettings in ASP.NET Core](appsettings-in-aspnetcore.md), [Config transformations in ASP.NET Core](config-transformations-in-aspnetcore.md), [Configuration with Azure App Services and ASP.NET Core](configuration-with-azure-app-services-and-aspnetcore.md) and [ASP.NET Core Logging Tutorial](aspnetcore-logging-tutorial.md).

This post is about the concept of middleware in Core. We have named the post *Error Logging Middleware in ASP.NET Core*, because we want to use error logging as an example of utilizing middleware. But the concepts around middleware shown in the examples throughout the post isn't bound to error logging in anyway and can be used as a foundation for building all types of middleware.

Middleware is code components executed as part of the request pipeline in Core. If you have a background in ASP.NET (MVC) and think this sounds familiar, you're right. Middleware is pretty much HTTP modules as you know them from ASP.NET. The big difference between modules and middleware is the way you configure each component to run. Modules are configured in `web.config`, but since Core doesn't use the concept of a `web.config`, you configure middleware in C# as part of your `Startup.cs` file. If you know Express for Node.js, you will find that configuring middleware heavily borrow a lot of concepts from that web framework.

Let's wait with more babbling about middleware and look at an example. Middleware in its most simply form, is a C# class. Let's create some error logging middleware:

```csharp
public class ErrorLoggingMiddleware
{
    private readonly RequestDelegate _next;

    public ErrorLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception e)
        {
            System.Diagnostics.Debug.WriteLine($"The following error happened: {e.Message}");
        }
    }
}
```

In order for our middleware to work, we need to implement two things. A constructor accepting a `RequestDelegate` and an `Invoke` method. The contructor is called a single time, but the underlying delegate will change from request to request. All middleware components are responsible for either executing the next link in the pipeline (`_next`) or terminate the pipeline by not calling `_next`. In our case, we want to execute the rest of the pipeline in order to catch any exceptions happening while processing the HTTP request. When an exception is catched, we log a message to `System.Diagnostics.Debug`. In real life you probably want to log somewhere better, but for the demo, we want the exception to show up inside Visual Studio only.

To tell Core about our new and shiny piece of middleware, configure it in `Startup.cs`:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
{
    ...
    app.UseMiddleware<ErrorLoggingMiddleware>();
    ...
}
```

To test the middleware, make the `Index`-method on `HomeController` throw an exception:

```csharp
public class HomeController : Controller
{
    public IActionResult Index()
    {
        throw new Exception("Some error yo");
    }
}
```

When starting the project, the exception is now logged to the Output window in Visual Studio:

![Debug message in output](images/debug_message_in_output.png)

Success! We just implemented our first piece of functional middleware for Core.

While calling the `UseMiddleware<>` method in `Startup.cs` definitely work, it is considered good practice to create a custom `Use`-method:

```csharp
public static class ErrorLoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseErrorLogging(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ErrorLoggingMiddleware>();
    }
}
```

Use the static method in `Startup.cs`:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
{
    ...
    app.UseErrorLogging();
    ----
}
```

In the next post, we will evolve the error logging middleware by looking into more advanced features. For an example on how to implement a full featured error logging middleware component for Core, check out our [elmah.io support for ASP.NET Core](http://docs.elmah.io/logging-to-elmah-io-from-aspnet-core/) on [GitHub](https://github.com/elmahio/Elmah.Io.AspNetCore/blob/master/Elmah.Io.AspNetCore/ElmahIoMiddleware.cs).