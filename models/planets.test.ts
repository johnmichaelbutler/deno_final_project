/**
 * Deno include:
 *
 * 1. The test runner in the CLI.
 * 2. Assertions in the standard library.
 * 3. Built-in test features with Deno.test()
 */

import { assertEquals, assertNotEquals } from 'https://deno.land/std/testing/asserts.ts';

import { filterHabitablePlanets } from './planets.ts';

const HABITABLE_PLANET = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_srad: "1",
  koi_smass: "1",
}

const NOT_CONFIRMED = {
  koi_disposition: "FALSE POSITIVE"
};

const TOO_LARGE_PLANETARY_RADIUS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1.5",
  koi_srad: "1",
  koi_smass: "1",
}

const TOO_LARGE_SOLAR_RADIUS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_srad: "1.01",
  koi_smass: "1",
};

const TOO_LARGE_SOLAR_MASS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_srad: "1.",
  koi_smass: "1.04",
};

Deno.test("filter only habitable planets", () => {
  const filtered = filterHabitablePlanets([
    HABITABLE_PLANET,
    NOT_CONFIRMED,
    TOO_LARGE_PLANETARY_RADIUS,
    TOO_LARGE_SOLAR_RADIUS,
    TOO_LARGE_SOLAR_MASS]);

  assertEquals(filtered, [
    HABITABLE_PLANET
  ])
})



Deno.test({
  name: "example test",
  ignore: Deno.build.os === "darwin",
  fn() {
    assertEquals("deno", "deno");
    assertNotEquals({
      runtime: "deno",
    }, {
      runtime: "node",
    })
  }
});