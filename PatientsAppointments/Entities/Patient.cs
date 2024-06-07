using System;
using System.Collections.Generic;
using System.Linq;

namespace PatientsAppointments.Entities
{
    public class Patient
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public IEnumerable<Appointment> Appointments { get; set; } = new List<Appointment>();

        public Appointment ClosestAppointment
        {
            get
            {
                return Appointments.OrderByDescending(x => x.AppointmentDate).FirstOrDefault();
            }
        }
    }
}