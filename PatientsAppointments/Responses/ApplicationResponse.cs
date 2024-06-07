using System.Collections.Generic;

namespace PatientsAppointments.Responses
{
    public class ApplicationResponse<T> where T: class
    {
        public IEnumerable<T> Items { get; set; }

        public int TotalPages { get; set; }
    }
}