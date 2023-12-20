// import { useLoaderData } from 'react-router-dom';
import { Link } from 'react-router-dom';

import classes from './EventsList.module.css';

function EventsList({events}) {
  // const events = useLoaderData();

  return (
    <div className={classes.events}>
      <h1>All Pets</h1>
      <ul className={classes.list}>
        {events.map((event) => (
          <li key={event.id} className={classes.item}>
            <Link to={`/events/${event.id}`}>
              <img src={event.image} alt={event.title} />
              <div className={classes.content}>
                <h1 style={{ color: 'skyblue' }}>{event.type}</h1>
                <h2>{event.title}</h2>
                <time>This pet became our family on {event.date}</time>
                {event.price && <p style={{ color: 'goldenrod' }}>Price: ${event.price}</p>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsList;
