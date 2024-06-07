using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using PatientsAppointments.Entities;
using PatientsAppointments.Entities.Context;

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
        public IEnumerable<Patient> GetPatients()
        {
            return _dataProvider.Patients;
        }
    }
}