using System.Collections.Generic;

namespace PatientsAppointments.Entities.Context
{
    public interface IDataProvider
    {
        IEnumerable<Patient> Patients { get; set; }
    }
}