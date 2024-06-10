using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using PatientsAppointments.Entities;
using PatientsAppointments.Entities.Context;
using PatientsAppointments.Responses;

namespace PatientsAppointments.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class PatientsController : Controller
    {
        private readonly IDataProvider _dataProvider;
        public PatientsController(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }
        
        // GET
        public ApplicationResponse<Patient> PatientsList(int page, string query)
        {
            const int pageSize = 10;

            IEnumerable<Patient> queryablePatients = _dataProvider.Patients;

            if (!string.IsNullOrEmpty(query))
            {
                int.TryParse(query, out int parsedId);
                queryablePatients = queryablePatients.Where(p => p.Name.Contains(query) || p.Id == parsedId);
            }
            var materializedPatients = queryablePatients.ToList();

            int totalCount = materializedPatients.Count();

            List<Patient> patients = materializedPatients
                .OrderBy(x => x.ClosestAppointment.AppointmentDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            int totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var result = new ApplicationResponse<Patient>
            {
                Items = patients,
                TotalPages = totalPages
            };

            return result;
        }
    }
}