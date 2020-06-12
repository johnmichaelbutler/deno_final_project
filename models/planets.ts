import { join } from "https://deno.land/std/path/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import { parse } from "https://deno.land/std/encoding/csv.ts";
import * as _ from "https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/lodash.js";
import * as log from "https://deno.land/std/log/mod.ts";
// interface Planet {
//  An object where the index "hence the braces" are our key which is a string and the value is a string
// [ key : string ] : string
// };

// This is the same as the code above but more readable
type Planet = Record<string, string>;

let planets : Array<Planet>;

export function filterHabitablePlanets(planets: Array<Planet>) {
  return planets.filter((planet) => {
    const planetaryRadius = Number(planet["koi_prad"]);
    const stellarMass = Number(planet["koi_smass"]);
    const stellarRadius = Number(planet["koi_srad"]);
    return planet["koi_disposition"] === "CONFIRMED"
      && planetaryRadius > 0.5 && planetaryRadius < 1.5
      && stellarMass > 0.78 && stellarMass < 1.04
      && stellarRadius > 0.99 && stellarRadius < 1.01;
  });
}


async function loadPlanetsData() {
  // Gives us the path of the file we want regardless of OS
  const path = join("data", "kepler_exoplanets_nasa.csv");
  // Async Opening of the file
  const file = await Deno.open(path);
  // Uses BufReader class function from std to create a new bufReader which we will pass to another lib to parse our csv
  const bufReader = new BufReader(file);
  // Will parse our bufReader into a readable CSV file. Taking options we get from documentation saying to parse header and what our comment symbol is
  const result = await parse(bufReader, {
    header: true,
    comment: "#"
  });
  // Don't forget to close file to prevent memory leaks
  Deno.close(file.rid);

  const planets = filterHabitablePlanets(result as Array<Planet>);


  return planets.map((planet) => {
    return _.pick(planet, [
      "koi_prad",
      "koi_smass",
      "koi_srad",
      "kepler_name",
      "koi_count",
      "koi_steff",
      "koi_period"
    ])
  });
}

planets = await loadPlanetsData();

log.info(`${planets.length} habitable planets found!`);

export function getAllPlanets() {
  return planets;
}