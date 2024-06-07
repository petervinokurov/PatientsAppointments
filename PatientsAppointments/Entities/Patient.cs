using System.Collections.Generic;

namespace PatientsAppointments.Entities
{
    public class Patient
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public IEnumerable<Appointment> Appointments { get; set; }
    }
}