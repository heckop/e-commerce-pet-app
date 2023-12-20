import { Suspense } from 'react';
import {
  useRouteLoaderData,
  json,
  redirect,
  defer,
  Await,
} from 'react-router-dom';
import Axios from 'axios';

import EventItem from '../components/EventItem';
import EventsList from '../components/EventsList';
import { getAuthToken } from '../util/auth';

function EventDetailPage() {
  const { event, events } = useRouteLoaderData('event-detail');

  return (
    <>
      <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
        <Await resolve={event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>
      <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

export default EventDetailPage;

async function loadEvent(id) {
  const clientId = process.env.CLIENT_SECRET_KEY;
  const url = "https://api.unsplash.com/photos/"+id+"?&client_id="+clientId;
  var res;
  await Axios.get(url).then(
    (response) => {
      res=response;
      console.log(response.data);
    }
  ).catch((err)=>{
    throw json(
      { message: err.message },
      {
        status: err.status,
      }
    );
  });
  const pet ={
      type:res.data.tags[1].title,
      petId: res.data.id,
      title: res.data.alt_description,
      description: res.data.description,
      image: res.data.urls.full,
      date: res.data.created_at,
  } ;
  return pet;
  }


async function loadEvents() {
  const clientId = process.env.CLIENT_SECRET_KEY;
  const url = "https://api.unsplash.com/search/photos?query=animal&client_id="+clientId+"&per_page=100";
  var res;
  await Axios.get(url).then(
    (response) => {
      res=response;
      console.log(response.data);
    }
  ).catch((err)=>{
    throw json(
      { message: err.message },
      {
        status: err.status,
      }
    );
  });
  const pets = res.data.results.map((pet)=>{
    const originalDate = new Date(pet.created_at);
    const dateObj = new Date(originalDate);
    const day = dateObj.getUTCDate();
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getUTCFullYear();
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
    const seconds = dateObj.getUTCSeconds();
    const pet_date = `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
    return {
      petId: pet.id,
      title: pet.alt_description,
      description: pet.description,
      image: pet.urls.small,
      date: pet_date,
    };
  });
  return pets;
}

export async function loader({ request, params }) {
  const id = params.eventId;

  return defer({
    event: await loadEvent(id),
    events: loadEvents(),
  });
}

export async function action({ params, request }) {
  const eventId = params.eventId;

  const token = getAuthToken();
  const response = await fetch('http://localhost:8080/events/' + eventId, {
    method: request.method,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  if (!response.ok) {
    throw json(
      { message: 'Could not delete event.' },
      {
        status: 500,
      }
    );
  }
  return redirect('/events');
}
