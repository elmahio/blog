---
description: TODO
image: images/TODO.png
calltoaction: Start monitoring Functions
---

# Supporting Azure Functions and WebJobs

##### [Thomas Ardal](http://elmah.io/about/), November 14, 2017
 
Ensuring that elmah.io works great with any web and logging framework for .NET, is a key priority for us. Serverless development using Azure Functions and WebJobs (as well as AWS Lambdas) have gained a lot of traction during the last years. Logging errors from Functions and WebJobs have been supported using our API client for a while, but today we are ready to introduce native support. Let me introduce you to [Elmah.Io.Functions](https://www.nuget.org/packages/Elmah.Io.Functions/).
 
With the `Elmah.Io.Functions` NuGet package, logging errors from Azure Functions and WebJobs requires only a single line of code. In the following example, I'm logging all errors happening in a timed function. Start by installing the `Elmah.Io.Functions` package:
 
```powershell
Install-Package Elmah.Io.Functions -Pre
```

And now for the code:

```csharp
[ElmahIoExceptionFilter("API_KEY", "LOG_ID")]
public static class Function1
{
    [FunctionName("Function1")]
    public static void Run([TimerTrigger("0 */1 * * * *")]TimerInfo myTimer, TraceWriter log)
    {
        // Your business logic goes here
    }
}
```

Look ma, no try catch! That's right. The `ElmahIoExceptionFilter` attribute automatically logs all unhandled exceptions in your business logic.

As always, let us know if you need help integrating elmah.io into your Function/WebJobs project. We're here to help.