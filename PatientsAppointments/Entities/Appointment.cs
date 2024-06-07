using System;

namespace PatientsAppointments.Entities
{
    public class Appointment
    {
        public int Id { get; set; }

        public DateTime? AppointmentDate { get; set; }

        public MeetingType MeetingType { get; set; }
    }
}