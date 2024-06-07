using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using PatientsAppointments.Entities;
using PatientsAppointments.Entities.Context;
using PatientsAppointments.Responses;

namespace PatientsAppointments.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : Controller
    {
        private readonly IDataProvider _dataProvider;
        public PatientsController(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }
        
        // GET
        public ApplicationResponse<Patient> GetPatients(int pageNumber)
        {
            return new ApplicationResponse<Patient>
            {
                TotalPages = _dataProvider.Patients.Count() / 10,
                Items = _dataProvider.Patients.OrderBy(x => x.ClosestAppointment.AppointmentDate).Skip((pageNumber - 1) * 10).Take(10).ToList()
            };
        }
    }
}