using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using OfficeChorebot.Models;

namespace OfficeChorebot
{
    public class SlackAPI 
    {
        private static readonly HttpClient _httpClient = new HttpClient();

        public static async Task<string[]> GetChannelMembers(string requestUri)
        {
            var response = await _httpClient.GetAsync(requestUri);
            var json = await response.Content.ReadAsStringAsync();
            var channel = JsonConvert.DeserializeObject<Channel>(json);

            return FormatForSlack(channel.Members);
        }

        private static string[] FormatForSlack(string[] members)
        {
            return members.Select(member => $"<@{member}>").ToArray();
        }
    }
}
