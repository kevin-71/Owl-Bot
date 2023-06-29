import moment from 'moment-timezone';
import axios from 'axios';
import ical, { CalendarResponse  } from "node-ical";

export async function get_agenda(url: string): Promise<CalendarResponse> {
    const response = await axios.get(url);
    const cal = ical.parseICS(response.data);
   
    return cal;
}

export function get_current_event(calendar: CalendarResponse): any[] {
  const currentUtc = moment.utc();
  const events: any[] = [];
  for (const key in calendar) {
    if (calendar.hasOwnProperty(key)) {
      const event = calendar[key];
      if (event.type === 'VEVENT') {
        const start = moment(event.start)
        const end = moment(event.end)
        const summary = event.summary;
        const location = event.location;
        const description = event.description;
        events.push({
          start,
          end,
          nom_cours: summary,
          salle: location,
          nom_prof: description,
        });
      }
    }
  }
  
  return events;
}
export function date_cours(cal: CalendarResponse, DATE: string): CourseInfo[] {
 
  const events = get_current_event(cal);
  
  const targetDate = moment(DATE).toDate();
 
  const courseInfoList: CourseInfo[] = [];
 
  for (const event of events) {
    const eventStartDate = moment(event.start).toDate();
    if (moment(eventStartDate).isSame(targetDate, 'day')) {
      const courseInfo: CourseInfo = {
        nom_cours: event.nom_cours,
        salle: event.salle,
        start: moment(event.start).format('HH:mm'),
        end: moment(event.end).format('HH:mm'),
      };
      courseInfoList.push(courseInfo);
    }
  }

  console.log(courseInfoList);

  return courseInfoList;
}

interface CourseInfo {
  nom_cours: string;
  salle: string;
  start: string;
  end: string;
}

export function transfo_date(date: string): string {
    let transformedDate: string = date;

    if (date === "today" || date === "") {
      const date_jour = moment.utc();
      const date_str = date_jour.format();
      const date_a = date_str.split("T");
      transformedDate = date_a[0];
    }
  
    if (date.length === 2) {
      const date_jour = moment.utc();
      const date_str = date_jour.format();
      const date_split = date_str.split("T");
      const date_annee = date_split[0];
      const date_a = date_annee.split("-");
      if (date_a[2] > date) {
        const mois_modifier = parseInt(date_a[1]) + 1;
        if (mois_modifier < 10 && mois_modifier >= 1) {
          date_a[1] = `0${mois_modifier}`;
        } else {
          date_a[1] = `${parseInt(date_a[1]) + 1}`;
        }
        console.log(date_a, "modifier");
      }
      date_a[2] = date;
      console.log(date_a);
      transformedDate = `${date_a[0]}-${date_a[1]}-${date_a[2]}`;
      console.log(transformedDate);
    }
    return transformedDate;
  }