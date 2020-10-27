using System;
using Newtonsoft.Json;

namespace OfficeChorebot.Models
{
    public class Channel
    {
        [JsonProperty("members")]
        public string[] Members { get; set; }
    }
}
