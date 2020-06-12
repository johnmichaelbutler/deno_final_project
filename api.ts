import { Router } from 'https://deno.land/x/oak@v5.0.0/mod.ts';
// import * as log from "https://deno.land/std/log/mod.ts";
import * as planets from './models/planets.ts';
import * as launches from "./models/launches.ts"

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = `
  {___     {__      {_         {__ __        {_
    {_ {__   {__     {_ __     {__    {__     {_ __
    {__ {__  {__    {_  {__     {__          {_  {__
    {__  {__ {__   {__   {__      {__       {__   {__
    {__   {_ {__  {______ {__        {__   {______ {__
    {__    {_ __ {__       {__ {__    {__ {__       {__
    {__      {__{__         {__  {__ __  {__         {__
                    Mission Control API`;
});

router.get("/planets", (ctx) => {
  ctx.response.body = planets.getAllPlanets();
  // log.info(ctx.response.body)
});

router.get("/launches", (ctx) => {
  ctx.response.body = launches.getAll();
})

router.get("/launches/:id", (ctx) => {
  // If there is an id in the params, we want to get data from that one launch. Also make params optional which will return undefined if not there
  if (ctx.params?.id) {
    const launchesList = launches.getOne(Number(ctx.params.id))
    if(launchesList) {
      ctx.response.body = launchesList;
    } else {
      ctx.throw(400, "Launch with that ID doesn't exist");
    }
  }
})

export default router;