using CandellaServer;
using static CandellaServer.Helpers.MapperInitalizer;

namespace Candella
{
    public class Program
    {
        public static void Main(string[] args)
        {
            MapperInitializer.Initialize();
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}