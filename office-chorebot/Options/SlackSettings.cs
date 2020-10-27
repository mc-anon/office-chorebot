namespace OfficeChorebot.Options
{
    public class SlackSettings
    {
        public string WebhookURL { get; set; }

        public string BotUserToken { get; set; }

        public string ChannelID { get; set; }

        public SlackSettings()
        {
        }
    }
}
