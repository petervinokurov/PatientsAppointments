import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const PatientsListComponent = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
  	const [totalPages, setTotalPages] = useState(1);

  	const pageSize = 10; // Number of items per page

  
	useEffect(() => {
	  // Define the fetchData function to get data from the API
	  const fetchData = async (page) => {
		try {
		  const response = await axios.get(`https://localhost:5001/api/patients?pageNumber=${page}`);
		  setData(response.data.items);
		  setTotalPages(response.data.totalPages);
		  setLoading(false);
		} catch (err) {
		  setError(err.message);
		  setLoading(false);
		}
	  };
  
	  // Call fetchData function
	  fetchData(currentPage);
	}, [currentPage]); 

	if (loading) {
		return <p>Loading...</p>;
	}
	
	if (error) {
		return <p>Error: {error}</p>;
	}

	const handlePreviousPage = () => {
		if (currentPage > 1) {
		  setCurrentPage(currentPage - 1);
		}
	  };
	
	  const handleNextPage = () => {
		if (currentPage < totalPages) {
		  setCurrentPage(currentPage + 1);
		}
	  };
	
  return (
	<div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Closest Appointment</th>
		  <th>Meeting Type</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.name}</td>
			<td>{moment(row.closestAppointment.appointmentDate).format('MM/DD/YYYY hh:mm:ss')}</td>
			<td>{row.closestAppointment.meetingType.name}</td>
          </tr>
        ))}
      </tbody>
	  
    </table>
	<div>
		<button onClick={handlePreviousPage} disabled={currentPage === 1}>
	  		Previous
		</button>
		<span>
	  		Page {currentPage} of {totalPages}
		</span>
		<button onClick={handleNextPage} disabled={currentPage === totalPages}>
	  		Next
		</button>
  	</div>
	</div>
  );
};

export default PatientsListComponent;