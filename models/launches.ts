import { log, _ } from '../src/deps.ts';
interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: Array<string>;
  launchDate: number;
  upcoming: boolean;
  // Optional since upcoming launches are of undetermined success
  success?: boolean;
  // Historical launches don't have a planet target
  target?: string;
}

// key that are numbers that map to launches interfacce
const launches = new Map<number, Launch>();

export async function downloadLaunchData() {
  log.info("Downloading launch data...");
  log.warning("Warning!");
  const response = await fetch("https://api.spacexdata.com/v3/launches", {
    method: "GET"
  });

  // This checks if the HTTP request response code is ok (in 200 range)
  if(!response.ok) {
    log.warning("Problem downloading launch data.");
    throw new Error("Launch data download failed.");
  }

  const launchData = await response.json();
  for (const launch of launchData) {
    const payloads = launch["rocket"]["second_stage"]["payloads"];
    const customers = _.flatMap(payloads, (payload: any) => {
      return payload["customers"];
    })
    const flightData = {
      flightNumber: launch["flight_number"],
      mission: launch["mission_name"],
      rocket: launch["rocket"]["rocket_name"],
      launchDate: launch["launch_date_unix"],
      upcoming: launch["upcoming"],
      success: launch["launch_success"],
      customers: customers
      // No target field since any fetched data won't have a target
    };

    // Sets our launch object with a key of flightNumber and our flightData as value
    launches.set(flightData.flightNumber, flightData);

    log.info(JSON.stringify(flightData));
  }
};

// We want to import our data if our module is imported elsewhere so will remove import.meta.main
await downloadLaunchData();
log.info(`Downloaded data for ${launches.size} SpaceX launches`);

// If our launches map is our DB, getAll is the query to our launches map
export function getAll() {
  // We want to get our data into JSON instead of a map. So we will take out our values from the map and
  // turn that into a list that we can use in our map
  return Array.from(launches.values());
};

export function getOne(id: number) {
  if(launches.has(id)) {
    return launches.get(id);
  }
  return null;
};

export function addOne(data : Launch) {
  launches.set(data.flightNumber, Object.assign(data, {
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"]
  }));
};

export function removeOne(id: number) {
  const aborted = launches.get(id);
  if(aborted) {
    aborted.upcoming = false;
    aborted.success = false;
  }
  return aborted;
}