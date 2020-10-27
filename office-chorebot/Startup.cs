using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Hangfire;
using Hangfire.MemoryStorage;
using OfficeChorebot.Services;
using Microsoft.Extensions.Configuration;
using OfficeChorebot.Options;

namespace OfficeChorebot
{
    public class Startup
    {
        public IConfiguration Configuration { get; set; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHangfire(config =>
                config.SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseDefaultTypeSerializer()
                .UseMemoryStorage());
            services.AddHangfireServer();

            services.Configure<FirestoreSettings>(Configuration.GetSection("Firestore"));
            services.Configure<SlackSettings>(Configuration.GetSection("Slack"));
            services.AddTransient<IChorebot, Chorebot>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(
            IApplicationBuilder app,
            IWebHostEnvironment env,
            IRecurringJobManager recurringJobManager,
            IServiceProvider serviceProvider
            )
        {
            app.UseHttpsRedirection();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    await context.Response.WriteAsync("SB Slackbot is running...");
                });
            });

            app.UseHangfireDashboard();

            recurringJobManager.AddOrUpdate(
                "Post The Day's Chores To Slack",
                () => serviceProvider.GetService<IChorebot>().Run(),
                Configuration.GetValue<string>("JobFrequency"));   
        }
    }
}
