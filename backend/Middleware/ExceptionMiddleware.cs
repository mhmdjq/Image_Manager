using ImageOverlay.Api.Exceptions;
using System.Net;
using System.Text.Json;

namespace ImageOverlay.Api.Middleware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An unhandled exception has occurred.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        // Map custom exceptions to correct HTTP Status Codes
        context.Response.StatusCode = exception switch
        {
            ImageNotFoundException => (int)HttpStatusCode.NotFound,       // 404
            InvalidImageFormatException => (int)HttpStatusCode.BadRequest, // 400
            _ => (int)HttpStatusCode.InternalServerError                 // 500
        };

        var response = new
        {
            StatusCode = context.Response.StatusCode,
            Message = exception.Message
        };

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }

}