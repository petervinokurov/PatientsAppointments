using System.Collections.Generic;
using Bogus;

namespace PatientsAppointments.Entities.Context
{
    public class DataProvider : IDataProvider
    {
        public IEnumerable<Patient> Patients { get; set; }

        public DataProvider()
        {
            var meetingTypes = new List<MeetingType>()
            {
                new() { Id = 1, Name = "Regular" },
                new() { Id = 2, Name = "Emergency" },
                new() { Id = 3, Name = "Scheduled" }
            };

            var appointmentId = 1; 
            var appointmentFaker = new Faker<Appointment>()
                .RuleFor(u => u.Id, f => appointmentId++)
                .RuleFor(u => u.AppointmentDate, f => f.Date.Future())
                .RuleFor(u => u.MeetingType, f => f.PickRandom(meetingTypes));
            
            var patientId = 1;
            var patientFaker = new Faker<Patient>()
                .RuleFor(u => u.Id, f => patientId++)
                .RuleFor(u => u.Name, f => f.Name.FullName())
                .RuleFor(u=>u.Appointments, f => appointmentFaker.Generate(f.Random.Int(5,10)));
            
            Patients = patientFaker.Generate(10000);
        }
    }
}