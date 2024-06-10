import React, { useEffect, useState, useCallback } from 'react';
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


    const fetchData = useCallback(async (page, query) => {
	    setLoading(true);
		try {
		  const response = await axios.get(endPoint, {
			params: {
			  page: page,
			  query: query
			}
		  });
		  setData(response.data.items);
		  setTotalPages(response.data.totalPages);
		} catch (err) {
		  setError(err.message);
		} finally {
		  setLoading(false);
		}
	  }, [endPoint]);
	
	  useEffect(() => {
		fetchData(currentPage, '');
	  }, [currentPage, fetchData]); 

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
		if (isNaN(value) && value.length < 3) {
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
		  
		  setSuggestions(response.data.items || []);
		} catch (err) {
		  console.error('Error fetching suggestions:', err);
		  setSuggestions([]);
		}
	  };
	
	  const handleSuggestionsClearRequested = () => {
		setSuggestions([]);
	  };
	
	  const getSuggestionValue = (suggestion) => suggestion.name; 
	
	  const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;
	
	  const onSuggestionSelected = (_, { suggestion }) => {
		setSearchValue(suggestion.name);
		setCurrentPage(1);
		fetchData(1, suggestion.name); 
	  };
	
	  const handleSubmit = (event) => {
		event.preventDefault();
		setCurrentPage(1);
		fetchData(1, searchValue);
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