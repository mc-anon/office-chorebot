using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Hosting;
using OfficeChorebot.Models;
using OfficeChorebot.Options;

namespace OfficeChorebot
{
    public class Database
    {
        private readonly FirestoreDb _firestoreDb;
        private FirestoreSettings _firestoreSettings;

        public Database(FirestoreSettings firestoreSettings, IWebHostEnvironment env)
        {
            _firestoreSettings = firestoreSettings;

            var serviceAccountFile = @"serviceAccount.json";

            var path = AppDomain.CurrentDomain.BaseDirectory + serviceAccountFile;
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
            _firestoreDb = FirestoreDb.Create(_firestoreSettings.ProjectID);
        }

        public async Task<List<Chore>> GetTodaysChores()
        {
            var chores = new List<Chore>();
            var today = DateTime.Now.DayOfWeek;
            Query qRef = _firestoreDb.Collection(_firestoreSettings.Collection);
            QuerySnapshot qSnap = await qRef.GetSnapshotAsync();

            foreach (DocumentSnapshot document in qSnap)
            {
                Chore chore = document.ConvertTo<Chore>();
                if (chore.days.Contains(today.ToString()))
                {
                    chores.Add(chore);
                }
            }
            return chores;
        }

        public async Task UpdateLastAssignedUser(List<Chore> chores) 
        {
            foreach (var chore in chores)
            {
                Dictionary<string, object> updatedData = new Dictionary<string, object>()
                {
                    {"last_assigned_user", chore.last_assigned_user }
                };
                DocumentReference docRef = _firestoreDb.Collection(_firestoreSettings.Collection).Document(chore.Id);
                DocumentSnapshot docSnap = await docRef.GetSnapshotAsync();

                if (docSnap.Exists)
                {
                    await docRef.UpdateAsync(updatedData);
                }
            }
        }
    }
}
