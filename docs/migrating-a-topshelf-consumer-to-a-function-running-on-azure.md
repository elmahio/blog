---
{
  "disabled": false,
  "bindings": [
    {
      "name": "mySbMsg",
      "type": "serviceBusTrigger",
      "direction": "in",
      "topicName": "mytopic",
      "subscriptionName": "mysubscription",
      "connection": "ConnectionString",
      "accessRights": "Manage"
    }
  ]
}
```

Create a new key beneath `Values` in `appsettings.json` named `connectionString`:

```
{
  ...
  "Values": {
    "AzureWebJobsStorage": "DefaultEndpointsProtocol=https;AccountName=...",
    "AzureWebJobsDashboard": "DefaultEndpointsProtocol=https;AccountName=...",
    "ConnectionString": "Endpoint=sb://..."
  }
}
```

Notice that I've also filled in the `AzureWebJobsStorage` and `AzureWebJobsDashboard` variables with a connection string to a new storage account created on Azure.

Next, I'll move the code from the Topshelf service inside the `run.csx` file:

```csharp
...
using Newtonsoft.Json;
using Mandrill;
using Polly;
...

public static void Run(string mySbMsg, TraceWriter log)
{
	var sendErrorEmailMessage = JsonConvert.DeserializeObject<SendErrorEmailMessage>(mySbMsg);

	var mandrillApi = new MandrillApi("API_KEY");

	Policy
		.Handle<Exception>()
		.WaitAndRetry(3, i => new TimeSpan(0, 0, 0, i * 1))
		.Execute(() =>
		{
			var emailMessage = new EmailMessage
			{
				MergeLanguage = TemplateSyntax.Handlebars,
				Subject = "New error on " + sendErrorEmailMessage.LogName,
				To = new[] { new EmailAddress(emailAddress) }
			};

			// Add dynamic variables
			...
	
			var result =
				await mandrillApi.SendMessageTemplate(new SendMessageTemplateRequest(...));
			
			// Handle result
			...
		});
}

public class SendErrorEmailMessage
{
	...
}
```

The code looks pretty much like before, but without all of the service bus initialization (that I never showed you). Azure Functions handles all of the communication with the topic, completing the message, handling errors etc. Did you notice the file extension? This is actually not C# but C# Script. This means that you no longer need to compile the code and that any error will happen on runtime. You can see this as an advantage or disadvantage, but that's what Microsoft have chosen.

If we would run the Function, it would fail on runtime. The script references some NuGet packages (json.net, Polly etc.). Like ASP.NET Core (when it had a `project.json` file), you can reference NuGet packages in a Function as well:

```json
{
  "frameworks": {
    "net46":{
      "dependencies": {
        "Newtonsoft.Json": "9.0.1",
        "Mandrill": "2.4.181",
        "Polly": "5.0.6"
      }
    }
  }
}
```

The awesome thing about the tooling is, that you can start Function on your own machine. Hit F5 and see magic happen:

![Function in Action](images/migrate_azure_functions_execute.png)

In the next post, I will show you how to deploy the new Function to Azure.