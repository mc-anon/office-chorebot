using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OfficeChorebot.Models;
using Microsoft.Extensions.Options;
using OfficeChorebot.Options;
using Microsoft.AspNetCore.Hosting;

namespace OfficeChorebot.Services
{
    public class Chorebot : IChorebot
    {
        private string _slackApiBaseUrl = "https://slack.com/api/conversations.members";
        private static string[] _slackUsers;
        private static int _lastIndex;
        private FirestoreSettings _firestoreSettings;
        private SlackSettings _slackSettings;
        private IWebHostEnvironment _env;

        public Chorebot(IOptions<FirestoreSettings> firestoreSettings, IOptions<SlackSettings> slackSettings, IWebHostEnvironment env)
        {
            _firestoreSettings = firestoreSettings.Value;
            _slackSettings = slackSettings.Value;
            _env = env;
        }

        public async Task Run()
        {
            string url = $"{_slackApiBaseUrl}?token={_slackSettings.BotUserToken}&channel={_slackSettings.ChannelID}";
            _slackUsers = await SlackAPI.GetChannelMembers(url);
            _lastIndex = _slackUsers.Count() - 1;
            var database = new Database(_firestoreSettings, _env); 
            var chores = await database.GetTodaysChores();
            Task.WaitAll(PostToSlackAsync(chores));
            UpdateLastAssignedUser(chores);
            await database.UpdateLastAssignedUser(chores); 
        }

        private async Task PostToSlackAsync(List<Chore> chores)
        {
            var webhookUrl = new Uri(_slackSettings.WebhookURL);
            var slackClient = new SlackClient(webhookUrl);

            foreach (var chore in chores)
            {
                var targetUser = GetTargetUser(chore);
                var slackMessage = $"Hi {targetUser}! {chore.message}";
                var response = await slackClient.SendMessageAsync(slackMessage); 
                var isValid = response.IsSuccessStatusCode ? "valid" : "invalid";
                Console.WriteLine($"Received {isValid} response.");
            }
        }

        private static string GetTargetUser(Chore chore)
        {
            string targetUser = _slackUsers[0];
            var lastUser = chore.last_assigned_user;

            if (_slackUsers.Contains(lastUser) && Array.IndexOf(_slackUsers, lastUser) != _lastIndex)
            {
                var indexOfLastUser = Array.IndexOf(_slackUsers, lastUser);
                targetUser = _slackUsers[indexOfLastUser + 1];
            }

            return targetUser;
        }

        private static void UpdateLastAssignedUser(List<Chore> chores)
        {
            foreach (var chore in chores)
            {
                var targetUser = GetTargetUser(chore);
                chore.last_assigned_user = targetUser;
            }
        }
    }
}
