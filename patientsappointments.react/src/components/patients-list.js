import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Autosuggest from 'react-autosuggest';

const PatientsListComponent = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
  	const [totalPages, setTotalPages] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
	const endPoint = `https://localhost:5001/api/patients/patientsList`;


    const fetchData = async (page, searchValue = '') => {
		setLoading(true);
		try {
		  const response = await axios.get(endPoint, {
			params: {
			  page: page,
			  query: searchValue // Added search parameter
			}
		  });
		  setData(response.data.items); // Assuming the response has an 'items' field with the data
		  setTotalPages(response.data.totalPages); // Assuming the response has a 'totalPages' field
		  setLoading(false);
		} catch (err) {
		  setError(err.message);
		  setLoading(false);
		}
    };

	useEffect(() => {
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

	  const handleChange = (event, { newValue }) => {
		setSearchValue(newValue);
	  };
	
	  const handleSuggestionsFetchRequested = async ({ value }) => {
		if (value.length < 3) {
			setSuggestions([]);
			return;
		}

		try {
		  const response = await axios.get(endPoint, {
			params: {
			  page: 1,
			  query: value
			}
		  });
		  
		  setSuggestions(response.data.items || []); // Ensure suggestions is an array
		} catch (err) {
		  console.error('Error fetching suggestions:', err);
		  setSuggestions([]); // Reset suggestions on error
		}
	  };
	
	  const handleSuggestionsClearRequested = () => {
		setSuggestions([]);
	  };
	
	  const getSuggestionValue = (suggestion) => suggestion.name; // Assuming the suggestion object has a 'name' field
	
	  const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>; // Assuming the suggestion object has a 'name' field
	
	  const onSuggestionSelected = (_, { suggestion }) => {
		setSearchValue(suggestion.name);
		setCurrentPage(1);
		fetchData(1, suggestion.name); // Fetch data based on the selected suggestion
	  };
	
	  const handleSubmit = (event) => {
		event.preventDefault();
		setCurrentPage(1);
		fetchData(1, searchValue); // Perform search with the searchValue
	  };
	
	  const inputProps = {
		placeholder: 'Search...',
		value: searchValue,
		onChange: handleChange,
	  };

	
  return (
	<div>
      <form onSubmit={handleSubmit}>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={handleSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={onSuggestionSelected}
          inputProps={inputProps}
        />
        <button type="submit">Search</button>
      </form>
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