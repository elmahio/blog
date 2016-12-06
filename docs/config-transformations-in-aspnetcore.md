# Config transformations in ASP.NET Core

If no environment variable with that name is found, Core automatically uses the value `Production`. Let's start the project to see the value used in the web app:

![ASP.NET Core website with config variable](images/my_core_website.png)

Wait a minute. We just added the `appsettings.Production.json` file and I told you that a value of `Production` is used if no environment variable named `ASPNETCORE_ENVIRONMENT` is specified. Why don't we see the value of `from production` then? Say hello to `launchSettings.json`. The `launchSettings.json` file (located in the `Properties` folder) contains a list of different profiles used to tell Visual Studio how to host and run your website. I won't go into more details about `launchSettings.json` in this post but in short, the profiles end up in this dropdown:

![ASP.NET Core profiles](images/aspnetcore_profiles.png)

By right clicking the project and selecting _Properties_ or by simply opening `launchSettings.json`, you will see the list of profiles:

```json
{
  ...
  "profiles": {
    "IIS Express": {
      "commandName": "IISExpress",
      "launchBrowser": true,
      "environmentVariables": {
         "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "WebApplication14": {
      "commandName": "Project",
      "launchBrowser": true,
      "launchUrl": "http://localhost:5000",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

Both profiles define an environment variable named `ASPNETCORE_ENVIRONMENT` with the value of `Development`. Since we don't have a file named `appsettings.Development.json`, the default values in `appsettings.json` is used.

To test the production variables, replace the value of `ASPNETCORE_ENVIRONMENT` with `Production` and restart the browser:

![ASP.NET Core using appsettings.Production.json](images/aspnetcore_using_production.png)

Change back to `Development`, since we don't want to use production variables on the development environment. In the next post, we'll discuss how to deploy ASP.NET Core with transformations to Azure.