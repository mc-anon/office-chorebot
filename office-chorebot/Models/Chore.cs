using System;
using System.Collections;
using Google.Cloud.Firestore;

namespace OfficeChorebot.Models
{
    [FirestoreData]
    public class Chore
    {
        [FirestoreDocumentId]
        public string Id { get; set; }

        [FirestoreProperty]
        public string title { get; set; }

        [FirestoreProperty]
        public string message { get; set; }

        [FirestoreProperty]
        public string[] days { get; set; }

        [FirestoreProperty]
        public string last_assigned_user { get; set; }
    }
}
