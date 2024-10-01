import './App.css';
import { useEffect, useState } from 'react';

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = 'http://h9mzzn-4000.csb.app/guests/';

  // GET METHOD
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(baseUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allGuests = await response.json();
        console.log('Success:', allGuests);
        setGuests(allGuests);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData().catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  console.log(guests);

  // POST METHOD
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: firstName, lastName: lastName }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const createdGuest = await response.json();
      setGuests((prevGuests) => [...prevGuests, createdGuest]);

      setFirstName(''); // Clearing the input fields
      setLastName(''); // Clearing the input fields
      console.log('Success:', createdGuest);
    } catch (error) {
      console.error('Error', error);
    }
  };

  // HANDLE CHECKBOX CHANGE, PUT REQUEST
  const handleToggle = (id) => {
    const updatedGuests = guests.map((guest) => {
      if (guest.id === id) {
        const updatedGuest = { ...guest, attending: !guest.attending };

        // SEND PUT REQUEST TO UPDATE THE GUEST ON THE SERVER
        const updateGuestOnServer = async () => {
          try {
            const response = await fetch(`${baseUrl}${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ attending: updatedGuest.attending }),
            });

            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            console.log('Guest updated successfully');
          } catch (error) {
            console.error('Error updating guest:', error);
          }
        };

        updateGuestOnServer().catch((error) => {
          console.error('Error fetching data:', error);
        });

        return updatedGuest;
      }
      return guest;
    });
    setGuests(updatedGuests);
  };

  // HANDLE GUEST DELETION / DELETE REQUEST
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${baseUrl}${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response not ok');
      }
      console.log(`Guest with id ${id} deleted successfully`);

      // Remove the guest from the UI by filtering the array
      setGuests((prevGuests) => prevGuests.filter((guest) => guest.id !== id));
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  // if (isLoading) {
  //   return 'Loading...';
  // }

  return (
    <>
      <div
        className="hero"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '40px',
          paddingBottom: '40px',
          paddingTop: '40px',
        }}
      >
        <h2>Add Guest</h2>
        {isLoading ? (
          'Loading...'
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <label htmlFor="First name">First name</label>
            <input
              value={firstName}
              id="First name"
              onChange={(e) => setFirstName(e.target.value)}
              // disabled={isLoading}
              style={{
                marginBottom: '15px',
                minWidth: '250px',
                marginTop: '5px',
                border: '1px solid #a1a1a1',
                borderRadius: '5px',
                height: '23px',
              }}
            />
            <label htmlFor="Last name">Last name</label>
            <input
              value={lastName}
              id="Last name"
              onChange={(e) => setLastName(e.target.value)}
              // disabled={isLoading}
              style={{
                marginBottom: '15px',
                minWidth: '250px',
                marginTop: '5px',
                border: '1px solid #a1a1a1',
                borderRadius: '5px',
                height: '23px',
              }}
            />
            <button
              // disabled={isLoading}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: '#BDA882',
                color: 'white',
                fontWeight: '600',
              }}
            >
              Add Guest
            </button>
          </form>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '40px',
        }}
      >
        <h2>Guest List</h2>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginLeft: '20px',
          borderBottom: '1px solid #BDA882',
        }}
      >
        <h4 style={{ color: '#bda881' }}>GUEST NAME</h4>
        <h4 style={{ color: '#bda881' }}>ATTENDING</h4>
        <h4 style={{ color: '#bda881' }}>STATUS</h4>
        <h4 style={{ color: '#bda881' }}>REMOVE GUEST</h4>
      </div>
      {guests.map((guest) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              borderBottom: '1px solid #cccccc',
              marginLeft: '20px',
            }}
            key={`guest-${guest.id}`}
            data-test-id="guest"
          >
            <h4>{guest.firstName + ' ' + guest.lastName}</h4>

            <input
              type="checkbox"
              checked={guest.attending}
              onChange={() => handleToggle(guest.id)}
              aria-label={`${guest.firstName} ${guest.lastName} attending status`}
            />

            <h4 style={{ color: guest.attending ? 'green' : 'red' }}>
              {guest.attending ? 'attending' : 'not attending'}
            </h4>
            <button
              style={{
                padding: '10px 15px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                background: '#7a2f2a',
                color: 'white',
                fontWeight: '500',
                fontSize: '12px',
              }}
              aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
              onClick={() => handleDelete(guest.id)}
            >
              Remove
            </button>
          </div>
        );
      })}
    </>
  );
}
